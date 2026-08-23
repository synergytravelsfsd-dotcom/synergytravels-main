import express from 'express';
import {
  createQuote,
  listQuotes,
  getQuote,
  updateQuote,
  markQuoteViewed,
  acceptQuoteByToken,
  listCustomers,
  listFollowUps,
  salesStats,
  QUOTE_STATUSES,
} from './quotesStore.mjs';

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) {
    return res.status(503).json({
      error: 'CRM admin is not configured. Set CRM_ADMIN_TOKEN on the API host.',
    });
  }
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.get('/sales-stats', requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, ...(await salesStats()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load sales stats' });
  }
});

router.get('/quotes', requireAdmin, async (req, res) => {
  try {
    const quotes = await listQuotes({
      status: req.query.status,
      leadId: req.query.leadId,
      q: req.query.q,
      limit: req.query.limit,
    });
    res.json({ ok: true, quotes, statuses: QUOTE_STATUSES });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list quotes' });
  }
});

router.post('/quotes', requireAdmin, async (req, res) => {
  try {
    const quote = await createQuote(req.body || {});
    res.status(201).json({ ok: true, quote });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create quote' });
  }
});

router.get('/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const quote = await getQuote(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ ok: true, quote });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load quote' });
  }
});

router.patch('/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const quote = await updateQuote(req.params.id, req.body || {});
    res.json({ ok: true, quote });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update quote' });
  }
});

router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const customers = await listCustomers({ q: req.query.q, limit: req.query.limit });
    res.json({ ok: true, customers });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list customers' });
  }
});

router.get('/follow-ups', requireAdmin, async (req, res) => {
  try {
    const followUps = await listFollowUps({ limit: req.query.limit });
    res.json({ ok: true, followUps });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list follow-ups' });
  }
});

/** Public customer quote view (token in path — no admin auth) */
router.get('/public/quotes/:token', async (req, res) => {
  try {
    const quote = await markQuoteViewed(req.params.token);
    res.json({ ok: true, quote });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to load quote' });
  }
});

router.post('/public/quotes/:token/accept', async (req, res) => {
  try {
    const quote = await acceptQuoteByToken(req.params.token);
    res.json({
      ok: true,
      quote,
      payment: {
        reference: quote.paymentReference || null,
        amount: quote.depositAmount || quote.sellTotal,
        currency: quote.currency,
        instructions:
          'Pay the deposit using the reference below via bank transfer, or contact Synergy on WhatsApp to pay by card.',
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to accept quote' });
  }
});

export default router;
