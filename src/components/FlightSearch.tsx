import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, ArrowLeftRight, Plane, Clock, Wifi, Coffee, X, ExternalLink, Plus, Trash2, Route } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import {
  getFlightCompareLinks,
  extractAirportCode,
  formatMultiCityRoute,
  getValidSegments,
  type FlightSearchParams,
  type FlightSegment,
} from '../constants/integrations';
import { searchAirports } from '../data/airports';

const FlightSearch: React.FC = () => {
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [segments, setSegments] = useState<FlightSegment[]>([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' },
  ]);
  const [activeSegmentField, setActiveSegmentField] = useState<{ index: number; field: 'from' | 'to' } | null>(null);
  const [segmentSuggestions, setSegmentSuggestions] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const { formatPrice } = useCurrency();
  const isMultiCity = tripType === 'multicity';

  const filterAirports = (input: string) => searchAirports(input, 15);

  // Handle from input change
  const handleFromChange = (value: string) => {
    setFrom(value);
    const suggestions = filterAirports(value);
    setFromSuggestions(suggestions);
    setShowFromSuggestions(suggestions.length > 0 && value.trim().length >= 1);
  };

  // Handle to input change
  const handleToChange = (value: string) => {
    setTo(value);
    const suggestions = filterAirports(value);
    setToSuggestions(suggestions);
    setShowToSuggestions(suggestions.length > 0 && value.trim().length >= 1);
  };

  // Select airport from suggestions
  const selectAirport = (airport: any, type: 'from' | 'to') => {
    const airportString = `${airport.city} (${airport.code})`;
    if (type === 'from') {
      setFrom(airportString);
      setShowFromSuggestions(false);
    } else {
      setTo(airportString);
      setShowToSuggestions(false);
    }
  };

  const updateSegment = (index: number, field: keyof FlightSegment, value: string) => {
    setSegments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === 'to' && index < next.length - 1 && !next[index + 1].from) {
        next[index + 1] = { ...next[index + 1], from: value };
      }
      return next;
    });
  };

  const handleSegmentAirportInput = (index: number, field: 'from' | 'to', value: string) => {
    updateSegment(index, field, value);
    setActiveSegmentField({ index, field });
    const suggestions = filterAirports(value);
    setSegmentSuggestions(suggestions);
  };

  const selectSegmentAirport = (index: number, field: 'from' | 'to', airport: any) => {
    const value = `${airport.city} (${airport.code})`;
    updateSegment(index, field, value);
    setActiveSegmentField(null);
    setSegmentSuggestions([]);
  };

  const addSegment = () => {
    if (segments.length >= 6) return;
    const lastTo = segments[segments.length - 1]?.to || '';
    setSegments((prev) => [...prev, { from: lastTo, to: '', date: '' }]);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 2) return;
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const flightParams: FlightSearchParams = useMemo(
    () => ({
      from: isMultiCity ? (segments[0]?.from || '') : from,
      to: isMultiCity ? (segments[segments.length - 1]?.to || '') : to,
      departure: isMultiCity ? (segments[0]?.date || '') : departure,
      returnDate: isMultiCity ? undefined : returnDate,
      passengers,
      tripType: isMultiCity ? 'multicity' : tripType === 'oneway' ? 'oneway' : 'roundtrip',
      segments: isMultiCity ? segments : undefined,
    }),
    [from, to, departure, returnDate, passengers, tripType, segments, isMultiCity]
  );

  const multiCityRoute = useMemo(
    () => (isMultiCity ? formatMultiCityRoute(getValidSegments(flightParams)) : ''),
    [isMultiCity, flightParams]
  );

  const liveCompareLinks = useMemo(() => getFlightCompareLinks(flightParams), [flightParams]);

  // Guide prices for planning; live fares open on Google Flights / Skyscanner / Kayak
  const generateEnhancedFlightData = async () => {
    const airlines = [
      { name: 'Pakistan International Airlines', code: 'PK', logo: '🇵🇰', isPIA: true },
      { name: 'Emirates', code: 'EK', logo: '🇦🇪' },
      { name: 'Qatar Airways', code: 'QR', logo: '🇶🇦' },
      { name: 'Lufthansa', code: 'LH', logo: '🇩🇪' },
      { name: 'British Airways', code: 'BA', logo: '🇬🇧' },
      { name: 'Singapore Airlines', code: 'SQ', logo: '🇸🇬' },
      { name: 'Turkish Airlines', code: 'TK', logo: '🇹🇷' },
      { name: 'Air France', code: 'AF', logo: '🇫🇷' },
      { name: 'KLM', code: 'KL', logo: '🇳🇱' },
      { name: 'Etihad Airways', code: 'EY', logo: '🇦🇪' }
    ];

    const getRouteBasePrice = (origin: string, dest: string) => {
      const routePricing: Record<string, number> = {
        'LYP-DXB': 280, 'LYP-LHR': 520, 'LYP-DOH': 350, 'LYP-JED': 380,
        'KHI-DXB': 320, 'KHI-LHR': 580, 'KHI-DOH': 380, 'KHI-JED': 420,
        'LHE-DXB': 300, 'LHE-LHR': 550, 'LHE-DOH': 360, 'LHE-JED': 400,
        'ISB-DXB': 320, 'ISB-LHR': 560, 'ISB-DOH': 370, 'ISB-JED': 410,
        'LHR-DXB': 420, 'LHR-JFK': 480, 'LHR-ISB': 560, 'LHR-KHI': 580,
        'LGW-DXB': 390, 'MAN-DXB': 410, 'STN-AYT': 180,
        'JFK-DXB': 850, 'LAX-LHR': 750, 'ORD-CDG': 680, 'MIA-MAD': 620,
        'DXB-LHR': 420, 'DOH-JFK': 890, 'SIN-NRT': 380, 'BKK-SYD': 450,
        'DEL-DXB': 280, 'BOM-LHR': 580, 'CMB-DXB': 380, 'DAC-DOH': 420,
        'KUL-SIN': 180, 'CGK-SIN': 220, 'MNL-HKG': 280, 'ICN-NRT': 320,
        'PEK-SIN': 450, 'CAI-DXB': 280, 'JNB-DOH': 520, 'ADD-DXB': 380
      };
      
      const routeKey = `${origin}-${dest}`;
      const reverseKey = `${dest}-${origin}`;
      
      return routePricing[routeKey] || routePricing[reverseKey] || 
             (Math.random() * 800 + 400);
    };

    const validSegments = isMultiCity ? getValidSegments(flightParams) : [];
    const fromCity = isMultiCity
      ? (validSegments[0]?.from || 'London (LHR)')
      : (from || 'London (LHR)');
    const toCity = isMultiCity
      ? (validSegments[validSegments.length - 1]?.to || 'Dubai (DXB)')
      : (to || 'Dubai (DXB)');
    const fromCode = extractAirportCode(fromCity) || 'LHR';
    const toCode = extractAirportCode(toCity) || 'DXB';
    const routeLabel = isMultiCity
      ? formatMultiCityRoute(validSegments)
      : `${fromCity} → ${toCity}`;

    let basePrice = 0;
    if (isMultiCity && validSegments.length >= 2) {
      basePrice = validSegments.reduce((sum, seg) => {
        const o = extractAirportCode(seg.from);
        const d = extractAirportCode(seg.to);
        return sum + getRouteBasePrice(o, d);
      }, 0);
      // Multi-city through-fare discount vs booking legs separately
      basePrice = basePrice * 0.88;
    } else {
      basePrice = getRouteBasePrice(fromCode, toCode);
    }

    return airlines.map((airline, index) => {
      const priceVariation = (Math.random() - 0.5) * (isMultiCity ? 450 : 300);
      let finalPrice = Math.max(isMultiCity ? 450 : 200, basePrice + priceVariation);
      
      const pakistanCodes = ['LYP', 'LHE', 'KHI', 'ISB', 'PEW', 'UET', 'MUX', 'SKT'];
      const touchesPakistan = isMultiCity
        ? validSegments.some((seg) => {
            const o = extractAirportCode(seg.from);
            const d = extractAirportCode(seg.to);
            return pakistanCodes.includes(o) || pakistanCodes.includes(d);
          })
        : (pakistanCodes.includes(fromCode) || ['LYP', 'LHE', 'KHI', 'ISB'].includes(toCode));

      if (airline.isPIA && touchesPakistan) {
        finalPrice = finalPrice * 0.85;
      }
      
      const departureHour = 6 + Math.floor(Math.random() * 16);
      const flightDuration = (isMultiCity ? 8 : 3) + Math.random() * (isMultiCity ? 18 : 12);
      const arrivalHour = (departureHour + flightDuration) % 24;
      const nextDay = departureHour + flightDuration >= 24;
      const legCount = isMultiCity ? validSegments.length : 1;
      
      return {
        id: index + 1,
        airline: airline.name,
        airlineCode: airline.code,
        logo: airline.logo,
        isPIA: airline.isPIA,
        from: fromCity,
        to: toCity,
        routeLabel,
        tripType: isMultiCity ? 'multicity' : tripType,
        segments: isMultiCity
          ? validSegments.map((seg, segIndex) => {
              const legHour = (departureHour + segIndex * 4) % 24;
              const legDur = 2 + Math.random() * 8;
              const legArr = (legHour + legDur) % 24;
              return {
                ...seg,
                departure: `${legHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                arrival: `${Math.floor(legArr).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                duration: `${Math.floor(legDur)}h ${Math.floor((legDur % 1) * 60)}m`,
              };
            })
          : undefined,
        departure: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        arrival: `${Math.floor(arrivalHour).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}${nextDay ? '+1' : ''}`,
        duration: `${Math.floor(flightDuration)}h ${Math.floor((flightDuration % 1) * 60)}m`,
        price: Math.round(finalPrice),
        stops: isMultiCity
          ? `${legCount} cities · ${legCount - 1} connections`
          : (Math.random() > 0.6 ? 'Non-stop' : '1 stop'),
        aircraft: ['Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350', 'Boeing 737', 'Airbus A320'][Math.floor(Math.random() * 6)],
        amenities: ['WiFi', 'Entertainment', 'Meals', 'Power Outlets'],
        priceChange: Math.random() > 0.5 ? 'up' : 'down',
        lastUpdated: new Date().toLocaleTimeString(),
        availability: Math.floor(Math.random() * 9) + 1,
        source: 'guide-price'
      };
    }).sort((a, b) => a.price - b.price);
  };

  const handleSearch = async () => {
    if (isMultiCity) {
      const valid = getValidSegments(flightParams);
      if (valid.length < 2) {
        alert('Please complete at least 2 multi-city legs (from, to, and date for each).');
        return;
      }
      for (let i = 0; i < valid.length; i++) {
        if (extractAirportCode(valid[i].from) === extractAirportCode(valid[i].to)) {
          alert(`Leg ${i + 1}: origin and destination must be different.`);
          return;
        }
      }
    } else if (!from || !to || !departure) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    
    try {
      const enhancedFlights = await generateEnhancedFlightData();
      setSearchResults(enhancedFlights);
      const googleLink = getFlightCompareLinks(flightParams).find((l) => l.id === 'google-flights');
      if (googleLink) {
        window.open(googleLink.href, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
      const basicFlights = await generateEnhancedFlightData();
      setSearchResults(basicFlights);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-refresh flight prices every 30 seconds
  useEffect(() => {
    if (searchResults.length > 0) {
      const interval = setInterval(() => {
        setSearchResults(prevResults => 
          prevResults.map(flight => ({
            ...flight,
            price: Math.max(200, flight.price + (Math.random() - 0.5) * 50),
            priceChange: Math.random() > 0.5 ? 'up' : 'down',
            lastUpdated: new Date().toLocaleTimeString()
          }))
        );
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [searchResults]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFromSuggestions(false);
      setShowToSuggestions(false);
      setActiveSegmentField(null);
      setSegmentSuggestions([]);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const buildBookingMessage = (flight: any) => {
    if (flight.tripType === 'multicity' && flight.segments?.length) {
      const legs = flight.segments
        .map((seg: any, i: number) =>
          `Leg ${i + 1}: ${seg.from} → ${seg.to} on ${seg.date} (${seg.departure}–${seg.arrival}, ${seg.duration})`
        )
        .join('\n');
      return `Hi! I want to book this multi-city itinerary:\nAirline: ${flight.airline} (${flight.airlineCode})\nRoute: ${flight.routeLabel}\n${legs}\nPassengers: ${passengers}\nGuide total: approximately ${flight.price} per person\n\nPlease confirm live fare and complete the booking.`;
    }
    return `Hi! I want to book this flight:\nAirline: ${flight.airline} (${flight.airlineCode})\nFrom: ${flight.from}\nTo: ${flight.to}\nDeparture date: ${departure}\nDeparture time: ${flight.departure}\nArrival: ${flight.arrival}\nDuration: ${flight.duration}\nStops: ${flight.stops}\nGuide price: approximately ${flight.price} per person\n\nPlease confirm live fare and complete the booking.`;
  };

  const buildBookingSubject = (flight: any) => {
    if (flight.tripType === 'multicity' && flight.routeLabel) {
      return `Multi-city Flight Booking - ${flight.airline} ${flight.routeLabel}`;
    }
    return `Flight Booking - ${flight.airline} ${flight.from} to ${flight.to}`;
  };

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-bounce">
            ✈️ Live Prices via Google Flights · Skyscanner · Kayak
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 animate-fade-in">
            Find Your Perfect Flight
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 px-4 max-w-3xl mx-auto animate-fade-in-delay">
            Round trip, one way, or multi-city — search opens live fares on Google Flights, plus Skyscanner and Kayak. Book with us via WhatsApp or Email.
          </p>
        </div>

        {/* Enhanced Flight Search Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-12 border border-gray-100 animate-slide-up">
          {/* Trip Type */}
          <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="roundtrip"
                checked={tripType === 'roundtrip'}
                onChange={(e) => {
                  setTripType(e.target.value);
                  setSearchResults([]);
                }}
                className="sr-only"
              />
              <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 transition-all text-xs sm:text-sm lg:text-base transform hover:scale-105 ${
                tripType === 'roundtrip' 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                Round Trip
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="oneway"
                checked={tripType === 'oneway'}
                onChange={(e) => {
                  setTripType(e.target.value);
                  setSearchResults([]);
                }}
                className="sr-only"
              />
              <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 transition-all text-xs sm:text-sm lg:text-base transform hover:scale-105 ${
                tripType === 'oneway' 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                One Way
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="multicity"
                checked={tripType === 'multicity'}
                onChange={(e) => {
                  setTripType(e.target.value);
                  setSearchResults([]);
                }}
                className="sr-only"
              />
              <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 transition-all text-xs sm:text-sm lg:text-base transform hover:scale-105 ${
                tripType === 'multicity' 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                Multi-city
              </div>
            </label>
          </div>

          {/* Multi-city legs */}
          {isMultiCity ? (
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Route className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Build your multi-city itinerary</span>
                  {multiCityRoute && (
                    <span className="hidden sm:inline text-xs text-blue-600 font-semibold">{multiCityRoute}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{segments.length}/6 legs</span>
              </div>

              {segments.map((segment, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Flight {index + 1}
                    </span>
                    {segments.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeSegment(index)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <input
                        type="text"
                        placeholder="From"
                        value={segment.from}
                        onChange={(e) => handleSegmentAirportInput(index, 'from', e.target.value)}
                        onFocus={() => {
                          setActiveSegmentField({ index, field: 'from' });
                          setSegmentSuggestions(filterAirports(segment.from));
                        }}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      />
                      {activeSegmentField?.index === index &&
                        activeSegmentField.field === 'from' &&
                        segmentSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                          {segmentSuggestions.map((airport, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => selectSegmentAirport(index, 'from', airport)}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900 text-sm">{airport.code} - {airport.city}</div>
                              <div className="text-xs text-gray-600 truncate">{airport.name}, {airport.country}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <ArrowLeftRight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <input
                        type="text"
                        placeholder="To"
                        value={segment.to}
                        onChange={(e) => handleSegmentAirportInput(index, 'to', e.target.value)}
                        onFocus={() => {
                          setActiveSegmentField({ index, field: 'to' });
                          setSegmentSuggestions(filterAirports(segment.to));
                        }}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      />
                      {activeSegmentField?.index === index &&
                        activeSegmentField.field === 'to' &&
                        segmentSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                          {segmentSuggestions.map((airport, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => selectSegmentAirport(index, 'to', airport)}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900 text-sm">{airport.code} - {airport.city}</div>
                              <div className="text-xs text-gray-600 truncate">{airport.name}, {airport.country}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={segment.date}
                        min={index > 0 && segments[index - 1].date ? segments[index - 1].date : undefined}
                        onChange={(e) => updateSegment(index, 'date', e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={addSegment}
                  disabled={segments.length >= 6}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-blue-300 text-blue-700 text-sm font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add another flight
                </button>

                <div className="relative flex-1 sm:max-w-xs">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4+ Passengers</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
            {/* From Airport */}
            <div className="relative group sm:col-span-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="From (City/Country)"
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
                onFocus={() => setShowFromSuggestions(fromSuggestions.length > 0)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base hover:shadow-md"
              />
              
              {/* From Suggestions Dropdown */}
              {showFromSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 sm:max-h-64 overflow-y-auto mt-1 animate-fade-in">
                  <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50/80">
                    <span className="text-xs font-medium text-gray-600">Select Airport</span>
                    <button
                      onClick={() => setShowFromSuggestions(false)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                  {fromSuggestions.map((airport, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAirport(airport, 'from');
                      }}
                      className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors transform hover:scale-[1.02]"
                    >
                      <div className="font-medium text-gray-900 text-sm">{airport.code} - {airport.city}</div>
                      <div className="text-xs text-gray-600 truncate">{airport.name}, {airport.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* To Airport */}
            <div className="relative group sm:col-span-1">
              <ArrowLeftRight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="To (City/Country)"
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
                onFocus={() => setShowToSuggestions(toSuggestions.length > 0)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base hover:shadow-md"
              />
              
              {/* To Suggestions Dropdown */}
              {showToSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 sm:max-h-64 overflow-y-auto mt-1 animate-fade-in">
                  <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50/80">
                    <span className="text-xs font-medium text-gray-600">Select Airport</span>
                    <button
                      onClick={() => setShowToSuggestions(false)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                  {toSuggestions.map((airport, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAirport(airport, 'to');
                      }}
                      className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors transform hover:scale-[1.02]"
                    >
                      <div className="font-medium text-gray-900 text-sm">{airport.code} - {airport.city}</div>
                      <div className="text-xs text-gray-600 truncate">{airport.name}, {airport.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base hover:shadow-md"
              />
            </div>
            
            {tripType === 'roundtrip' && (
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base hover:shadow-md"
                />
              </div>
            )}
            
            <div className="relative group">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base appearance-none bg-white hover:shadow-md"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4+ Passengers</option>
              </select>
            </div>
          </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center transform hover:scale-[1.02] shadow-lg text-sm sm:text-base animate-pulse-slow"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Opening live prices on Google Flights...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {isMultiCity ? 'Search Multi-city Live Prices' : 'Search Live Prices'}
              </>
            )}
          </button>

          {liveCompareLinks.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <CompareLinks
                title="Compare live prices on"
                links={liveCompareLinks}
              />
            </div>
          )}
        </div>

        {/* Enhanced Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 animate-fade-in">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {isMultiCity ? 'Multi-city Options & Live Comparison' : 'Flight Options & Live Comparison'}
                </h3>
                {isMultiCity && multiCityRoute && (
                  <p className="text-sm text-blue-700 font-medium">{multiCityRoute} · {passengers} passenger{passengers === '1' ? '' : 's'}</p>
                )}
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Guide prices shown · Live fares on Google / Skyscanner / Kayak</span>
                </div>
              </div>
              <CompareLinks links={liveCompareLinks} title="Open live fares" />
            </div>
            
            {searchResults.map((flight, index) => (
              <div key={flight.id} className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:scale-[1.02] animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="space-y-3 sm:space-y-4">
                  {/* Mobile Layout: Airline Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-br ${flight.isPIA ? 'from-green-100 to-green-200' : 'from-blue-100 to-purple-100'} p-2 rounded-lg transform hover:scale-110 transition-transform`}>
                        <span className="text-lg sm:text-xl">{flight.logo}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{flight.airline}</h4>
                          {flight.isPIA && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                              PIA Special Rate
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">{flight.airlineCode} • {flight.aircraft}</p>
                        <p className="text-xs text-gray-500">{flight.stops}</p>
                      </div>
                    </div>
                    
                    {/* Mobile Price */}
                    <div className="text-right sm:hidden">
                      <div className="flex items-center space-x-1">
                        <div className="text-lg font-bold text-gray-900">{formatPrice(flight.price)}</div>
                        <div className={`text-xs px-1.5 py-0.5 rounded-full animate-pulse ${
                          flight.priceChange === 'up' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {flight.priceChange === 'up' ? '↗' : '↘'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">per person</div>
                      <div className="text-xs text-orange-600 font-medium animate-bounce">{flight.availability} seats left</div>
                    </div>
                  </div>
                  
                  {/* Flight Times / Multi-city legs */}
                  {flight.tripType === 'multicity' && flight.segments?.length ? (
                    <div className="space-y-2 py-2">
                      <div className="text-center text-sm font-semibold text-blue-700 mb-1">
                        {flight.routeLabel}
                      </div>
                      {flight.segments.map((seg: any, segIndex: number) => (
                        <div
                          key={segIndex}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-xs sm:text-sm"
                        >
                          <div className="font-medium text-gray-800">
                            Leg {segIndex + 1}: {seg.from} → {seg.to}
                          </div>
                          <div className="text-gray-600">
                            {seg.date} · {seg.departure}–{seg.arrival} · {seg.duration}
                          </div>
                        </div>
                      ))}
                      <div className="text-center text-xs text-gray-500 pt-1">
                        Total journey ~ {flight.duration} · {flight.stops}
                      </div>
                    </div>
                  ) : (
                  <div className="flex items-center justify-center space-x-4 sm:space-x-6 py-2">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{flight.departure}</div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate max-w-[60px] sm:max-w-none">
                        {flight.from.split('(')[0].trim().substring(0, 8)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">{flight.duration}</div>
                      <div className="flex items-center space-x-2">
                        <div className="h-px bg-gradient-to-r from-blue-300 to-purple-300 w-6 sm:w-12"></div>
                        <Plane className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 animate-bounce" />
                        <div className="h-px bg-gradient-to-r from-purple-300 to-cyan-300 w-6 sm:w-12"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{flight.stops}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{flight.arrival}</div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate max-w-[60px] sm:max-w-none">
                        {flight.to.split('(')[0].trim().substring(0, 8)}
                      </div>
                    </div>
                  </div>
                  )}
                  
                  {/* Desktop Price and Book Section */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Amenities */}
                      <div className="hidden lg:flex items-center space-x-3">
                        <Wifi className="h-4 w-4 text-blue-500 animate-pulse" />
                        <Coffee className="h-4 w-4 text-green-500 animate-pulse" />
                        <Clock className="h-4 w-4 text-purple-500 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="text-xl lg:text-2xl font-bold text-gray-900">{formatPrice(flight.price)}</div>
                          <div className={`text-xs px-2 py-1 rounded-full animate-pulse ${
                            flight.priceChange === 'up' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {flight.priceChange === 'up' ? '↗' : '↘'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">guide / per person</div>
                        <div className="text-xs text-gray-500">Updated: {flight.lastUpdated}</div>
                        <div className="text-xs text-orange-600 font-medium animate-bounce">{flight.availability} seats left</div>
                      </div>
                      <div className="flex flex-col gap-2 items-stretch">
                        {liveCompareLinks[0] && (
                          <a
                            href={liveCompareLinks[0].href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                          >
                            Live on Google <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <ContactChoice
                          variant="gradient"
                          label="Book Now"
                          subject={buildBookingSubject(flight)}
                          message={buildBookingMessage(flight)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Book Button */}
                  <div className="w-full sm:hidden">
                                        <ContactChoice
                      fullWidth
                      variant="gradient"
                      label="Book Now"
                      subject={buildBookingSubject(flight)}
                      message={buildBookingMessage(flight)}
                    />
                  </div>
                  
                  {/* Additional Info */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-0">
                      <div className="flex flex-wrap gap-2 sm:gap-4">
                        <span>✓ Free cancellation within 24h</span>
                        <span>✓ Seat selection available</span>
                        <span className="hidden sm:inline">✓ Baggage included</span>
                        <span className="text-blue-600 font-medium">• Compare live on Google / Skyscanner / Kayak</span>
                      </div>
                      <ContactLinksRow
                        className="justify-end"
                        subject={flight.tripType === 'multicity'
                          ? `Multi-city Details - ${flight.airline} ${flight.routeLabel}`
                          : `Flight Details - ${flight.airline} ${flight.from} to ${flight.to}`}
                        message={buildBookingMessage(flight)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Price Alert */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-blue-200 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Set Price Alert</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {isMultiCity
                      ? 'Get notified when multi-city prices drop via Google Flights'
                      : 'Get notified when prices drop for this route via Google Flights'}
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base">
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FlightSearch;