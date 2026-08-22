import React from 'react';
import { BRAND_NAME, CONTACT } from '../constants/contact';
import { TRAVEL_LOCATION } from '../travel/config';

type LegalPageId = 'privacy-policy' | 'terms-and-conditions' | 'cookie-policy' | 'refund-cancellation';

const CONTENT: Record<
  LegalPageId,
  { title: string; sections: { heading: string; body: string }[] }
> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Who we are',
        body: `${BRAND_NAME} (“we”, “us”) provides travel booking assistance and related services. Contact: ${CONTACT.email}, ${CONTACT.phone}. Location: ${TRAVEL_LOCATION.label}.`,
      },
      {
        heading: 'Information we collect',
        body: 'When you submit an enquiry we may collect your name, email, phone/WhatsApp number, travel preferences and message content. We do not request passport numbers or sensitive identity documents through public website forms.',
      },
      {
        heading: 'How we use information',
        body: 'We use enquiry details to respond to your request, prepare quotes and provide customer support. We do not sell your personal information.',
      },
      {
        heading: 'Sharing',
        body: 'We may share necessary travel details with airlines, hotels or suppliers only to fulfil a booking you have requested. Payment processors handle card payments according to their own policies when that service is enabled.',
      },
      {
        heading: 'Retention & your rights',
        body: 'We retain enquiry records only as long as needed for customer service and legitimate business records. Contact us to request access or deletion where applicable under UK GDPR.',
      },
      {
        heading: 'Confirmation needed',
        body: 'This page is a practical draft for the website. Have your solicitor or data protection adviser confirm wording before marketing launch if required.',
      },
    ],
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    sections: [
      {
        heading: 'Services',
        body: `${BRAND_NAME} assists with flight, hotel, tour, visa guidance and related travel arrangements. Final bookings with third-party suppliers are subject to those suppliers’ terms.`,
      },
      {
        heading: 'Quotes & prices',
        body: 'Website content does not guarantee availability or fares unless confirmed in writing by our team. Partner comparison links open external websites we do not control.',
      },
      {
        heading: 'Visa assistance',
        body: 'Visa support means document preparation guidance and application support. We do not guarantee visa approval — decisions rest with the relevant immigration authority.',
      },
      {
        heading: 'Confirmation needed',
        body: 'Have commercial terms, agency liabilities and supplier relationships reviewed before publishing as final legal terms.',
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    sections: [
      {
        heading: 'Cookies we use',
        body: 'Essential cookies may be used for site function. Analytics or advertising cookies (such as Google Analytics or Meta Pixel) are only active if configured in the site environment.',
      },
      {
        heading: 'Your choices',
        body: 'You can control cookies through your browser settings. Disabling some cookies may affect site features.',
      },
    ],
  },
  'refund-cancellation': {
    title: 'Refund & Cancellation Policy',
    sections: [
      {
        heading: 'Supplier rules apply',
        body: 'Airline, hotel and tour cancellations follow the rules of the supplier ticket or booking. Synergy will explain applicable conditions when confirming your reservation.',
      },
      {
        heading: 'Service fees',
        body: 'Any Synergy service fees are confirmed before payment. Refundability of service fees depends on the work already completed and will be stated on your quote.',
      },
      {
        heading: 'Confirmation needed',
        body: 'Replace this draft with your confirmed commercial refund policy before launch advertising.',
      },
    ],
  },
};

type LegalPageProps = { pageId: LegalPageId };

const LegalPage: React.FC<LegalPageProps> = ({ pageId }) => {
  const page = CONTENT[pageId];
  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{page.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: August 2026 · {BRAND_NAME}</p>
        <div className="mt-8 space-y-8">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold text-slate-900">{s.heading}</h2>
              <p className="mt-2 text-slate-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
export type { LegalPageId };
