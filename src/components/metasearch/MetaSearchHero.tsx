import React, { useState } from 'react';
import {
  Building2,
  Bus,
  Car,
  Compass,
  CreditCard,
  HeartHandshake,
  Hotel,
  Loader2,
  Moon,
  Package,
  Plane,
  Search,
  Shield,
  Ship,
  Sparkles,
} from 'lucide-react';
import { useMetaSearchStore } from '../../metasearch/store';
import type { SearchVertical } from '../../metasearch/types';
import { navigateToAppPage } from '../../constants/pages';
import {
  formatAirportLabel,
  resolveAirportInput,
} from '../../data/airports';
import LocationAutocomplete from '../LocationAutocomplete';
import AiTravelAssistant from './AiTravelAssistant';

const TABS: { id: SearchVertical; label: string; icon: React.ReactNode }[] = [
  { id: 'flights', label: 'Flights', icon: <Plane className="h-4 w-4" /> },
  { id: 'hotels', label: 'Hotels', icon: <Hotel className="h-4 w-4" /> },
  { id: 'packages', label: 'Holiday Packages', icon: <Package className="h-4 w-4" /> },
  { id: 'visa', label: 'Visa', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'activities', label: 'Activities', icon: <Compass className="h-4 w-4" /> },
  { id: 'cruises', label: 'Cruises', icon: <Ship className="h-4 w-4" /> },
  { id: 'cars', label: 'Car Rental', icon: <Car className="h-4 w-4" /> },
  { id: 'insurance', label: 'Insurance', icon: <Shield className="h-4 w-4" /> },
  { id: 'umrah', label: 'Umrah', icon: <Moon className="h-4 w-4" /> },
  { id: 'hajj', label: 'Hajj', icon: <HeartHandshake className="h-4 w-4" /> },
  { id: 'corporate', label: 'Corporate', icon: <Building2 className="h-4 w-4" /> },
];

const POPULAR = ['Dubai', 'Istanbul', 'Makkah', 'London', 'Bangkok', 'Maldives', 'Paris', 'Skardu'];

type MetaSearchHeroProps = {
  onExplorePackages?: () => void;
  /** Compact mode when embedded inside Compare / hubs */
  embedded?: boolean;
};

const HUB_FOR_VERTICAL: Partial<Record<SearchVertical, string>> = {
  umrah: 'umrah',
  hajj: 'hajj',
  insurance: 'insurance',
  activities: 'activities',
  cars: 'cars',
  cruises: 'cruises',
  visa: 'visa',
  hotels: 'hotels',
  packages: 'packages',
  corporate: 'corporate',
};

