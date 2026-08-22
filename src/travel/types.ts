/** Shared travel search types for provider adapters */

export type CabinClass = 'economy' | 'premium' | 'business' | 'first';
export type TripType = 'oneway' | 'roundtrip' | 'multicity';

export type FlightSegmentInput = {
  from: string;
  to: string;
  date: string;
};

export type FlightSearchInput = {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabin: CabinClass;
  tripType: TripType;
  segments?: FlightSegmentInput[];
};

export type HotelSearchInput = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

export type CarSearchInput = {
  pickup: string;
  dropoff?: string;
  pickupDate: string;
  dropoffDate: string;
};

export type TravelOffer = {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  deepLink: string;
  /** true only when an authorised live API returned this offer */
  isLiveInventory: boolean;
  meta?: Record<string, string | number | boolean>;
};

export type TravelSearchResult = {
  mode: 'enquiry' | 'deeplink' | 'live' | 'demo';
  offers: TravelOffer[];
  deeplinks: { id: string; label: string; href: string }[];
  message: string;
};

export interface TravelProvider {
  id: string;
  name: string;
  searchFlights(input: FlightSearchInput): Promise<TravelSearchResult>;
  searchHotels(input: HotelSearchInput): Promise<TravelSearchResult>;
  searchCars?(input: CarSearchInput): Promise<TravelSearchResult>;
}
