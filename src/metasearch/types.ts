/** Metasearch domain types — UI-stable contracts for affiliate adapters */

export type SearchVertical =
  | 'flights'
  | 'hotels'
  | 'packages'
  | 'visa'
  | 'activities'
  | 'cruises'
  | 'cars'
  | 'insurance'
  | 'umrah'
  | 'hajj'
  | 'corporate';

export type CabinClass = 'economy' | 'premium' | 'business' | 'first';
export type TravelStyle = 'luxury' | 'budget' | 'family' | 'adventure' | 'business' | 'honeymoon' | 'spiritual';
export type SortMode = 'cheapest' | 'fastest' | 'best' | 'rating' | 'deals';

export type MetaSearchQuery = {
  vertical: SearchVertical;
  origin?: string;
  destination: string;
  departDate?: string;
  returnDate?: string;
  adults: number;
  children: number;
  cabin?: CabinClass;
  nationality?: string;
  budgetMax?: number;
  travelStyle?: TravelStyle;
  rooms?: number;
  flexibleDates?: boolean;
};

export type AffiliateOffer = {
  id: string;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  title: string;
  subtitle?: string;
  price: number;
  currency: string;
  taxesIncluded: boolean;
  cancellation?: string;
  breakfast?: boolean;
  rating?: number;
  reviews?: number;
  distance?: string;
  dealBadge?: string;
  coupon?: string;
  deepLink: string;
  meta?: Record<string, string | number | boolean>;
};

export type FlightOffer = AffiliateOffer & {
  airline: string;
  duration: string;
  stops: number;
  departTime: string;
  arriveTime: string;
  refundable?: boolean;
  carbonKg?: number;
  direct?: boolean;
};

export type HotelOffer = AffiliateOffer & {
  stars: number;
  amenities: string[];
  neighborhood?: string;
  freeCancellation: boolean;
};

export type ActivityOffer = AffiliateOffer & {
  duration: string;
  languages: string[];
};

export type CompareResultSet = {
  query: MetaSearchQuery;
  generatedAt: string;
  offers: AffiliateOffer[];
  insights: string[];
  cheapest?: AffiliateOffer;
  bestValue?: AffiliateOffer;
};
