import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  capturePayPalOrder,
  createBankPaymentIntent,
  createPayPalOrder,
  fetchPaymentsConfig,
  startStripeCheckout,
  type CheckoutPayload,
  type PaymentMethodId,
  type PaymentsConfig,
} from '../constants/payments';
import { BRAND_NAME, getEmailLink, getWhatsAppLink } from '../constants/contact';
import { useCurrency } from '../context/CurrencyContext';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => Promise<void> };
    };
  }
}

type PaymentMethodsProps = {
  payload: CheckoutPayload;
  disabled?: boolean;
  onPaid: (info: { method: string; reference: string }) => void;
};

const METHOD_META: Record<
  PaymentMethodId,
  { label: string; description: string; icon: React.ReactNode }
> = {
  card: {
    label: 'Debit / Credit Card',
    description: 'Visa, Mastercard, Amex via Stripe (secure checkout)',
    icon: <CreditCard className="h-5 w-5" />,
  },
  paypal: {
    label: 'PayPal',
    description: 'Pay with PayPal balance or linked cards',
    icon: <Wallet className="h-5 w-5" />,
  },
  wise: {
    label: 'Wise transfer',
    description: 'Pay by Wise / multi-currency transfer',
    icon: <Building2 className="h-5 w-5" />,
  },
  revolut: {
    label: 'Revolut transfer',
    description: 'Pay to our Revolut business account',
    icon: <Wallet className="h-5 w-5" />,
  },
  bank: {
    label: 'Bank transfer',
    description: 'Direct debit/credit transfer to our bank account',
    icon: <Landmark className="h-5 w-5" />,
  },
};

