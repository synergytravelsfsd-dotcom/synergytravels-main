import React from 'react';
import {
  ArrowLeft,
  Coffee,
  ExternalLink,
  Loader2,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';
import { useMetaSearchStore } from '../../metasearch/store';
import type { AffiliateOffer, SearchVertical, SortMode } from '../../metasearch/types';
import { trackAffiliateClick } from '../../metasearch/affiliates/adapter';
import {
  isInternalDeepLink,
  parseInternalDeepLink,
} from '../../metasearch/affiliates/deepLinks';
import { navigateToAppPage } from '../../constants/pages';
import VisaCheckerPanel from './VisaCheckerPanel';
import AiTravelAssistant from './AiTravelAssistant';
import BookingEnquiryForm from '../BookingEnquiryForm';

const SORTS: { id: SortMode; label: string }[] = [
  { id: 'best', label: 'Best value' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'rating', label: 'Top rated' },
  { id: 'deals', label: 'Deals' },
];

function OfferCard({ offer, vertical }: { offer: AffiliateOffer; vertical: SearchVertical }) {
  const open = () => {
    trackAffiliateClick({
      providerId: offer.providerId,
      offerId: offer.id,
      vertical,
      price: offer.price,
      deepLink: offer.deepLink,
    });
    if (isInternalDeepLink(offer.deepLink)) {
      const page = parseInternalDeepLink(offer.deepLink) || 'packages';
      navigateToAppPage(page);
      return;
    }
    window.open(offer.deepLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              {offer.providerName}
            </span>
            {offer.dealBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5">
                <Tag className="h-3 w-3" />
                {offer.dealBadge}
              </span>
            )}
            {offer.coupon && (
              <span className="rounded-full bg-amber-50 text-amber-800 text-xs font-medium px-2 py-0.5">
                Coupon: {offer.coupon}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 truncate">{offer.title}</h3>
          {offer.subtitle && <p className="text-sm text-slate-500 mt-0.5">{offer.subtitle}</p>}

          <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm text-slate-600">
            {typeof offer.rating === 'number' && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                {offer.rating.toFixed(1)}
                {offer.reviews != null ? ` (${offer.reviews})` : ''}
              </span>
            )}
            {offer.distance && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {offer.distance}
              </span>
            )}
            {offer.breakfast && (
              <span className="inline-flex items-center gap-1">
                <Coffee className="h-3.5 w-3.5" />
                Breakfast
              </span>
            )}
            {offer.cancellation && (
              <span className="inline-flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                {offer.cancellation}
              </span>
            )}
            <span className="text-slate-400">
              {offer.taxesIncluded ? 'Taxes included' : 'Taxes may apply'}
            </span>
          </div>
        </div>

        <div className="sm:text-right shrink-0 flex sm:flex-col items-stretch sm:items-end justify-between gap-3 w-full sm:w-auto">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {offer.currency} {offer.price.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">from partner</div>
          </div>
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 text-sm font-semibold tap-target w-full sm:w-auto"
          >
            {isInternalDeepLink(offer.deepLink) ? 'View with Synergy' : 'Book'}
            {!isInternalDeepLink(offer.deepLink) && <ExternalLink className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
}

const CompareResults: React.FC = () => {
  const { query, results, sort, setSort, loading, search, clearResults } = useMetaSearchStore();

  const goHome = () => {
    clearResults();
    navigateToAppPage('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 mb-4 sm:mb-6 tap-target"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </button>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-orange-600 font-semibold uppercase tracking-wide">
              Price comparison
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-1 break-words">
              {query.vertical.charAt(0).toUpperCase() + query.vertical.slice(1)} to{' '}
              {query.destination || '…'}
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm break-words">
              {query.origin ? `${query.origin} → ` : ''}
              {query.destination}
              {query.departDate ? ` · ${query.departDate}` : ''}
              {query.returnDate ? ` – ${query.returnDate}` : ''}
              {` · ${query.adults} adult${query.adults > 1 ? 's' : ''}`}
              {query.children ? `, ${query.children} child${query.children > 1 ? 'ren' : ''}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => search()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 w-full md:w-auto tap-target"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh compare
          </button>
        </div>

        {results?.insights?.length ? (
          <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            <div className="font-semibold mb-1 inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Insights
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {results.insights.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors tap-target ${
                sort === s.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading && !results ? (
          <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            Searching…
          </div>
        ) : !results?.offers?.length ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
              <h2 className="font-bold text-lg">No live inventory connected</h2>
              <p className="mt-2 text-sm">
                Authorised partner APIs are not enabled yet, so we do not show simulated fares.
                Request a quote from Synergy, or open the Flights page for partner comparison deeplinks.
              </p>
              <button
                type="button"
                onClick={() => navigateToAppPage('flights')}
                className="mt-4 inline-flex rounded-xl bg-orange-600 text-white px-4 py-2.5 text-sm font-semibold"
              >
                Go to Flights
              </button>
            </div>
            <BookingEnquiryForm service="flights" showFlightFields heading="Book with Synergy" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Demo mode — mock prices only (not live inventory)
              </p>
              {results.cheapest && (
                <p className="text-xs text-slate-500">
                  Cheapest from <strong>{results.cheapest.providerName}</strong> · Best value{' '}
                  <strong>{results.bestValue?.providerName || '—'}</strong>
                </p>
              )}
              {results.offers.map((o) => (
                <OfferCard key={o.id} offer={o} vertical={query.vertical} />
              ))}
              <p className="text-xs text-slate-400 pt-2">
                Demo offers must never be marketed as live fares. Connect an authorised API to show
                real inventory.
              </p>
            </div>
            <aside className="space-y-4 sm:space-y-6">
              {query.vertical === 'visa' ? (
                <VisaCheckerPanel />
              ) : (
                <>
                  <AiTravelAssistant />
                  <div className="hidden md:block">
                    <VisaCheckerPanel />
                  </div>
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareResults;
