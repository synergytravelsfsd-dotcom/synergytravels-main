import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import leadsRoutes from './leadsRoutes.mjs';
import salesRoutes from './salesRoutes.mjs';
import travelRoutes from './travelRoutes.mjs';
import { hasDatabase, ensureSchema } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PAYMENT_PORT || 4242);
const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const CURRENCY = (process.env.PAYMENT_CURRENCY || 'gbp').toLowerCase();

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const paypalClientId = process.env.PAYPAL_CLIENT_ID || '';
const paypalSecret = process.env.PAYPAL_CLIENT_SECRET || '';
const paypalEnv = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const paypalBase =
  paypalEnv === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

const allowedOrigins = (process.env.CORS_ORIGINS || CLIENT_URL)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
      // Dev convenience
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
      // Vercel preview / production deployments
      if (/\.vercel\.app$/i.test(origin)) return cb(null, true);
      return cb(null, false);
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1', leadsRoutes);
app.use('/api/v1', salesRoutes);
app.use('/api/v1', travelRoutes);

function toMinorUnits(amount) {
  return Math.max(50, Math.round(Number(amount) * 100));
}

function validateCart(body) {
  const { items, billing, amount } = body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return 'Cart is empty';
  }
  if (!billing?.email || !billing?.firstName || !billing?.lastName) {
    return 'Billing details incomplete';
  }
  if (!amount || Number(amount) <= 0) {
    return 'Invalid amount';
  }
  return null;
}