function loadPayPalSdk(clientId: string, currency: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.paypal) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency.toUpperCase()}&intent=capture`;
    script.async = true;
    script.dataset.paypalSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.body.appendChild(script);
  });
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ payload, disabled, onPaid }) => {
  const { formatPrice } = useCurrency();
  const [config, setConfig] = useState<PaymentsConfig | null>(null);
  const [method, setMethod] = useState<PaymentMethodId>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankIntent, setBankIntent] = useState<{
    reference: string;
    amount: string;
    currency: string;
    instructions: string;
    method: string;
  } | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPaymentsConfig().then((cfg) => {
      setConfig(cfg);
      const first =
        (['card', 'paypal', 'wise', 'revolut', 'bank'] as PaymentMethodId[]).find(
          (id) => cfg.methods[id]
        ) || 'card';
      setMethod(first);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function mountPayPal() {
      if (!config?.paypalEnabled || method !== 'paypal' || !paypalRef.current) return;
      paypalRef.current.innerHTML = '';
      try {
        await loadPayPalSdk(config.paypalClientId, config.currency);
        if (cancelled || !window.paypal || !paypalRef.current) return;
        await window.paypal
          .Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
            createOrder: async () => {
              const order = await createPayPalOrder(payload);
              sessionStorage.setItem('stt_payment_ref', order.reference);
              return order.orderId;
            },
            onApprove: async (data: { orderID: string }) => {
              await capturePayPalOrder(data.orderID);
              const reference = sessionStorage.getItem('stt_payment_ref') || data.orderID;
              onPaid({ method: 'paypal', reference });
            },
            onError: (err: Error) => {
              console.error(err);
              setError(err?.message || 'PayPal payment failed');
            },
          })
          .render(paypalRef.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load PayPal');
      }
    }
    mountPayPal();
    return () => {
      cancelled = true;
    };
  }, [config, method, payload, onPaid]);

  const availableMethods = (Object.keys(METHOD_META) as PaymentMethodId[]).filter(
    (id) => config?.methods?.[id]
  );

  const payWithStripe = async () => {
    setLoading(true);
    setError('');
    try {
      const session = await startStripeCheckout(payload);
      sessionStorage.setItem('stt_payment_ref', session.reference);
      window.location.href = session.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stripe checkout failed');
      setLoading(false);
    }
  };

  const startBankMethod = async (id: 'wise' | 'revolut' | 'bank') => {
    setLoading(true);
    setError('');
    try {
      const intent = await createBankPaymentIntent({ ...payload, method: id });
      setBankIntent(intent);
      setMethod(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create transfer instructions');
    } finally {
      setLoading(false);
    }
  };

  const notifyTransfer = (channel: 'whatsapp' | 'email') => {
    if (!bankIntent) return;
    const details = config?.bankDetails;
    const lines = [
      `Payment notification — ${BRAND_NAME}`,
      `Method: ${bankIntent.method}`,
      `Reference: ${bankIntent.reference}`,
      `Amount: ${bankIntent.amount} ${bankIntent.currency}`,
      `Name: ${payload.billing.firstName} ${payload.billing.lastName}`,
      `Email: ${payload.billing.email}`,
      `Phone: ${payload.billing.phone}`,
      '',
      'I have initiated / completed the transfer. Please confirm once received.',
      details?.wiseEmail ? `Wise: ${details.wiseEmail}` : '',
      details?.revolutTag ? `Revolut: ${details.revolutTag}` : '',
      details?.accountName ? `Bank: ${details.accountName}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    if (channel === 'whatsapp') {
      window.open(getWhatsAppLink(lines), '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = getEmailLink(`Payment proof ${bankIntent.reference}`, lines);
    }
    onPaid({ method: bankIntent.method, reference: bankIntent.reference });
  };

  if (!config) {
    return (
      <div className="rounded-xl border border-slate-200 p-4 text-sm text-gray-600 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading secure payment options…
      </div>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Live payments are not configured yet. Add Stripe / PayPal / bank keys in <code>.env</code> and
        start the payments API (<code>npm run payments</code>). You can still confirm by WhatsApp or Email below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-gray-900 mb-1">Pay securely</h3>
        <p className="text-sm text-gray-600">
          Amount due: <strong>{formatPrice(payload.amount)}</strong> · Cards are processed by Stripe;
          PayPal accepts PayPal balance and cards; Wise / Revolut / bank are transfer options.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {availableMethods.map((id) => (
          <button
            key={id}
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              setBankIntent(null);
              setMethod(id);
              if (id === 'wise' || id === 'revolut' || id === 'bank') {
                startBankMethod(id);
              }
            }}
            className={`text-left rounded-xl border p-3 transition-colors ${
              method === id
                ? 'border-orange-500 bg-orange-50'
                : 'border-slate-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
              {METHOD_META[id].icon}
              {METHOD_META[id].label}
            </div>
            <p className="text-xs text-gray-600 mt-1">{METHOD_META[id].description}</p>
          </button>
        ))}
      </div>

      {method === 'card' && (
        <button
          type="button"
          disabled={disabled || loading}
          onClick={payWithStripe}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#635BFF] hover:bg-[#5851e6] text-white px-4 py-3 font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Pay by card (Stripe Checkout)
        </button>
      )}

      {method === 'paypal' && (
        <div>
          <div ref={paypalRef} className="min-h-[45px]" />
          <p className="text-xs text-gray-500 mt-2">
            PayPal opens a secure window for PayPal balance or card payment.
          </p>
        </div>
      )}

      {(method === 'wise' || method === 'revolut' || method === 'bank') && bankIntent && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-900">Transfer instructions</p>
          <p>
            Amount: <strong>{bankIntent.amount} {bankIntent.currency}</strong>
          </p>
          <p>
            Payment reference: <strong className="text-orange-700">{bankIntent.reference}</strong>
          </p>
          <p className="text-gray-600">{bankIntent.instructions}</p>
          {method === 'wise' && (
            <div className="text-gray-700">
              {config.bankDetails.wiseEmail && <p>Wise email / account: {config.bankDetails.wiseEmail}</p>}
              {config.bankDetails.wiseDetails && <p>{config.bankDetails.wiseDetails}</p>}
            </div>
          )}
          {method === 'revolut' && (
            <div className="text-gray-700">
              {config.bankDetails.revolutTag && <p>Revolut tag: {config.bankDetails.revolutTag}</p>}
              {config.bankDetails.revolutDetails && <p>{config.bankDetails.revolutDetails}</p>}
            </div>
          )}
          {method === 'bank' && (
            <div className="text-gray-700 space-y-0.5">
              {config.bankDetails.accountName && <p>Account name: {config.bankDetails.accountName}</p>}
              {config.bankDetails.bankName && <p>Bank: {config.bankDetails.bankName}</p>}
              {config.bankDetails.sortCode && <p>Sort code: {config.bankDetails.sortCode}</p>}
              {config.bankDetails.accountNumber && <p>Account number: {config.bankDetails.accountNumber}</p>}
              {config.bankDetails.iban && <p>IBAN: {config.bankDetails.iban}</p>}
              {config.bankDetails.bic && <p>BIC/SWIFT: {config.bankDetails.bic}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => notifyTransfer('whatsapp')}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 font-semibold"
            >
              I paid — notify on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => notifyTransfer('email')}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-2.5 font-semibold"
            >
              I paid — notify by Email
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500 flex items-start gap-1.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        Card data never touches our servers. Stripe and PayPal are PCI-compliant processors for debit and
        credit cards.
      </p>
    </div>
  );
};

export default PaymentMethods;
