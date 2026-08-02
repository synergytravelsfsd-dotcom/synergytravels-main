import { searchAllAffiliates } from '../affiliates/registry';
import type { AffiliateOffer, CompareResultSet, MetaSearchQuery, SortMode } from '../types';

function scoreBestValue(offer: AffiliateOffer): number {
  const rating = offer.rating || 3.5;
  const reviews = Math.min(offer.reviews || 50, 5000);
  return rating * 20 + Math.log10(reviews + 10) * 8 - offer.price / 40;
}

export function sortOffers(offers: AffiliateOffer[], mode: SortMode): AffiliateOffer[] {
  const copy = [...offers];
  switch (mode) {
    case 'cheapest':
      return copy.sort((a, b) => a.price - b.price);
    case 'fastest':
      return copy.sort((a, b) => {
        const da = Number((a.meta?.durationMinutes as number) || a.price);
        const db = Number((b.meta?.durationMinutes as number) || b.price);
        return da - db;
      });
    case 'rating':
      return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'deals':
      return copy.sort((a, b) => Number(Boolean(b.dealBadge)) - Number(Boolean(a.dealBadge)));
    case 'best':
    default:
      return copy.sort((a, b) => scoreBestValue(b) - scoreBestValue(a));
  }
}

export async function runMetaSearch(query: MetaSearchQuery): Promise<CompareResultSet> {
  const offers = await searchAllAffiliates(query);
  const sorted = sortOffers(offers, 'best');
  const cheapest = [...offers].sort((a, b) => a.price - b.price)[0];
  const bestValue = sorted[0];

  const insights = [
    `Compared ${offers.length} live-style offers across ${new Set(offers.map((o) => o.providerId)).size} partners.`,
    cheapest
      ? `Lowest guide price: ${cheapest.providerName} at $${cheapest.price}.`
      : 'No offers found — try a different destination or dates.',
    bestValue && bestValue.id !== cheapest?.id
      ? `Best value pick: ${bestValue.providerName} (balance of price, rating & flexibility).`
      : 'Tip: flexible dates often unlock lower fares.',
    query.budgetMax
      ? `Filtered against your budget ceiling of $${query.budgetMax}.`
      : 'Set a budget to filter smarter deals.',
  ];

  const filtered = query.budgetMax
    ? sorted.filter((o) => o.price <= (query.budgetMax || Infinity))
    : sorted;

  return {
    query,
    generatedAt: new Date().toISOString(),
    offers: filtered,
    insights,
    cheapest,
    bestValue,
  };
}
