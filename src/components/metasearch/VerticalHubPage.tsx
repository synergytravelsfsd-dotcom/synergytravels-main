import React from 'react';
import {
  ArrowRight,
  Car,
  Compass,
  HeartHandshake,
  Moon,
  Search,
  Shield,
  Ship,
} from 'lucide-react';
import type { SearchVertical } from '../../metasearch/types';
import { useMetaSearchStore } from '../../metasearch/store';
import { navigateToAppPage, type AppPage } from '../../constants/pages';
import VisaCheckerPanel from './VisaCheckerPanel';
import AiTravelAssistant from './AiTravelAssistant';

type HubConfig = {
  vertical: SearchVertical;
  title: string;
  subtitle: string;
  defaultDestination: string;
  icon: React.ReactNode;
  related: { label: string; page: AppPage }[];
  bullets: string[];
};

const HUBS: Record<string, HubConfig> = {
  umrah: {
    vertical: 'umrah',
    title: 'Umrah packages & comparison',
    subtitle:
      'Compare hotels near Haram, flights, visas and Synergy Travels & Tour Umrah packages — then book the best option.',
    defaultDestination: 'Makkah',
    icon: <Moon className="h-7 w-7" />,
    related: [
      { label: 'Travel packages', page: 'packages' },
      { label: 'Visa services', page: 'visa' },
      { label: 'Holy hotels', page: 'hotels' },
      { label: 'Hajj hub', page: 'hajj' },
    ],
    bullets: [
      'Packages with flights, hotels & transport',
      'Partner rate comparison for Makkah / Madinah',
      'Visa & vaccination checklist support',
    ],
  },
  hajj: {
    vertical: 'hajj',
    title: 'Hajj guidance & packages',
    subtitle:
      'Requirements, calendar timing, packages and partner comparisons — with Synergy as your trusted advisor.',
    defaultDestination: 'Makkah',
    icon: <HeartHandshake className="h-7 w-7" />,
    related: [
      { label: 'Umrah hub', page: 'umrah' },
      { label: 'Visa services', page: 'visa' },
      { label: 'Packages', page: 'packages' },
    ],
    bullets: [
      'Quota & vaccination requirements overview',
      'Package comparison across partners',
      'Document checklists and FAQs',
    ],
  },
  insurance: {
    vertical: 'insurance',
    title: 'Travel insurance comparison',
    subtitle:
      'Compare medical, trip cancellation, delay and baggage cover — then connect with Synergy for policy advice.',
    defaultDestination: 'Worldwide',
    icon: <Shield className="h-7 w-7" />,
    related: [
      { label: 'Visa services', page: 'visa' },
      { label: 'Packages', page: 'packages' },
      { label: 'Compare all', page: 'compare' },
    ],
    bullets: [
      'Medical & evacuation coverage',
      'Trip cancellation & delay options',
      'Family and corporate policies',
    ],
  },
  activities: {
    vertical: 'activities',
    title: 'Activities & experiences',
    subtitle:
      'Compare Viator, Klook, GetYourGuide and local operators — ratings, duration, languages and cancellation.',
    defaultDestination: 'Dubai',
    icon: <Compass className="h-7 w-7" />,
    related: [
      { label: 'Tours', page: 'tours' },
      { label: 'Adventure', page: 'adventure' },
      { label: 'Hotels', page: 'hotels' },
    ],
    bullets: [
      'Day trips, tickets & guided tours',
      'Partner price comparison',
      'AI itinerary suggestions',
    ],
  },
  cars: {
    vertical: 'cars',
    title: 'Car rental comparison',
    subtitle: 'Compare Hertz, Avis, Budget-style partners and local suppliers at your destination.',
    defaultDestination: 'Dubai',
    icon: <Car className="h-7 w-7" />,
    related: [
      { label: 'Hotels', page: 'hotels' },
      { label: 'Packages', page: 'packages' },
      { label: 'Corporate', page: 'corporate' },
    ],
    bullets: [
      'Airport & city pickup options',
      'Partner rate comparison',
      'Insurance add-on guidance',
    ],
  },
  cruises: {
    vertical: 'cruises',
    title: 'Cruise deals & packages',
    subtitle:
      'Compare cruise itineraries and Synergy holiday packages that include sea voyages and coastal stays.',
    defaultDestination: 'Mediterranean',
    icon: <Ship className="h-7 w-7" />,
    related: [
      { label: 'Packages', page: 'packages' },
      { label: 'Tours', page: 'tours' },
      { label: 'Insurance', page: 'insurance' },
    ],
    bullets: [
      'Itinerary & cabin comparisons',
      'Flight + cruise package options',
      'Travel insurance recommendations',
    ],
  },
};

type Props = { pageId: keyof typeof HUBS };

const VerticalHubPage: React.FC<Props> = ({ pageId }) => {
  const config = HUBS[pageId];
  const { patchQuery, setVertical, search, loading, query } = useMetaSearchStore();

  if (!config) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-600 mb-4">This hub is unavailable.</p>
        <button
          type="button"
          onClick={() => navigateToAppPage('home')}
          className="rounded-xl bg-orange-600 text-white px-4 py-2 font-semibold"
        >
          Go home
        </button>
      </div>
    );
  }

  const runCompare = async () => {
    setVertical(config.vertical);
    if (!query.destination?.trim() || query.destination === 'Dubai') {
      patchQuery({ destination: config.defaultDestination });
    }
    if (config.vertical === 'cars' || config.vertical === 'cruises') {
      patchQuery({ origin: query.origin || 'London' });
    }
    await search();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <section className="bg-slate-950 text-white pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-4 py-2 mb-5">
            <span className="text-orange-300">{config.icon}</span>
            <span className="text-sm font-semibold text-orange-100">Synergy Travels & Tour</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">{config.title}</h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl">{config.subtitle}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={runCompare}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-3.5 font-semibold disabled:opacity-60"
            >
              <Search className="h-5 w-5" />
              Compare prices
            </button>
            <button
              type="button"
              onClick={() => navigateToAppPage('home')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/10"
            >
              Full metasearch
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">What you can do here</h2>
              <ul className="space-y-2 text-slate-600">
                {config.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {config.related.map((r) => (
                  <button
                    key={r.page}
                    type="button"
                    onClick={() => navigateToAppPage(r.page)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-700"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <AiTravelAssistant />
          </div>
          <aside>
            <VisaCheckerPanel />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VerticalHubPage;
