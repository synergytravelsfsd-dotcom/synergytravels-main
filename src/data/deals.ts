/** Seasonal / featured deals — enquiry-led, never fake live prices */

export type DealOffer = {
  id: string;
  title: string;
  summary: string;
  destinations: string[];
  validLabel: string;
  terms: string[];
  ctaPage: string;
  badge?: string;
};

export const DEALS: DealOffer[] = [
  {
    id: 'deal-dubai-family',
    title: 'Dubai family holiday planning',
    summary:
      'Ask for a family-focused Dubai outline (flights + hotel). Pricing is confirmed in a Synergy quotation — not displayed as a live fare here.',
    destinations: ['dubai'],
    validLabel: 'Ongoing — subject to availability',
    terms: [
      'Not a fixed package price',
      'Quote required before payment',
      'Availability changes by date and hotel category',
    ],
    ctaPage: 'packages',
    badge: 'Family',
  },
  {
    id: 'deal-istanbul-city',
    title: 'Istanbul city break enquiry',
    summary: 'Short-break hotel + flight assistance for Istanbul. Share dates for a personalised quote.',
    destinations: ['istanbul'],
    validLabel: 'Ongoing — subject to availability',
    terms: ['Indicative interest only', 'No invented competitor prices'],
    ctaPage: 'packages',
    badge: 'City break',
  },
  {
    id: 'deal-umrah-assist',
    title: 'Umrah travel assistance',
    summary:
      'Request Umrah travel support for flights and stays. Visa outcomes are never guaranteed by Synergy.',
    destinations: ['umrah-makkah-madinah'],
    validLabel: 'Seasonal demand — enquire early',
    terms: ['Assistance only', 'Official approvals are external'],
    ctaPage: 'umrah',
    badge: 'Umrah',
  },
  {
    id: 'deal-uk-visa-assist',
    title: 'UK visitor visa document guidance',
    summary: 'Checklist-style guidance and application support for UK visitor travel planning.',
    destinations: ['london'],
    validLabel: 'Ongoing',
    terms: ['No immigration decision by Synergy', 'Document completeness still required'],
    ctaPage: 'visa',
    badge: 'Visa help',
  },
];

/** Synergy Rewards — prepared rules (not a live points wallet yet) */
export const LOYALTY_PROGRAM = {
  name: 'Synergy Rewards',
  status: 'prepared' as const,
  earnHints: [
    'Completed bookings (when payment confirmed)',
    'Qualified referrals that become bookings',
    'Post-travel reviews submitted in good faith',
  ],
  redeemHints: [
    'Future booking credit (policy TBD)',
    'Priority quote handling (policy TBD)',
  ],
  note: 'Points wallet and redemption are not live yet. Rules will be configurable before launch.',
};