async function getPayPalAccessToken() {
  if (!paypalClientId || !paypalSecret) {
    throw new Error('PayPal is not configured');
  }
  const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64');
  const res = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

app.get('/api/payments/config', (_req, res) => {
  res.json({
    currency: CURRENCY,
    stripeEnabled: Boolean(stripeSecret && process.env.STRIPE_PUBLISHABLE_KEY),
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    paypalEnabled: Boolean(paypalClientId && paypalSecret),
    paypalClientId,
    paypalEnv,
    bankTransferEnabled: Boolean(process.env.BANK_ACCOUNT_NAME || process.env.WISE_EMAIL || process.env.REVOLUT_TAG),
    methods: {
      card: Boolean(stripeSecret),
      paypal: Boolean(paypalClientId && paypalSecret),
      wise: Boolean(process.env.WISE_EMAIL || process.env.WISE_ACCOUNT_DETAILS),
      revolut: Boolean(process.env.REVOLUT_TAG || process.env.REVOLUT_ACCOUNT_DETAILS),
      bank: Boolean(process.env.BANK_ACCOUNT_NAME),
    },
    bankDetails: {
      accountName: process.env.BANK_ACCOUNT_NAME || '',
      bankName: process.env.BANK_NAME || '',
      sortCode: process.env.BANK_SORT_CODE || '',
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || '',
      iban: process.env.BANK_IBAN || '',
      bic: process.env.BANK_BIC || '',
      wiseEmail: process.env.WISE_EMAIL || '',
      wiseDetails: process.env.WISE_ACCOUNT_DETAILS || '',
      revolutTag: process.env.REVOLUT_TAG || '',
      revolutDetails: process.env.REVOLUT_ACCOUNT_DETAILS || '',
      referencePrefix: process.env.PAYMENT_REFERENCE_PREFIX || 'STT',
    },
  });
});

app.post('/api/payments/stripe/checkout', async (req, res) => {
  try {
    const error = validateCart(req.body);
    if (error) return res.status(400).json({ error });
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY.' });

    const { items, billing, amount, notes } = req.body;
    const reference = `${process.env.PAYMENT_REFERENCE_PREFIX || 'STT'}-${Date.now().toString().slice(-8)}`;

    const line_items = items.map((item) => {
      const adults = Number(item.adults) || 1;
      const children = Number(item.children) || 0;
      const unit = Number(item.unitPrice) || 0;
      const lineTotal = adults * unit + children * Math.round(unit * 0.7);
      return {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: toMinorUnits(lineTotal),
          product_data: {
            name: item.title || 'Travel package',
            description: `${item.tripCode || ''} · ${item.startDate || ''} → ${item.endDate || ''} · ${adults} adult(s), ${children} child(ren)`.trim(),
            images: item.image ? [item.image] : undefined,
          },
        },
      };
    });

    // Ensure checkout total roughly matches cart if line items empty edge case
    if (!line_items.length) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: toMinorUnits(amount),
          product_data: { name: 'Synergy Travels & Tour booking' },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: billing.email,
      client_reference_id: reference,
      // Card + wallets enabled in Stripe Dashboard (Visa/Mastercard/Amex, Link, etc.)
      payment_method_types: ['card'],
      line_items,
      success_url: `${CLIENT_URL}/?payment=success&ref=${encodeURIComponent(reference)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/?payment=cancelled&ref=${encodeURIComponent(reference)}`,
      metadata: {
        reference,
        phone: billing.phone || '',
        name: `${billing.firstName} ${billing.lastName}`,
        country: billing.country || '',
        notes: (notes || '').slice(0, 400),
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
    });

    res.json({ url: session.url, reference, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error', err);
    res.status(500).json({ error: err.message || 'Unable to start Stripe checkout' });
  }
});

app.post('/api/payments/paypal/create-order', async (req, res) => {
  try {
    const error = validateCart(req.body);
    if (error) return res.status(400).json({ error });

    const { amount, billing, items } = req.body;
    const reference = `${process.env.PAYMENT_REFERENCE_PREFIX || 'STT'}-${Date.now().toString().slice(-8)}`;
    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(`${paypalBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: reference,
            description: `Synergy Travels & Tour booking for ${billing.firstName} ${billing.lastName}`.slice(
              0,
              127
            ),
            custom_id: reference,
            amount: {
              currency_code: CURRENCY.toUpperCase(),
              value: Number(amount).toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Synergy Travels & Tour',
          user_action: 'PAY_NOW',
          return_url: `${CLIENT_URL}/?payment=success&ref=${encodeURIComponent(reference)}`,
          cancel_url: `${CLIENT_URL}/?payment=cancelled&ref=${encodeURIComponent(reference)}`,
        },
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(order?.message || JSON.stringify(order));
    }

    res.json({ orderId: order.id, reference });
  } catch (err) {
    console.error('PayPal create order error', err);
    res.status(500).json({ error: err.message || 'Unable to create PayPal order' });
  }
});

app.post('/api/payments/paypal/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    const accessToken = await getPayPalAccessToken();
    const captureRes = await fetch(`${paypalBase}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const capture = await captureRes.json();
    if (!captureRes.ok) {
      throw new Error(capture?.message || JSON.stringify(capture));
    }
    res.json({ capture });
  } catch (err) {
    console.error('PayPal capture error', err);
    res.status(500).json({ error: err.message || 'Unable to capture PayPal order' });
  }
});

app.post('/api/payments/bank/intent', (req, res) => {
  const error = validateCart(req.body);
  if (error) return res.status(400).json({ error });
  const reference = `${process.env.PAYMENT_REFERENCE_PREFIX || 'STT'}-${Date.now().toString().slice(-8)}`;
  const method = req.body.method || 'bank';
  res.json({
    reference,
    method,
    amount: Number(req.body.amount).toFixed(2),
    currency: CURRENCY.toUpperCase(),
    instructions:
      'Transfer the exact amount and use the payment reference in the transfer note. Then send proof via WhatsApp or Email so we can confirm your booking.',
  });
});

app.post('/api/payments/quote/bank-intent', async (req, res) => {
  try {
    const { getQuoteByToken, updateQuote } = await import('./quotesStore.mjs');
    const token = String(req.body?.token || '');
    const quote = await getQuoteByToken(token);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    if (!['ACCEPTED', 'PAYMENT_PENDING', 'VIEWED', 'SENT'].includes(quote.status)) {
      return res.status(400).json({ error: 'Quote is not payable in its current status' });
    }
    const reference =
      quote.paymentReference ||
      `${process.env.PAYMENT_REFERENCE_PREFIX || 'STT'}-${quote.id.replace('QT-', '')}`;
    const amount = Number(req.body?.full ? quote.sellTotal : quote.depositAmount || quote.sellTotal);
    await updateQuote(quote.id, {
      status: 'PAYMENT_PENDING',
      paymentReference: reference,
    });
    res.json({
      reference,
      method: 'bank',
      amount: amount.toFixed(2),
      currency: (quote.currency || CURRENCY).toUpperCase(),
      quoteId: quote.id,
      instructions:
        'Transfer the exact amount and use the payment reference in the transfer note. Then send proof via WhatsApp or Email so we can confirm your booking.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to create quote payment intent' });
  }
});

app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  if (hasDatabase()) {
    try {
      dbOk = Boolean(await ensureSchema());
    } catch {
      dbOk = false;
    }
  }
  res.json({
    ok: true,
    stripe: Boolean(stripe),
    paypal: Boolean(paypalClientId && paypalSecret),
    leads: true,
    sales: true,
    travel: true,
    crmConfigured: Boolean(process.env.CRM_ADMIN_TOKEN),
    database: hasDatabase() ? (dbOk ? 'postgres' : 'error') : 'file',
    runtime: process.env.VERCEL ? 'vercel' : 'node',
  });
});

export default app;

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Synergy API listening on http://127.0.0.1:${PORT}`);
    console.log(
      `Stripe: ${stripe ? 'configured' : 'missing'} | PayPal: ${
        paypalClientId && paypalSecret ? 'configured' : 'missing'
      } | CRM: ${process.env.CRM_ADMIN_TOKEN ? 'token set' : 'token missing'}`
    );
  });
}