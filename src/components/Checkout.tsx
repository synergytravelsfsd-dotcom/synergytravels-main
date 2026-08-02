import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { cartItemTotal, useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { BRAND_NAME, getEmailLink, getWhatsAppLink } from '../constants/contact';
import PaymentMethods from './PaymentMethods';
import type { CheckoutPayload } from '../constants/payments';

type CheckoutProps = {
  onBack: () => void;
};

const STEPS = ['Select a Date', 'Review Package', 'Pay & Confirm'] as const;

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { items, subtotal, updateItem, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United Kingdom',
  });

  const missingDates = items.some((i) => !i.startDate);
  const [paymentDone, setPaymentDone] = useState<{ method: string; reference: string } | null>(null);

  const paymentPayload: CheckoutPayload = useMemo(
    () => ({
      amount: subtotal,
      billing,
      items: items.map((item) => ({
        id: item.id,
        tripId: item.tripId,
        title: item.title,
        image: item.image,
        unitPrice: item.unitPrice,
        adults: item.adults,
        children: item.children,
        startDate: item.startDate,
        endDate: item.endDate,
        tripCode: item.tripCode,
      })),
      notes: items.map((i) => `${i.title} ${i.startDate}`).join(' | '),
    }),
    [billing, items, subtotal]
  );

  const bookingMessage = useMemo(() => {
    const lines = [
      `Booking confirmation request — ${BRAND_NAME}`,
      '',
      'Billing details:',
      `Name: ${billing.firstName} ${billing.lastName}`,
      `Email: ${billing.email}`,
      `Phone: ${billing.phone}`,
      `Address: ${billing.address}, ${billing.city}, ${billing.country}`,
      '',
      'Trip cart:',
    ];

    items.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. ${item.title} (${item.tripCode})`,
        `   Dates: ${item.startDate || 'TBD'} → ${item.endDate || 'TBD'}`,
        `   Travellers: ${item.adults} adult(s), ${item.children} child(ren)`,
        `   Guide total: ${item.unitPrice} x travellers ≈ ${cartItemTotal(item)}`,
        ''
      );
    });

    lines.push(`Cart guide subtotal: ${subtotal}`);
    lines.push('');
    lines.push(
      'Please confirm live availability, final fare, and payment instructions. I agree to proceed with this booking enquiry.'
    );
    return lines.join('\n');
  }, [billing, items, subtotal]);

  const billingComplete = Boolean(
    billing.firstName.trim() &&
      billing.lastName.trim() &&
      billing.email.trim() &&
      billing.phone.trim() &&
      billing.address.trim() &&
      billing.city.trim()
  );

  const validateBilling = () => {
    if (!billingComplete) {
      alert('Please complete all billing details.');
      return false;
    }
    if (!agreed) {
      alert('Please confirm you agree to the terms before booking.');
      return false;
    }
    return true;
  };

  const confirmVia = (channel: 'whatsapp' | 'email') => {
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (missingDates) {
      alert('Please select a start date for every trip in your cart.');
      setStep(0);
      return;
    }
    if (!validateBilling()) return;

    const subject = `Trip Booking — ${BRAND_NAME}`;
    if (channel === 'whatsapp') {
      window.open(getWhatsAppLink(bookingMessage), '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = getEmailLink(subject, bookingMessage);
    }
    clearCart();
  };

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add a package before checkout.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-5 py-2.5 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Browse packages
        </button>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {STEPS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${
                  step === index
                    ? 'bg-orange-600 text-white border-orange-600'
                    : index < step
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">1. Select travel dates</h2>
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 p-4 space-y-2">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <label className="block text-sm text-gray-600">Starts on *</label>
                  <input
                    type="date"
                    value={item.startDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                    className="w-full sm:w-72 px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                  {item.endDate && (
                    <p className="text-sm text-gray-500">Ends on: {item.endDate}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                disabled={missingDates}
                onClick={() => setStep(1)}
                className="rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2.5 font-semibold"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">2. Review package & travellers</h2>
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex gap-3">
                    <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.tripCode} · {item.startDate} → {item.endDate}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {item.adults} adult(s) × {formatPrice(item.unitPrice)}
                        {item.children > 0 &&
                          ` · ${item.children} child(ren) × ${formatPrice(Math.round(item.unitPrice * 0.7))}`}
                      </p>
                      <p className="font-semibold text-orange-600 mt-1">
                        {formatPrice(cartItemTotal(item))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 font-semibold"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">3. Billing details & live payment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    ['firstName', 'First name'],
                    ['lastName', 'Last name'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['address', 'Address'],
                    ['city', 'City'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
                    <input
                      value={billing[key]}
                      onChange={(e) => setBilling((b) => ({ ...b, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    value={billing.country}
                    onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
                  >
                    {['United Kingdom', 'Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'Other'].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                I confirm the booking details are correct and authorise payment / transfer for this trip.
              </label>

              {paymentDone ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Payment recorded ({paymentDone.method})
                  </p>
                  <p>
                    Reference: <strong>{paymentDone.reference}</strong>
                  </p>
                  <p>Our team will confirm vouchers once the payment clears.</p>
                </div>
              ) : (
                <PaymentMethods
                  payload={paymentPayload}
                  disabled={!agreed || !billingComplete}
                  onPaid={({ method, reference }) => {
                    if (!validateBilling()) return;
                    setPaymentDone({ method, reference });
                    clearCart();
                  }}
                />
              )}

              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm text-gray-600 mb-3">Or confirm without card and pay later with our team:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => confirmVia('whatsapp')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 font-semibold"
                  >
                    <MessageCircle className="h-4 w-4" /> Confirm via WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmVia('email')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 font-semibold"
                  >
                    <Mail className="h-4 w-4" /> Confirm via Email
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Back to package review
              </button>
            </div>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-32 space-y-4">
            <h3 className="font-bold text-gray-900">Tour details</h3>
            {items.map((item) => (
              <div key={item.id} className="text-sm border-b border-slate-100 pb-3">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500">Package · {item.tripCode}</p>
                <p className="text-gray-600 mt-1">
                  Starts: {item.startDate || '—'} · Ends: {item.endDate || '—'}
                </p>
                <p className="text-gray-600">
                  Travellers: {item.adults + item.children} ({item.adults} adults
                  {item.children ? `, ${item.children} children` : ''})
                </p>
                <p className="font-semibold text-orange-600 mt-1">{formatPrice(cartItemTotal(item))}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-600">Payable (guide)</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500 flex items-start gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              Final amount confirmed by Synergy Travels & Tour after availability check.
            </p>
            <p className="text-xs text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Free consultation · No booking fee to enquire
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
