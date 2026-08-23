import React from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import BookingEnquiryForm from './BookingEnquiryForm';
import AiConsultant from './AiConsultant';
import { BRAND_NAME, CONTACT, getWhatsAppLink } from '../constants/contact';
import { TRAVEL_LOCATION } from '../travel/config';
import { trackEvent } from '../lib/analytics';

const ContactPage: React.FC = () => {
  const phoneHref = `tel:${CONTACT.phone.replace(/\s/g, '')}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Contact {BRAND_NAME}</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Speak with our team about flights, hotels, tours, visa assistance or travel insurance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <a
            href={getWhatsAppLink('Hi Synergy Travels, I would like to get in touch.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { context: 'contact' })}
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 hover:bg-emerald-100"
          >
            <MessageCircle className="h-6 w-6 text-emerald-700" />
            <div>
              <div className="font-bold text-emerald-900">Chat on WhatsApp</div>
              <div className="text-sm text-emerald-800">{CONTACT.phone}</div>
            </div>
          </a>
          <a
            href={phoneHref}
            onClick={() => trackEvent('phone_click', { context: 'contact' })}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <Phone className="h-6 w-6 text-orange-600" />
            <div>
              <div className="font-bold text-slate-900">Call us</div>
              <div className="text-sm text-slate-600">{CONTACT.phone}</div>
            </div>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            onClick={() => trackEvent('email_click', { context: 'contact' })}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <Mail className="h-6 w-6 text-sky-600" />
            <div>
              <div className="font-bold text-slate-900">Email</div>
              <div className="text-sm text-slate-600">{CONTACT.email}</div>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <MapPin className="h-6 w-6 text-slate-500 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Location</div>
              <div className="text-sm text-slate-600">{TRAVEL_LOCATION.label}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <BookingEnquiryForm
            service="general"
            heading="Send an enquiry"
            showFlightFields={false}
            showHotelFields={false}
            analyticsEvent="booking_request"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AiConsultant />
      </div>
    </div>
  );
};

export default ContactPage;
