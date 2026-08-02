export type VisaRequirement = {
  passport: string;
  destination: string;
  status: 'visa-free' | 'evisa' | 'visa-on-arrival' | 'embassy-visa' | 'restricted';
  documents: string[];
  feesUsd: string;
  processing: string;
  embassyTip: string;
  successTips: string[];
};

const MATRIX: Record<string, Partial<Record<string, VisaRequirement['status']>>> = {
  Pakistan: {
    'United Arab Emirates': 'evisa',
    'Saudi Arabia': 'evisa',
    Turkey: 'evisa',
    Malaysia: 'evisa',
    Thailand: 'evisa',
    'United Kingdom': 'embassy-visa',
    'United States': 'embassy-visa',
    Qatar: 'visa-on-arrival',
  },
  'United Kingdom': {
    'United Arab Emirates': 'visa-free',
    'Saudi Arabia': 'evisa',
    Turkey: 'visa-free',
    Thailand: 'visa-free',
    'United States': 'embassy-visa',
    Pakistan: 'embassy-visa',
  },
};

export function checkVisa(passport: string, destination: string): VisaRequirement {
  const status =
    MATRIX[passport]?.[destination] ||
    (destination.toLowerCase().includes('saudi') ? 'evisa' : 'embassy-visa');

  const baseDocs = [
    'Valid passport (6+ months)',
    'Passport-size photos',
    'Travel itinerary / tickets',
    'Hotel bookings or invitation',
    'Bank statements (3–6 months)',
  ];

  return {
    passport,
    destination,
    status,
    documents:
      status === 'visa-free'
        ? ['Valid passport', 'Return ticket', 'Proof of funds (sometimes requested)']
        : baseDocs,
    feesUsd:
      status === 'visa-free'
        ? '$0'
        : status === 'evisa'
          ? '$20–$120'
          : status === 'visa-on-arrival'
            ? '$25–$80'
            : '$80–$250+',
    processing:
      status === 'visa-free'
        ? 'None'
        : status === 'evisa'
          ? '1–5 working days'
          : status === 'visa-on-arrival'
            ? 'Airport process'
            : '2–8 weeks (embassy)',
    embassyTip: `Book appointments early for ${destination}. Synergy Travels & Tour can guide paperwork and biometrics.`,
    successTips: [
      'Keep bank statements clean and consistent',
      'Match hotel nights to your itinerary',
      'Avoid last-minute applications for peak seasons',
      'Use our Visa Services desk for document review',
    ],
  };
}