const MetaSearchHero: React.FC<MetaSearchHeroProps> = ({ onExplorePackages, embedded }) => {
  const { query, patchQuery, setVertical, search, loading, error, recent } = useMetaSearchStore();
  const [showAi, setShowAi] = useState(false);

  const needsOrigin = query.vertical === 'flights' || query.vertical === 'cars';
  const needsDates = !['visa', 'insurance', 'corporate'].includes(query.vertical);
  const hubPage = HUB_FOR_VERTICAL[query.vertical];

  return (
    <section
      className={`relative overflow-hidden bg-slate-950 text-white ${
        embedded ? 'pt-6 pb-8' : 'pt-28 sm:pt-32 pb-16 sm:pb-20'
      }`}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.25),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(14,165,233,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs sm:text-sm text-orange-200 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan's smartest AI travel comparison platform
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Compare. Discover.
            <span className="block bg-gradient-to-r from-orange-300 via-amber-200 to-sky-300 bg-clip-text text-transparent">
              Book Smarter.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto">
            Synergy Travels & Tour — metasearch across flights, hotels, packages, Umrah, visas and more.
            We compare partners; you book the best deal.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex gap-1 overflow-x-auto p-2 border-b border-white/10 scrollbar-thin">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVertical(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  query.vertical === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 bg-white text-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {needsOrigin && (
                <LocationAutocomplete
                  label="Departure / From"
                  value={query.origin || ''}
                  onChange={(origin) => patchQuery({ origin })}
                  placeholder="Type city or code (e.g. LHR)"
                />
              )}
              <LocationAutocomplete
                label="Destination"
                value={query.destination}
                onChange={(destination) => patchQuery({ destination })}
                placeholder="Type city or code (e.g. DXB)"
              />
              {needsDates && (
                <>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">Depart</span>
                    <input
                      type="date"
                      value={query.departDate || ''}
                      onChange={(e) => patchQuery({ departDate: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">Return</span>
                    <input
                      type="date"
                      value={query.returnDate || ''}
                      onChange={(e) => patchQuery({ returnDate: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </label>
                </>
              )}
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Adults</span>
                <input
                  type="number"
                  min={1}
                  value={query.adults}
                  onChange={(e) => patchQuery({ adults: Math.max(1, Number(e.target.value) || 1) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Children</span>
                <input
                  type="number"
                  min={0}
                  value={query.children}
                  onChange={(e) => patchQuery({ children: Math.max(0, Number(e.target.value) || 0) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              {query.vertical === 'flights' && (
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">Cabin</span>
                  <select
                    value={query.cabin || 'economy'}
                    onChange={(e) =>
                      patchQuery({ cabin: e.target.value as typeof query.cabin })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                  </select>
                </label>
              )}
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Nationality</span>
                <select
                  value={query.nationality || 'United Kingdom'}
                  onChange={(e) => patchQuery({ nationality: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
                >
                  {['United Kingdom', 'Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'United States', 'Other'].map(
                    (n) => (
                      <option key={n}>{n}</option>
                    )
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Budget max (USD)</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={query.budgetMax || ''}
                  onChange={(e) =>
                    patchQuery({
                      budgetMax: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Travel style</span>
                <select
                  value={query.travelStyle || 'family'}
                  onChange={(e) =>
                    patchQuery({ travelStyle: e.target.value as typeof query.travelStyle })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
                >
                  <option value="family">Family</option>
                  <option value="luxury">Luxury</option>
                  <option value="budget">Budget</option>
                  <option value="adventure">Adventure</option>
                  <option value="business">Business</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="spiritual">Spiritual</option>
                </select>
              </label>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => search()}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-3.5 font-semibold disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Compare prices
              </button>
              <button
                type="button"
                onClick={() => setShowAi((v) => !v)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-200 text-orange-700 hover:bg-orange-50 px-5 py-3.5 font-semibold"
              >
                <Sparkles className="h-5 w-5" />
                AI Trip Planner
              </button>
              {onExplorePackages && (
                <button
                  type="button"
                  onClick={onExplorePackages}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-3.5 font-semibold"
                >
                  <Bus className="h-5 w-5" />
                  Our packages
                </button>
              )}
              {hubPage && hubPage !== 'home' && (
                <button
                  type="button"
                  onClick={() => navigateToAppPage(hubPage)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-3.5 font-semibold"
                >
                  Open {query.vertical} page
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 self-center">Popular:</span>
              {POPULAR.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    const match = resolveAirportInput(city);
                    patchQuery({
                      destination: match ? formatAirportLabel(match) : city,
                    });
                  }}
                  className="rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 px-3 py-1 text-xs font-medium"
                >
                  {city}
                </button>
              ))}
            </div>

            {recent.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-slate-500 self-center">Recent:</span>
                {recent.slice(0, 4).map((r) => (
                  <button
                    key={`${r.destination}-${r.at}`}
                    type="button"
                    onClick={() => {
                      patchQuery(r);
                      setVertical(r.vertical);
                    }}
                    className="rounded-full border border-slate-200 text-slate-600 px-3 py-1 text-xs"
                  >
                    {r.vertical}: {r.destination}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {showAi && (
          <div className="mt-6">
            <AiTravelAssistant onClose={() => setShowAi(false)} />
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['16+', 'Partner sources'],
            ['AI', 'Trip planner'],
            ['Visa', 'Checker'],
            ['Umrah', 'Specialist'],
          ].map(([k, v]) => (
            <div key={v} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
              <div className="text-xl font-bold text-orange-300">{k}</div>
              <div className="text-xs text-slate-300 mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetaSearchHero;
