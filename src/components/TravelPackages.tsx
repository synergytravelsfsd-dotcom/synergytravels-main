import React from 'react';
import { MapPin, Clock, Users, Star, Calendar, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getTourCompareLinks } from '../constants/integrations';
import { findTripByTitle, LEGACY_PACKAGE_ID_MAP, navigateToTrip } from '../data/trips';
import { TRIP_IMAGES } from '../data/tripImages';
import TripInquiryForm from './TripInquiryForm';
import HolidayBuilder from './HolidayBuilder';
import AiConsultant from './AiConsultant';

function openTripDetail(pkg: { id: number; title: string }) {
  const trip =
    findTripByTitle(pkg.title) ||
    (LEGACY_PACKAGE_ID_MAP[pkg.id]
      ? { id: LEGACY_PACKAGE_ID_MAP[pkg.id] }
      : undefined);
  if (trip?.id) {
    navigateToTrip(trip.id);
    return;
  }
  document.getElementById('packages-enquiry')?.scrollIntoView({ behavior: 'smooth' });
}

function PackageImage({
  src,
  alt,
  onOpen,
  heightClass = 'h-48',
}: {
  src: string;
  alt: string;
  onOpen: () => void;
  heightClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative ${heightClass} w-full overflow-hidden block text-left`}
      aria-label={`View details for ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== TRIP_IMAGES.travel) img.src = TRIP_IMAGES.travel;
        }}
      />
    </button>
  );
}

