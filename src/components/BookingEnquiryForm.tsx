import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Send } from 'lucide-react';
import { BRAND_NAME, CONTACT, getEmailLink, getWhatsAppLink } from '../constants/contact';
import { trackEvent, type AnalyticsEvent } from '../lib/analytics';
import { submitLead } from '../lib/leadsApi';
import type { TripType } from '../travel/types';

export type EnquiryService =
  | 'flights'
  | 'hotels'
  | 'tours'
  | 'visa'
  | 'insurance'
  | 'cars'
  | 'transfers'
  | 'packages'
  | 'general';

export type FlightEnquiryInitialValues = {
  tripType?: TripType;
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  adults?: string;
  children?: string;
  infants?: string;
  cabin?: string;
  preferredAirline?: string;
  multiCitySummary?: string;
  message?: string;
};

type BookingEnquiryFormProps = {
  service?: EnquiryService;
  heading?: string;
  analyticsEvent?: AnalyticsEvent;
  defaultMessage?: string;
  initialValues?: FlightEnquiryInitialValues;
  showFlightFields?: boolean;
  showHotelFields?: boolean;
  className?: string;
};

const CABINS = ['Economy', 'Premium Economy', 'Business', 'First'];

const BookingEnquiryForm: React.FC<BookingEnquiryFormProps> = ({
  service = 'general',
  heading = 'Request booking assistance',
  analyticsEvent = 'booking_request',
  defaultMessage = '',
  initialValues,
  showFlightFields = service === 'flights',
  showHotelFields = service === 'hotels',
  className = '',
}) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    tripType: (initialValues?.tripType || 'roundtrip') as TripType,
    origin: initialValues?.origin || '',
    destination: initialValues?.destination || '',
    departDate: initialValues?.departDate || '',
    returnDate: initialValues?.returnDate || '',
    adults: initialValues?.adults || '1',
    children: initialValues?.children || '0',
    infants: initialValues?.infants || '0',
    cabin: initialValues?.cabin || 'Economy',
    preferredAirline: initialValues?.preferredAirline || '',
    multiCitySummary: initialValues?.multiCitySummary || '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
    specialRequirements: '',
    message: initialValues?.message || defaultMessage,
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const tripTypeLabel =
    form.tripType === 'multicity'
      ? 'Multi-city'
      : form.tripType === 'oneway'
        ? 'One-way'
        : 'Round-trip';

  const buildBody = () => {
    const lines = [
      `${service.toUpperCase()} enquiry — ${BRAND_NAME}`,
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone / WhatsApp: ${form.phone}`,
    ];
    if (showFlightFields) {
      lines.push(`Trip type: ${tripTypeLabel}`);
      if (form.tripType === 'multicity' && form.multiCitySummary.trim()) {
        lines.push('Multi-city legs:', form.multiCitySummary);
      } else {
        lines.push(
          `From: ${form.origin}`,
          `To: ${form.destination}`,
          `Departure: ${form.departDate}`,
          `Return: ${form.tripType === 'oneway' ? 'One-way' : form.returnDate || 'Not set'}`
        );
      }
      lines.push(
        `Adults (12+): ${form.adults}`,
        `Children (2–11): ${form.children}`,
        `Infants (under 2): ${form.infants}`,
        `Cabin: ${form.cabin}`,
        `Preferred airline: ${form.preferredAirline || 'Any'}`
      );
    }
    if (showHotelFields) {
      lines.push(
        `Hotel destination: ${form.destination}`,
        `Check-in: ${form.checkIn}`,
        `Check-out: ${form.checkOut}`,
        `Guests: ${form.guests}`,
        `Rooms: ${form.rooms}`
      );
    }
    if (form.specialRequirements.trim()) {
      lines.push(`Special requirements: ${form.specialRequirements}`);
    }
    if (form.message.trim()) {
      lines.push('', form.message);
    }
    return lines.join('\n');
  };

  const validate = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      alert('Please enter your full name, email and phone / WhatsApp number.');
      return false;
    }
    const adultsN = Number(form.adults) || 0;
    const infantsN = Number(form.infants) || 0;
    if (showFlightFields && adultsN < 1) {
      alert('At least one adult is required.');
      return false;
    }
    if (showFlightFields && infantsN > adultsN) {
      alert('Infants cannot exceed the number of adults.');
      return false;
    }
    return true;
  };

  const persistLeadLocally = () => {
    try {
      const lead = {
        id: `lead_${Date.now()}`,
        service,
        status: 'NEW',
        receivedAt: new Date().toISOString(),
        contact: { name: form.fullName, email: form.email, phone: form.phone },
        details: buildBody(),
      };
      const key = 'synergy_enquiries_v1';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([lead, ...(Array.isArray(prev) ? prev : [])].slice(0, 100)));
    } catch {
      /* ignore */
    }
  };

  const submitVia = async (channel: 'whatsapp' | 'email') => {
    if (!validate()) return;
    const body = buildBody();
    const subject = `${service} enquiry — ${form.fullName} — ${BRAND_NAME}`;

    const apiResult = await submitLead({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      service,
      channel,
      source: 'booking_enquiry_form',
      origin: form.origin,
      destination: form.destination,
      departDate: form.departDate,
      returnDate: form.returnDate,
      adults: form.adults,
      children: form.children,
      infants: form.infants,
      cabin: form.cabin,
      tripType: form.tripType,
      multiCitySummary: form.multiCitySummary,
      message: body,
      page: typeof window !== 'undefined' ? window.location.hash || '/' : '/',
    });

    if (!apiResult.ok && !apiResult.offline) {
      persistLeadLocally();
    }

    trackEvent(analyticsEvent, {
      service,
      channel,
      lead_id: apiResult.lead?.id,
      lead_offline: Boolean(apiResult.offline),
    });
    trackEvent('lead_submitted', {
      service,
      channel,
      lead_id: apiResult.lead?.id,
    });

    const withRef = apiResult.lead?.id
      ? `${body}\n\nReference: ${apiResult.lead.id}`
      : body;

    if (channel === 'whatsapp') {
      trackEvent('whatsapp_click', { context: service });
      window.open(getWhatsAppLink(withRef), '_blank', 'noopener,noreferrer');
    } else {
      trackEvent('email_click', { context: service });
      window.location.href = getEmailLink(subject, withRef);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 ${className}`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Thank you. Your travel request has been received.</h3>
            <p className="mt-2 text-sm text-emerald-800">
              Our team will contact you shortly on {form.phone || form.email}. You can also reach us anytime on WhatsApp{' '}
              <a className="underline font-semibold" href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                {CONTACT.phone}
              </a>{' '}
              or {CONTACT.email}.
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-emerald-700 underline"
              onClick={() => setSubmitted(false)}
            >
              Submit another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm ${className}`}>
      <h3 className="text-xl font-bold text-slate-900">{heading}</h3>
      <p className="mt-1 text-sm text-slate-500">
        We do not ask for passport numbers on this form. Share travel details only — Synergy will follow up securely.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Full name *</span>
          <input name="fullName" value={form.fullName} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Email *</span>
          <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Phone / WhatsApp *</span>
          <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="+971…" />
        </label>

        {showFlightFields && (
          <>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Trip type</span>
              <select
                name="tripType"
                value={form.tripType}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <option value="roundtrip">Round-trip</option>
                <option value="oneway">One-way</option>
                <option value="multicity">Multi-city</option>
              </select>
            </label>

            {form.tripType === 'multicity' ? (
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-slate-700">Multi-city legs</span>
                <textarea
                  name="multiCitySummary"
                  rows={4}
                  value={form.multiCitySummary}
                  onChange={onChange}
                  placeholder={'Leg 1: London (LHR) → Dubai (DXB) on 2026-10-20\nLeg 2: Dubai (DXB) → Lahore (LHE) on 2026-10-22'}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                />
              </label>
            ) : (
              <>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Departure airport</span>
                  <input name="origin" value={form.origin} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="e.g. London Heathrow (LHR)" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Destination</span>
                  <input name="destination" value={form.destination} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Departure date</span>
                  <input type="date" name="departDate" value={form.departDate} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
                </label>
                {form.tripType === 'roundtrip' && (
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Return date</span>
                    <input type="date" name="returnDate" value={form.returnDate} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
                  </label>
                )}
              </>
            )}

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Adults (12+)</span>
              <input type="number" min={1} max={9} name="adults" value={form.adults} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Children (2–11)</span>
              <input type="number" min={0} max={9} name="children" value={form.children} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Infants (under 2)</span>
              <input type="number" min={0} max={9} name="infants" value={form.infants} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Cabin class</span>
              <select name="cabin" value={form.cabin} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                {CABINS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Preferred airline</span>
              <input name="preferredAirline" value={form.preferredAirline} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Optional" />
            </label>
          </>
        )}

        {showHotelFields && (
          <>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Destination / city</span>
              <input name="destination" value={form.destination} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Check-in</span>
              <input type="date" name="checkIn" value={form.checkIn} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Check-out</span>
              <input type="date" name="checkOut" value={form.checkOut} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Guests</span>
              <input type="number" min={1} name="guests" value={form.guests} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Rooms</span>
              <input type="number" min={1} name="rooms" value={form.rooms} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
          </>
        )}

        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Special requirements</span>
          <input name="specialRequirements" value={form.specialRequirements} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="Dietary needs, mobility, seating…" />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Message</span>
          <textarea name="message" rows={4} value={form.message} onChange={onChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
        </label>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => submitVia('whatsapp')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold tap-target"
        >
          <MessageCircle className="h-5 w-5" />
          Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={() => submitVia('email')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 px-5 py-3 font-semibold tap-target"
        >
          <Mail className="h-5 w-5" />
          Send via Email
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 sm:ml-auto">
          <Send className="h-3.5 w-3.5" />
          Opens your WhatsApp or email app with the enquiry ready
        </span>
      </div>
    </div>
  );
};

export default BookingEnquiryForm;
