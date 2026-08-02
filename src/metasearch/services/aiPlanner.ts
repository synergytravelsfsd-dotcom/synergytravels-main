import type { MetaSearchQuery, TravelStyle } from '../types';

export type AiItineraryDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  meals: string[];
  tips: string[];
};

export type AiPlanResult = {
  destination: string;
  days: number;
  style: TravelStyle;
  summary: string;
  budgetEstimateUsd: { low: number; mid: number; high: number };
  bestMonth: string;
  visaNote: string;
  packing: string[];
  warnings: string[];
  itinerary: AiItineraryDay[];
};

const BEST_MONTHS = [
  'March–April',
  'October–November',
  'December–February',
  'May–June',
  'September',
];

export function generateAiPlan(input: {
  destination: string;
  days: number;
  style?: TravelStyle;
  nationality?: string;
  budgetMax?: number;
}): AiPlanResult {
  const style = input.style || 'family';
  const days = Math.min(30, Math.max(1, input.days || 5));
  const dest = input.destination || 'your destination';

  const base =
    style === 'luxury' ? 280 : style === 'budget' ? 70 : style === 'adventure' ? 140 : 160;

  const itinerary: AiItineraryDay[] = Array.from({ length: days }).map((_, i) => {
    const day = i + 1;
    if (day === 1) {
      return {
        day,
        title: `Arrive in ${dest}`,
        morning: 'Airport transfer & hotel check-in',
        afternoon: 'Neighbourhood orientation walk',
        evening: 'Welcome dinner at a well-rated local restaurant',
        meals: ['Dinner'],
        tips: ['Keep first day light', 'Save offline maps'],
      };
    }
    if (day === days) {
      return {
        day,
        title: 'Departure day',
        morning: 'Breakfast & last-minute souvenirs',
        afternoon: 'Checkout and transfer to airport',
        evening: 'Flight home',
        meals: ['Breakfast'],
        tips: ['Buffer 3h for international departures'],
      };
    }
    return {
      day,
      title: `${dest} highlights · Day ${day}`,
      morning: 'Top attraction / guided experience',
      afternoon: style === 'adventure' ? 'Outdoor activity or day trip' : 'Museum, market, or spa time',
      evening: 'Local food street or curated dining',
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      tips: ['Book popular attractions ahead', 'Carry local cash for markets'],
    };
  });

  return {
    destination: dest,
    days,
    style,
    summary: `AI ${days}-day ${style} plan for ${dest}, optimized for value, pace, and local experiences.`,
    budgetEstimateUsd: {
      low: Math.round(base * days * 0.75),
      mid: Math.round(base * days),
      high: Math.round(base * days * 1.6),
    },
    bestMonth: BEST_MONTHS[dest.length % BEST_MONTHS.length],
    visaNote: input.nationality
      ? `For ${input.nationality} passports visiting ${dest}: check e-visa / embassy rules before booking. Synergy can assist with documents.`
      : `Select your nationality for a visa readiness check before you book flights.`,
    packing: [
      'Passport + digital copies',
      'Universal adapter',
      'Comfortable walking shoes',
      style === 'spiritual' ? 'Modest clothing for sacred sites' : 'Weather-ready layers',
      'Travel insurance documents',
    ],
    warnings: [
      'Prices shown in comparison are guide rates — confirm live fare on partner sites.',
      'Check local holidays and weather alerts before finalizing.',
    ],
    itinerary,
  };
}

export function queryFromAiPlan(
  plan: AiPlanResult,
  extras?: Partial<MetaSearchQuery>
): MetaSearchQuery {
  return {
    vertical: 'packages',
    destination: plan.destination,
    adults: extras?.adults || 2,
    children: extras?.children || 0,
    travelStyle: plan.style,
    budgetMax: extras?.budgetMax || plan.budgetEstimateUsd.mid,
    nationality: extras?.nationality,
    ...extras,
  };
}