const TravelPackages: React.FC = () => {
  const { formatPrice } = useCurrency();

  const packages = [
    {
      id: 1,
      title: 'Tropical Paradise - Maldives',
      image: TRIP_IMAGES.maldives,
      price: 2499,
      duration: '7 Days / 6 Nights',
      rating: 4.9,
      location: 'Maldives',
      description: 'Luxury overwater bungalows with pristine beaches and crystal-clear waters.',
      highlights: ['Overwater Villa', 'All Meals Included', 'Spa & Wellness', 'Water Sports']
    },
    {
      id: 2,
      title: 'European Grand Tour',
      image: TRIP_IMAGES.europe,
      price: 3299,
      duration: '14 Days / 13 Nights',
      rating: 4.8,
      location: 'Europe',
      description: 'Explore iconic cities across Europe including Paris, Rome, and Barcelona.',
      highlights: ['Multi-City Tour', 'Cultural Experiences', 'Historic Sites', 'Local Cuisine']
    },
    {
      id: 3,
      title: 'Adventure in Himalayas',
      image: TRIP_IMAGES.himalayas,
      price: 1899,
      duration: '10 Days / 9 Nights',
      rating: 4.7,
      location: 'Nepal',
      description: 'Trekking adventure through the majestic Himalayan mountains.',
      highlights: ['Mountain Trekking', 'Base Camp Visit', 'Local Culture', 'Adventure Sports']
    },
    {
      id: 4,
      title: 'Safari Adventure Kenya',
      image: TRIP_IMAGES.kenya,
      price: 2799,
      duration: '8 Days / 7 Nights',
      rating: 4.9,
      location: 'Kenya',
      description: 'Experience the wild beauty of African safari with luxury accommodations.',
      highlights: ['Game Drives', 'Luxury Lodges', 'Wildlife Photography', 'Cultural Tours']
    },
    {
      id: 5,
      title: 'Romantic Paris Getaway',
      image: TRIP_IMAGES.paris,
      price: 1999,
      duration: '5 Days / 4 Nights',
      rating: 4.8,
      location: 'France',
      description: 'Perfect honeymoon package with romantic experiences in the City of Love.',
      highlights: ['Eiffel Tower', 'Seine River Cruise', 'Fine Dining', 'Couples Spa']
    },
    {
      id: 6,
      title: 'Spiritual India Journey',
      image: TRIP_IMAGES.india,
      price: 1299,
      duration: '12 Days / 11 Nights',
      rating: 4.6,
      location: 'India',
      description: 'Discover spiritual India with visits to sacred temples and holy cities.',
      highlights: ['Temple Visits', 'Yoga & Meditation', 'Cultural Immersion', 'Spiritual Guides']
    }
  ];

  // Updated Umrah Packages with authentic Makkah/Madinah background images
  const umrahPackages = [
    {
      id: 7,
      title: 'Premium Umrah Package - Makkah & Madina',
      image: TRIP_IMAGES.makkah, // Kaaba and Haram Sharif background
      price: 2299,
      duration: '14 Days / 13 Nights',
      rating: 4.9,
      location: 'Saudi Arabia',
      description: 'Complete Umrah pilgrimage with premium accommodations near Haram Sharif and Masjid Nabawi.',
      highlights: ['5-Star Hotels', 'Haram View Rooms', 'Guided Tours', 'VIP Transport'],
      category: 'Religious'
    },
    {
      id: 8,
      title: 'Economy Umrah Package - Makkah & Madina',
      image: TRIP_IMAGES.madinah, // Masjid Nabawi background
      price: 1599,
      duration: '10 Days / 9 Nights',
      rating: 4.7,
      location: 'Saudi Arabia',
      description: 'Affordable Umrah package with comfortable accommodations and all essential services.',
      highlights: ['3-Star Hotels', 'Group Transport', 'Religious Guidance', 'Ziyarat Tours'],
      category: 'Religious'
    },
    {
      id: 9,
      title: 'Luxury Umrah Package - Extended Stay',
      image: TRIP_IMAGES.umrahLuxury, // Makkah Clock Tower background
      price: 3499,
      duration: '21 Days / 20 Nights',
      rating: 5.0,
      location: 'Saudi Arabia',
      description: 'Extended luxury Umrah experience with premium services and comprehensive spiritual guidance.',
      highlights: ['Luxury Hotels', 'Private Transport', 'Personal Guide', 'Extended Ziyarat'],
      category: 'Religious'
    },
    {
      id: 10,
      title: 'Family Umrah Package - Special Rates',
      image: TRIP_IMAGES.umrahFamily, // Islamic architecture background
      price: 1899,
      duration: '12 Days / 11 Nights',
      rating: 4.8,
      location: 'Saudi Arabia',
      description: 'Family-friendly Umrah package with special arrangements for children and elderly pilgrims.',
      highlights: ['Family Rooms', 'Child Care', 'Wheelchair Access', 'Family Transport'],
      category: 'Religious'
    }
  ];

  const allPackages = [...packages, ...umrahPackages];

  const handleExploreMore = (category: string) => {
    const map: Record<string, string> = {
      tours: 'tours',
      adventure: 'adventure',
      hotels: 'hotels',
      visa: 'visa',
      umrah: 'umrah',
      packages: 'packages',
    };
    window.dispatchEvent(
      new CustomEvent('navigateToPage', { detail: map[category] || 'packages' })
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Handcrafted Travel Packages
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover our carefully curated travel packages including spiritual journeys, adventure tours, 
            and luxury experiences designed to create unforgettable memories.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8 animate-bounce-gentle">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Travel Package Enquiry"
              message="Hi! I would like a custom travel package quote. Can you help?"
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email for custom package quotes
            </div>
          </div>
        </div>

        {/* Quick Navigation to Other Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 lg:mb-16 animate-slide-up delay-200">
          <button
            onClick={() => handleExploreMore('tours')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-200 hover:border-blue-300 animate-card-float"
            aria-label="Explore tours"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Tours</h3>
              <p className="text-xs text-gray-600">Guided experiences</p>
              <ArrowRight className="h-4 w-4 mx-auto mt-2 text-blue-600" />
            </div>
          </button>
          
          <button
            onClick={() => handleExploreMore('adventure')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-200 hover:border-blue-300 animate-card-float"
            style={{animationDelay: '0.1s'}}
            aria-label="Explore adventure tours"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏔️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Adventure</h3>
              <p className="text-xs text-gray-600">Thrilling experiences</p>
              <ArrowRight className="h-4 w-4 mx-auto mt-2 text-blue-600" />
            </div>
          </button>
          
          <button
            onClick={() => handleExploreMore('hotels')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-200 hover:border-blue-300 animate-card-float"
            style={{animationDelay: '0.2s'}}
            aria-label="Explore hotels"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏨</div>
              <h3 className="font-semibold text-gray-900 mb-1">Hotels</h3>
              <p className="text-xs text-gray-600">Luxury stays</p>
              <ArrowRight className="h-4 w-4 mx-auto mt-2 text-blue-600" />
            </div>
          </button>
          
          <button
            onClick={() => handleExploreMore('visa')}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-200 hover:border-blue-300 animate-card-float"
            style={{animationDelay: '0.3s'}}
            aria-label="Explore visa services"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 mb-1">Visa</h3>
              <p className="text-xs text-gray-600">Documentation</p>
              <ArrowRight className="h-4 w-4 mx-auto mt-2 text-blue-600" />
            </div>
          </button>
        </div>

        {/* Featured Umrah Packages Section */}
        <div className="mb-16">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              🕋 Umrah Packages - Makkah & Madina
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Perform your sacred pilgrimage with our comprehensive Umrah packages, 
              featuring premium accommodations and expert guidance in the holy cities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {umrahPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group border-2 border-green-100 animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <PackageImage
                    src={pkg.image}
                    alt={`${pkg.title} - ${pkg.location}`}
                    onOpen={() => openTripDetail(pkg)}
                  />
                  <div className="pointer-events-none absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="pointer-events-none absolute bottom-4 left-4 bg-green-600/90 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    🕋 Umrah Package
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{pkg.title}</h3>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{pkg.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">All Ages</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                        <span className="text-gray-600 text-sm ml-1">per person</span>
                      </div>
                      <ContactChoice
                        variant="green"
                        label="Book"
                        buttonClassName="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                        subject={`Umrah Package - ${pkg.title}`}
                        message={`Hi! I'm interested in the ${pkg.title}. Can you provide more details about this Umrah package?`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openTripDetail(pkg)}
                      className="w-full rounded-lg border border-green-200 text-green-700 hover:bg-green-50 py-2 text-sm font-semibold"
                    >
                      View Details · Enquire / Cart
                    </button>
                  </div>
                  
                  <div className="text-center pt-3 border-t border-gray-100 space-y-2">
                    <ContactLinksRow
                      subject={`Umrah Package - ${pkg.title}`}
                      message={`Hi! I need more information about ${pkg.title}. Can you help?`}
                    />
                    <CompareLinks
                      compact
                      title="Compare"
                      links={getTourCompareLinks(pkg.location || 'Makkah Madinah', pkg.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Umrah Special Features */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white animate-slide-up">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">🕋 Complete Umrah Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">✈️</div>
                  <p className="text-sm">Flight Booking</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏨</div>
                  <p className="text-sm">Hotel Booking</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm">Visa Processing</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚌</div>
                  <p className="text-sm">Transportation</p>
                </div>
              </div>
              <ContactChoice
                variant="green"
                buttonClassName="bg-white hover:bg-green-50 text-green-600"
                label="Get Complete Umrah Package"
                subject="Umrah Package Enquiry"
                message="Hi! I want to perform Umrah. Can you help me choose the best package and handle all arrangements?"
              />
            </div>
          </div>
        </div>

        {/* Regular Travel Packages */}
        <div className="mb-16">
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              🌍 International Travel Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the world with our premium international travel packages 
              designed for adventure, culture, and relaxation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative">
                  <PackageImage
                    src={pkg.image}
                    alt={`${pkg.title} - ${pkg.location}`}
                    heightClass="h-64"
                    onOpen={() => openTripDetail(pkg)}
                  />
                  <div className="pointer-events-none absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formatPrice(pkg.price)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">2-8 People</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                        <span className="text-gray-600 text-sm ml-1">per person</span>
                      </div>
                      <ContactChoice
                        variant="orange"
                        label="Book Now"
                        subject={`Travel Package - ${pkg.title}`}
                        message={`Hi! I'm interested in the ${pkg.title} package. Can you provide more details and help me book?`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openTripDetail(pkg)}
                      className="w-full rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 py-2.5 text-sm font-semibold"
                    >
                      View Details · Enquire / Cart
                    </button>
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-xs text-gray-500 mb-2">Need customization? Choose WhatsApp or Email</p>
                    <ContactLinksRow
                      subject={`Custom Quote - ${pkg.title}`}
                      message={`Hi! I'm interested in the ${pkg.title} package. Can you provide a custom quote?`}
                    />
                    <CompareLinks
                      compact
                      title="Compare on Google & partners"
                      links={getTourCompareLinks(pkg.location, pkg.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 lg:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Need a Custom Package?</h2>
            <p className="text-orange-100 mb-6">
              Contact us via WhatsApp or email for personalized travel packages tailored to your preferences and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ContactChoice
                variant="green"
                label="Contact Us"
                subject="Custom Travel Package Enquiry"
                message="Hi! I need a custom travel package. Can you help me plan my trip?"
              />
              <button 
                className="bg-white text-orange-600 px-6 lg:px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105"
                onClick={() => handleExploreMore('tours')}
                aria-label="View all packages"
              >
                View All Packages
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 max-w-4xl mx-auto space-y-8">
          <AiConsultant />
          <HolidayBuilder />
        </div>

        {/* BrightstarGo-style enquiry form on packages page */}
        <div id="packages-enquiry" className="mt-12 lg:mt-16 scroll-mt-32">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Send a Package Enquiry
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us the trip you want, dates, and travellers — we will reply on WhatsApp or Email.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <TripInquiryForm
              defaultTripName="Custom travel package"
              heading="You can send your enquiry via the form below"
            />
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

export default TravelPackages;