export type PaymentMethodId = 'card' | 'paypal' | 'wise' | 'revolut' | 'bank';

export type PaymentsConfig = {
  currency: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalEnv: string;
  bankTransferEnabled: boolean;
  methods: Record<PaymentMethodId, boolean>;
  bankDetails: {
    accountName: string;
    bankName: string;
    sortCode: string;
    accountNumber: string;
    iban: string;
    bic: string;
    wiseEmail: string;
    wiseDetails: string;
    revolutTag: string;
    revolutDetails: string;
    referencePrefix: string;
  };
};

export type CheckoutPayload = {
  amount: number;
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: Array<{
    id: string;
    tripId: string;
    title: string;
    image: string;
    unitPrice: number;
    adults: number;
    children: number;
    startDate: string;
    endDate: string;
    tripCode: string;
  }>;
  notes?: string;
};

const API_BASE = import.meta.env.VITE_PAYMENTS_API_URL || '';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Payment request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchPaymentsConfig(): Promise<PaymentsConfig> {
  try {
    return await api<PaymentsConfig>('/api/payments/config');
  } catch {
    return {
      currency: 'gbp',
      stripeEnabled: false,
      stripePublishableKey: '',
      paypalEnabled: false,
      paypalClientId: '',
      paypalEnv: 'sandbox',
      bankTransferEnabled: false,
      methods: { card: false, paypal: false, wise: false, revolut: false, bank: false },
      bankDetails: {
        accountName: '',
        bankName: '',
        sortCode: '',
        accountNumber: '',
        iban: '',
        bic: '',
        wiseEmail: '',
        wiseDetails: '',
        revolutTag: '',
        revolutDetails: '',
        referencePrefix: 'STT',
      },
    };
  }
}

export async function startStripeCheckout(payload: CheckoutPayload) {
  return api<{ url: string; reference: string; sessionId: string }>(
    '/api/payments/stripe/checkout',
    { method: 'POST', body: JSON.stringify(payload) }
  );
}

export async function createPayPalOrder(payload: CheckoutPayload) {
  return api<{ orderId: string; reference: string }>('/api/payments/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function capturePayPalOrder(orderId: string) {
  return api<{ capture: unknown }>('/api/payments/paypal/capture-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function createBankPaymentIntent(
  payload: CheckoutPayload & { method: 'wise' | 'revolut' | 'bank' }
) {
  return api<{
    reference: string;
    method: string;
    amount: string;
    currency: string;
    instructions: string;
  }>('/api/payments/bank/intent', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
