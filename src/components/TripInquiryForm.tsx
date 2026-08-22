import React, { useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { BRAND_NAME, getEmailLink, getWhatsAppLink } from '../constants/contact';
import type { Trip } from '../data/trips';

type TripInquiryFormProps = {
  trip?: Trip;
  /** Used when no trip object is provided (general package enquiry) */
  defaultTripName?: string;
  className?: string;
  heading?: string;
};

const COUNTRIES = [
  'United Kingdom',
  'Pakistan',
  'United Arab Emirates',
  'Saudi Arabia',
  'United States',
  'Canada',
  'India',
  'Australia',
  'Germany',
  'France',
  'Other',
];

const TripInquiryForm: React.FC<TripInquiryFormProps> = ({
  trip,
  defaultTripName = '',
  className = '',
  heading = 'Send your enquiry',
}) => {
  const tripTitle = trip?.title || defaultTripName || '';
  const tripCode = trip?.tripCode || 'GENERAL';

  const [form, setForm] = useState({
    tripName: tripTitle,
    name: '',
    email: '',
    country: 'United Kingdom',
    phone: '',
    adults: '2',
    children: '0',
    subject: tripTitle ? `Enquiry: ${tripTitle}` : 'Travel Package Enquiry',
    message: tripTitle
      ? `I am interested in "${tripTitle}" (${tripCode}). Please share availability and the best package options.`
      : 'I would like help choosing a package. Please contact me with options.',
  });
  const [sentHint, setSentHint] = useState('');

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildMessage = () =>
    [
      `Trip enquiry — ${BRAND_NAME}`,
      `Trip: ${form.tripName || tripTitle || 'Not specified'}`,
      `Trip code: ${tripCode}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Country: ${form.country}`,
      `Phone: ${form.phone}`,
      `Adults: ${form.adults}`,
      `Children: ${form.children}`,
      `Subject: ${form.subject}`,
      '',
      form.message,
    ].join('\n');

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert('Please fill in your name, email, and contact number.');
      return false;
    }
    if (!form.tripName.trim()) {
      alert('Please enter the trip / package name.');
      return false;
    }
    return true;
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    window.open(getWhatsAppLink(buildMessage()), '_blank', 'noopener,noreferrer');
    setSentHint('Opening WhatsApp with your enquiry…');
  };

  const sendEmail = () => {
    if (!validate()) return;
    window.location.href = getEmailLink(form.subject, buildMessage());
    setSentHint('Opening your email app with the enquiry…');
  };

  return (
    <div
      id="trip-enquiry"
      className={`rounded-2xl border-2 border-orange-200 bg-white p-5 sm:p-6 shadow-md scroll-mt-32 ${className}`}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 mb-1">
          Enquiry form
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{heading}</h3>
        <p className="text-sm text-gray-600">
          Same style as a tour booking enquiry — send via WhatsApp or Email and our team will reply.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip name *</label>
          <input
            name="tripName"
            value={form.tripName}
            onChange={onChange}
            readOnly={Boolean(trip)}
            className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
              trip
                ? 'border-gray-200 bg-slate-50 text-gray-700'
                : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              name="country"
              value={form.country}
              onChange={onChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact number *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+971 ..."
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of adults *</label>
            <input
              type="number"
              min={1}
              name="adults"
              value={form.adults}
              onChange={onChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of children</label>
            <input
              type="number"
              min={0}
              name="children"
              value={form.children}
              onChange={onChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry subject *</label>
          <input
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your message *</label>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={onChange}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={sendWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-sm font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Enquiry
          </button>
          <button
            type="button"
            onClick={sendEmail}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 text-sm font-semibold transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email Enquiry
          </button>
        </div>

        {sentHint && (
          <p className="text-xs text-emerald-700 flex items-center gap-1">
            <Send className="h-3.5 w-3.5" />
            {sentHint}
          </p>
        )}
      </div>
    </div>
  );
};

export default TripInquiryForm;
