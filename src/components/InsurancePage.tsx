import React from 'react';
import { MessageCircle, Shield } from 'lucide-react';
import BookingEnquiryForm from './BookingEnquiryForm';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

const InsurancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-orange-300 text-sm font-semibold">
            <Shield className="h-4 w-4" /> Travel Insurance
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">Request Travel Insurance</h1>
          <p className="mt-3 text-slate-300 max-w-3xl">
            Ask Synergy Travels to arrange travel insurance options for your trip. We do not display
            insurance prices on this website until an authorised provider is connected.
          </p>
          <a
            href={getWhatsAppLink('Hi Synergy, I would like travel insurance options for my trip.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { context: 'insurance' })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 font-semibold"
          >
            <MessageCircle className="h-5 w-5" /> Ask About Travel Insurance
          </a>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <BookingEnquiryForm
          service="insurance"
          heading="Request Travel Insurance"
          analyticsEvent="insurance_enquiry"
          defaultMessage="Please advise suitable travel insurance options for my trip."
        />
      </div>
    </div>
  );
};

export default InsurancePage;
