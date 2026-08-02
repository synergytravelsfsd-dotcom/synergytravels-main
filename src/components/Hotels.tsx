import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Minimize as Swimming, Filter, SortAsc } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getHotelCompareLinks } from '../constants/integrations';
import { HOTEL_IMAGES } from '../data/tripImages';

const Hotels: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [starRating, setStarRating] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const { formatPrice } = useCurrency();

  // Makkah and Madinah Hotels
  const holyHotels = [
    {
      id: 1,
      name: 'Abraj Al-Bait Clock Tower',
      city: 'Makkah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.makkah1,
      rating: 4.9,
      reviews: 5432,
      amenities: ['Haram View', 'Prayer Facilities', 'Halal Restaurant', 'Shuttle Service'],
      description: 'Luxury hotel with direct Haram view and premium Islamic services.',
      category: 'Holy Cities',
      distance: '50m from Haram'
    },
    {
      id: 2,
      name: 'Hilton Suites Makkah',
      city: 'Makkah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.makkah2,
      rating: 4.7,
      reviews: 3876,
      amenities: ['Haram View', 'Family Rooms', 'Prayer Area', 'Buffet Restaurant'],
      description: 'Modern suites with excellent Haram proximity and family facilities.',
      category: 'Holy Cities',
      distance: '200m from Haram'
    },
    {
      id: 3,
      name: 'Swissotel Makkah',
      city: 'Makkah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.makkah3,
      rating: 4.8,
      reviews: 4321,
      amenities: ['Haram View', 'Spa & Wellness', 'Multiple Restaurants', 'VIP Services'],
      description: 'Swiss luxury with Islamic hospitality and premium Haram access.',
      category: 'Holy Cities',
      distance: '300m from Haram'
    },
    {
      id: 4,
      name: 'Pullman ZamZam Makkah',
      city: 'Makkah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.makkah4,
      rating: 4.6,
      reviews: 2987,
      amenities: ['Haram View', 'Business Center', 'Fitness Center', 'Concierge'],
      description: 'Contemporary hotel with excellent business facilities and Haram views.',
      category: 'Holy Cities',
      distance: '400m from Haram'
    },
    {
      id: 5,
      name: 'Al Madinah Harmony Hotel',
      city: 'Madinah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.madinah1,
      rating: 4.8,
      reviews: 3654,
      amenities: ['Masjid Nabawi View', 'Prayer Facilities', 'Halal Dining', 'Shuttle'],
      description: 'Peaceful hotel with Masjid Nabawi proximity and spiritual ambiance.',
      category: 'Holy Cities',
      distance: '100m from Masjid Nabawi'
    },
    {
      id: 6,
      name: 'Shaza Al Madinah',
      city: 'Madinah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.madinah2,
      rating: 4.7,
      reviews: 2876,
      amenities: ['Masjid View', 'Family Suites', 'Islamic Library', 'Wellness Center'],
      description: 'Elegant accommodation with Islamic heritage and modern comfort.',
      category: 'Holy Cities',
      distance: '250m from Masjid Nabawi'
    },
    {
      id: 7,
      name: 'Anwar Al Madinah Movenpick',
      city: 'Madinah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.madinah3,
      rating: 4.9,
      reviews: 4567,
      amenities: ['Masjid Nabawi View', 'Luxury Suites', 'Fine Dining', 'Spa Services'],
      description: 'Premium luxury hotel with exceptional Masjid Nabawi views and services.',
      category: 'Holy Cities',
      distance: '150m from Masjid Nabawi'
    },
    {
      id: 8,
      name: 'Dar Al Hijra InterContinental',
      city: 'Madinah',
      country: 'Saudi Arabia',
      image: HOTEL_IMAGES.madinah4,
      rating: 4.6,
      reviews: 3210,
      amenities: ['Masjid View', 'Business Center', 'Multiple Restaurants', 'Fitness'],
      description: 'International standard hotel with excellent religious and business facilities.',
      category: 'Holy Cities',
      distance: '300m from Masjid Nabawi'
    }
  ];

  // Comprehensive global hotels database
  const globalHotels = [
    // United States
    { id: 9, name: 'The Plaza Hotel', city: 'New York', country: 'United States', image: HOTEL_IMAGES.luxury1, rating: 4.8, reviews: 2847, amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Concierge'], description: 'Iconic luxury hotel in the heart of Manhattan.', category: 'International' },
    { id: 10, name: 'Beverly Hills Hotel', city: 'Los Angeles', country: 'United States', image: HOTEL_IMAGES.luxury2, rating: 4.9, reviews: 1923, amenities: ['Pool', 'Spa', 'Restaurant', 'Valet'], description: 'Legendary pink palace in Beverly Hills.', category: 'International' },
    { id: 11, name: 'The Ritz-Carlton Chicago', city: 'Chicago', country: 'United States', image: HOTEL_IMAGES.luxury3, rating: 4.7, reviews: 1654, amenities: ['Spa', 'Restaurant', 'Business Center', 'Gym'], description: 'Luxury hotel with stunning city views.', category: 'International' },
    
    // United Kingdom
    { id: 12, name: 'The Savoy London', city: 'London', country: 'United Kingdom', image: HOTEL_IMAGES.luxury4, rating: 4.9, reviews: 3241, amenities: ['Spa', 'Restaurant', 'Butler Service', 'Thames View'], description: 'Historic luxury hotel on the Thames.', category: 'International' },
    { id: 13, name: 'Claridge\'s London', city: 'London', country: 'United Kingdom', image: HOTEL_IMAGES.luxury6, rating: 4.8, reviews: 2156, amenities: ['Spa', 'Restaurant', 'Afternoon Tea', 'Concierge'], description: 'Art Deco elegance in Mayfair.', category: 'International' },
    
    // UAE
    { id: 14, name: 'Burj Al Arab Dubai', city: 'Dubai', country: 'UAE', image: HOTEL_IMAGES.dubai, rating: 4.9, reviews: 3456, amenities: ['Private Beach', 'Helicopter Pad', 'Butler Service', 'Spa'], description: 'World\'s most luxurious hotel.', category: 'International' },
    { id: 15, name: 'Atlantis The Palm Dubai', city: 'Dubai', country: 'UAE', image: HOTEL_IMAGES.luxury7, rating: 4.7, reviews: 2876, amenities: ['Aquarium', 'Water Park', 'Beach', 'Multiple Restaurants'], description: 'Iconic resort on Palm Jumeirah.', category: 'International' },
    
    // Pakistan
    { id: 16, name: 'Pearl Continental Karachi', city: 'Karachi', country: 'Pakistan', image: HOTEL_IMAGES.luxury8, rating: 4.3, reviews: 1543, amenities: ['Pool', 'Restaurant', 'Business Center', 'Spa'], description: 'Premier business hotel in financial district.', category: 'Domestic' },
    { id: 17, name: 'Serena Hotel Islamabad', city: 'Islamabad', country: 'Pakistan', image: HOTEL_IMAGES.luxury6, rating: 4.4, reviews: 1234, amenities: ['Garden', 'Spa', 'Restaurant', 'Mountain View'], description: 'Luxury hotel with Margalla Hills views.', category: 'Domestic' }
  ];

  const allHotels = [...holyHotels, ...globalHotels];

  const handleSearch = () => {
    if (!destination) {
      setFilteredHotels(allHotels.slice(0, 12));
      return;
    }

    const searchTerm = destination.toLowerCase();
    const filtered = allHotels.filter(hotel => 
      hotel.city.toLowerCase().includes(searchTerm) ||
      hotel.country.toLowerCase().includes(searchTerm) ||
      hotel.name.toLowerCase().includes(searchTerm) ||
      (hotel.category && hotel.category.toLowerCase().includes(searchTerm))
    );

    // Apply filters
    let results = filtered;
    
    if (starRating) {
      const minRating = parseFloat(starRating);
      results = results.filter(hotel => hotel.rating >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredHotels(results);

    // Open live hotel rates on Google Hotels
    const live = getHotelCompareLinks(destination, checkIn, checkOut, guests)[0];
    if (live) {
      window.open(live.href, '_blank', 'noopener,noreferrer');
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
      case 'valet':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
      case 'halal restaurant':
      case 'buffet restaurant':
      case 'fine dining':
        return <Coffee className="h-4 w-4" />;
      case 'swimming pool':
      case 'pool':
        return <Swimming className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const popularDestinations = [
    'Makkah', 'Madinah', 'Dubai', 'New York', 'London', 'Paris', 'Tokyo', 'Singapore', 
    'Bangkok', 'Istanbul', 'Rome', 'Barcelona', 'Sydney', 'Mumbai', 'Karachi', 'Lahore'
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Global Hotels & Sacred Accommodations
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover luxury accommodations worldwide including premium hotels in Makkah and Madinah 
            for your spiritual journey, plus international destinations for every travel need.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8 animate-bounce-gentle">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Hotel Booking Enquiry"
              message="Hi! I need help with hotel bookings and special rates. Can you assist?"
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email for hotel quotes
            </div>
          </div>
        </div>

        {/* Hotel Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-12 lg:mb-16 animate-slide-up delay-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Find Hotels Worldwide</h2>
          
          {/* Popular Destinations */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Popular destinations:</p>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest, index) => (
                <button
                  key={index}
                  onClick={() => setDestination(dest)}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-all transform hover:scale-105"
                  aria-label={`Search hotels in ${dest}`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, Country, or Hotel"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                aria-label="Search destination"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                aria-label="Check-in date"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                aria-label="Check-out date"
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                aria-label="Number of guests"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
            
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center transform hover:scale-105"
              aria-label="Search hotels"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>

          {destination && (
            <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <CompareLinks
                title="Compare live hotel rates"
                links={getHotelCompareLinks(destination, checkIn, checkOut, guests)}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <SortAsc className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm transition-all"
                aria-label="Sort hotels by"
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={starRating}
                    onChange={(e) => setStarRating(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 transition-all"
                    aria-label="Minimum star rating"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105"
                    aria-label="Apply filters"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured Holy Cities Hotels */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              🕋 Makkah & Madinah Premium Hotels
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sacred accommodations with Haram and Masjid Nabawi proximity for your spiritual journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {holyHotels.map((hotel, index) => (
              <div 
                key={hotel.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group border-2 border-green-100 animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={`${hotel.name} in ${hotel.city}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== HOTEL_IMAGES.fallback) img.src = HOTEL_IMAGES.fallback;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-xs text-gray-600">({hotel.reviews})</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    🕋 Holy City
                  </div>
                  {hotel.distance && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      📍 {hotel.distance}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{hotel.city}, {hotel.country}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{hotel.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <ContactChoice
                      fullWidth
                      variant="green"
                      label="Book Holy Stay"
                      subject={`Hotel Booking - ${hotel.name}, ${hotel.city}`}
                      message={`Hi! I'm interested in booking ${hotel.name} in ${hotel.city}. Can you provide rates and availability?`}
                    />
                    
                    <div className="text-center pt-3 border-t border-gray-100 space-y-2">
                      <ContactLinksRow
                        subject={`Hotel Enquiry - ${hotel.name}`}
                        message={`Hi! I'm interested in booking ${hotel.name} in ${hotel.city}. Can you provide rates and availability?`}
                      />
                      <CompareLinks
                        compact
                        links={getHotelCompareLinks(`${hotel.city}, ${hotel.country}`, checkIn, checkOut, guests)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Holy Cities Special Services */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white animate-slide-up">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">🕋 Complete Umrah & Hajj Hotel Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏨</div>
                  <p className="text-sm">Haram View Hotels</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚌</div>
                  <p className="text-sm">Shuttle Services</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🍽️</div>
                  <p className="text-sm">Halal Dining</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🕌</div>
                  <p className="text-sm">Prayer Facilities</p>
                </div>
              </div>
              <ContactChoice
                variant="green"
                buttonClassName="bg-white hover:bg-green-50 text-green-600"
                label="Get Complete Holy Cities Package"
                subject="Umrah/Hajj Hotel Packages"
                message="Hi! I need complete Umrah/Hajj hotel packages for Makkah and Madinah. Can you help with bookings and services?"
              />
            </div>
          </div>
        </div>

        {/* Hotel Results */}
        {filteredHotels.length > 0 && (
          <div className="mb-12 lg:mb-16">
            <div className="flex items-center justify-between mb-6 lg:mb-8 animate-slide-up">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {filteredHotels.length} Hotels Found
                {destination && ` in ${destination}`}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Showing {filteredHotels.length} results
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredHotels.map((hotel, index) => (
                <div 
                  key={hotel.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group animate-card-float"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={`${hotel.name} in ${hotel.city}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== HOTEL_IMAGES.fallback) img.src = HOTEL_IMAGES.fallback;
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                        <span className="text-xs text-gray-600">({hotel.reviews})</span>
                      </div>
                    </div>
                    {hotel.category === 'Holy Cities' && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        🕋 Holy City
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.city}, {hotel.country}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4">{hotel.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-lg text-xs">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <ContactChoice
                        fullWidth
                        variant="orange"
                        label="Book Now"
                        subject={`Hotel Booking - ${hotel.name}, ${hotel.city}`}
                        message={`Hi! I'm interested in booking ${hotel.name} in ${hotel.city}. Can you provide rates and availability?`}
                      />
                      
                      <div className="text-center pt-3 border-t border-gray-100 space-y-2">
                        <ContactLinksRow
                          subject={`Hotel Enquiry - ${hotel.name}`}
                          message={`Hi! I'm interested in booking ${hotel.name} in ${hotel.city}. Can you provide rates and availability?`}
                        />
                        <CompareLinks
                          compact
                          links={getHotelCompareLinks(`${hotel.city}, ${hotel.country}`, checkIn, checkOut, guests)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 lg:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Need Special Hotel Arrangements?</h2>
            <p className="text-orange-100 mb-6">
              Contact us for custom hotel packages, group bookings, and special rates for 
              religious tours, corporate travel, and family vacations worldwide.
            </p>
            <div className="flex justify-center">
              <ContactChoice
                variant="green"
                label="Get Custom Quote"
                subject="Custom Hotel Arrangements"
                message="Hi! I need custom hotel arrangements and special rates. Can you help me with my booking?"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
        
        .animate-card-float {
          animation: card-float 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </section>
  );
};

export default Hotels;