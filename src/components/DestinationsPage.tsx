import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { DESTINATIONS, getDestination } from '../data/destinations';
import { navigateToAppPage } from '../constants/pages';
import BookingEnquiryForm from './BookingEnquiryForm';
import { SITE_NAME } from '../constants/site';

export const DestinationsIndex: React.FC = () => {
  useEffect(() => {
    document.title = `Travel destinations | ${SITE_NAME}`;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Destinations</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Practical guides for popular Synergy routes. Enquire for quotations — we do not invent live package
            prices on these pages.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DESTINATIONS.map((d) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => navigateToAppPage('destination', { tripId: d.slug })}
            className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-orange-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold">
              <MapPin className="h-4 w-4" /> {d.region}
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{d.name}</h2>
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">{d.summary}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-orange-600">Read guide →</span>
          </button>
        ))}
      </div>
    </div>
  );
};

type DestinationPageProps = { slug: string };

export const DestinationPage: React.FC<DestinationPageProps> = ({ slug }) => {
  const d = getDestination(slug);

  useEffect(() => {
    if (!d) {
      document.title = `Destination not found | ${SITE_NAME}`;
      return;
    }
    document.title = `${d.headline} | ${SITE_NAME}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', d.summary.slice(0, 160));
  }, [d]);

  if (!d) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Destination not found</h1>
        <button type="button" className="mt-4 text-orange-600 font-semibold" onClick={() => navigateToAppPage('destinations')}>
          Browse destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-orange-300 text-sm font-semibold">
            {d.country} · {d.region}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">{d.headline}</h1>
          <p className="mt-3 text-slate-300">{d.summary}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {[
          ['Best time to visit', d.bestTime],
          ['Flights', d.flightsNote],
          ['Hotels', d.hotelsNote],
          ['Packages', d.packagesNote],
          ['Visa note', d.visaNote],
        ].map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-lg text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{body}</p>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Highlights</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
            {d.attractions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Tips</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
            {d.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">FAQs</h2>
          <div className="mt-3 space-y-3">
            {d.faqs.map((f) => (
              <div key={f.q}>
                <div className="font-semibold text-slate-900">{f.q}</div>
                <p className="text-sm text-slate-700 mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigateToAppPage(d.ctaService)}
            className="rounded-xl bg-orange-600 text-white px-5 py-3 font-semibold"
          >
            Continue to {d.ctaService}
          </button>
          <button
            type="button"
            onClick={() => navigateToAppPage('destinations')}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold"
          >
            All destinations
          </button>
        </div>

        <BookingEnquiryForm
          service={d.ctaService === 'umrah' ? 'packages' : d.ctaService === 'visa' ? 'visa' : 'packages'}
          heading={`Enquire about ${d.name}`}
          analyticsEvent={d.ctaService === 'visa' ? 'visa_enquiry' : 'tour_enquiry'}
          initialValues={{ destination: d.name, message: `I am interested in travel to ${d.name}. ${d.headline}` }}
        />
      </div>
    </div>
  );
};
