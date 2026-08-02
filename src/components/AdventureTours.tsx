import React from 'react';
import { Mountain, Waves, Compass, Camera, Clock, Users, Star, MapPin, MessageCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getTourCompareLinks } from '../constants/integrations';
import { CONTACT, getWhatsAppLink } from '../constants/contact';

const AdventureTours: React.FC = () => {
  const { formatPrice } = useCurrency();
  const whatsappNumber = CONTACT.phone;
  const whatsappLink = getWhatsAppLink();

  const adventureTours = [
    {
      id: 1,
      title: 'Himalayan Base Camp Trek',
      image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Nepal',
      duration: '14 Days',
      difficulty: 'Challenging',
      price: 2499,
      rating: 4.8,
      groupSize: '8-12',
      description: 'Epic trekking adventure to Everest Base Camp with experienced guides.',
      highlights: ['Everest Base Camp', 'Sherpa Culture', 'Mountain Views', 'Adventure'],
      icon: <Mountain className="h-6 w-6" />
    },
    {
      id: 2,
      title: 'Whitewater Rafting Costa Rica',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Costa Rica',
      duration: '7 Days',
      difficulty: 'Moderate',
      price: 1799,
      rating: 4.9,
      groupSize: '6-10',
      description: 'Thrilling whitewater rafting through pristine rainforest rivers.',
      highlights: ['Class III-IV Rapids', 'Rainforest', 'Wildlife', 'Adventure'],
      icon: <Waves className="h-6 w-6" />
    },
    {
      id: 3,
      title: 'Sahara Desert Expedition',
      image: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Morocco',
      duration: '10 Days',
      difficulty: 'Moderate',
      price: 2199,
      rating: 4.7,
      groupSize: '4-8',
      description: 'Desert adventure with camel trekking and stargazing in the Sahara.',
      highlights: ['Camel Trekking', 'Desert Camping', 'Stargazing', 'Berber Culture'],
      icon: <Compass className="h-6 w-6" />
    },
    {
      id: 4,
      title: 'Antarctic Photography Cruise',
      image: 'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Antarctica',
      duration: '12 Days',
      difficulty: 'Easy',
      price: 8999,
      rating: 5.0,
      groupSize: '15-20',
      description: 'Once-in-a-lifetime photography expedition to the White Continent.',
      highlights: ['Penguin Colonies', 'Icebergs', 'Photography', 'Wildlife'],
      icon: <Camera className="h-6 w-6" />
    },
    {
      id: 5,
      title: 'Amazon Rainforest Explorer',
      image: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Peru',
      duration: '9 Days',
      difficulty: 'Moderate',
      price: 2299,
      rating: 4.8,
      groupSize: '6-10',
      description: 'Deep jungle exploration with indigenous communities and wildlife.',
      highlights: ['Jungle Trekking', 'Wildlife Spotting', 'River Cruise', 'Culture'],
      icon: <Compass className="h-6 w-6" />
    },
    {
      id: 6,
      title: 'Northern Lights Adventure',
      image: 'https://images.pexels.com/photos/1933316/pexels-photo-1933316.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Iceland',
      duration: '8 Days',
      difficulty: 'Easy',
      price: 2799,
      rating: 4.9,
      groupSize: '8-12',
      description: 'Magical Northern Lights viewing with ice caves and glacier hiking.',
      highlights: ['Northern Lights', 'Ice Caves', 'Glacier Hiking', 'Hot Springs'],
      icon: <Mountain className="h-6 w-6" />
    }
  ];

  const honeymoonPackages = [
    {
      id: 1,
      title: 'Santorini Romantic Escape',
      image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Greece',
      duration: '7 Days',
      price: 3299,
      rating: 4.9,
      description: 'Romantic sunset views and luxury accommodations in Santorini.',
      highlights: ['Sunset Views', 'Private Villa', 'Wine Tasting', 'Couples Spa']
    },
    {
      id: 2,
      title: 'Bali Tropical Romance',
      image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Indonesia',
      duration: '10 Days',
      price: 2899,
      rating: 4.8,
      description: 'Tropical paradise with beachfront resorts and cultural experiences.',
      highlights: ['Beachfront Resort', 'Temple Tours', 'Couples Massage', 'Private Dinner']
    },
    {
      id: 3,
      title: 'Swiss Alps Romance',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Switzerland',
      duration: '8 Days',
      price: 4199,
      rating: 4.7,
      description: 'Mountain romance with luxury chalets and scenic train rides.',
      highlights: ['Mountain Chalet', 'Scenic Trains', 'Alpine Dining', 'Adventure']
    }
  ];

  const religiousTours = [
    {
      id: 1,
      title: 'Golden Temple & Spiritual India',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'India',
      duration: '12 Days',
      price: 1599,
      rating: 4.8,
      description: 'Spiritual journey through sacred temples and holy cities.',
      highlights: ['Golden Temple', 'Varanasi Ghats', 'Yoga & Meditation', 'Spiritual Guides']
    },
    {
      id: 2,
      title: 'Vatican & Rome Pilgrimage',
      image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Italy',
      duration: '8 Days',
      price: 2299,
      rating: 4.9,
      description: 'Religious pilgrimage to Vatican City and historic churches.',
      highlights: ['Vatican Museums', 'Sistine Chapel', 'St. Peters Basilica', 'Guided Tours']
    },
    {
      id: 3,
      title: 'Mecca & Medina Umrah',
      image: 'https://images.pexels.com/photos/12426818/pexels-photo-12426818.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Saudi Arabia',
      duration: '7 Days',
      price: 2799,
      rating: 4.7,
      description: 'Complete Umrah package with premium accommodations.',
      highlights: ['Umrah Rituals', 'Premium Hotels', 'Religious Guidance', 'Group Support']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'challenging':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Adventure, Honeymoon & Religious Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Whether you seek adrenaline-pumping adventures, romantic getaways, or spiritual journeys, 
            we have expertly crafted experiences for every soul.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Adventure & Special Tours Enquiry"
              message="Hi! I would like a quote for adventure, honeymoon, or religious tours. Can you help?"
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email for tour quotes
            </div>
          </div>
        </div>

        {/* Adventure Tours */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Adventure Tours</h3>
            <a
              href={`${whatsappLink}?text=Hi! I want to see all adventure tour options. Can you help?`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center space-x-1"
            >
              <span>View All Adventures</span>
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adventureTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>
                  </div>
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                    {tour.difficulty}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                    {tour.icon}
                    <span className="text-sm">Adventure</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h4>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{tour.groupSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(tour.price)}</span>
                      <span className="text-gray-600 text-sm ml-1">per person</span>
                    </div>
                    <ContactChoice
                      variant="orange"
                      label="Book Now"
                      subject={`Adventure Tour - ${tour.title}`}
                      message={`Hi! I'm interested in the ${tour.title} adventure tour. Can you provide more details?`}
                    />
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-100 space-y-2">
                    <ContactLinksRow
                      subject={`Adventure Tour - ${tour.title}`}
                      message={`Hi! I'm interested in the ${tour.title} adventure tour. Can you provide more details?`}
                    />
                    <CompareLinks
                      compact
                      links={getTourCompareLinks(tour.location, tour.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honeymoon Packages */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Honeymoon Packages</h3>
            <a
              href={`${whatsappLink}?text=Hi! I want to see all honeymoon package options. Can you help?`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center space-x-1"
            >
              <span>View All Honeymoon Packages</span>
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {honeymoonPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-pink-500/80 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                    <span className="text-sm">♥ Romance</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h4>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.map((highlight, index) => (
                      <span key={index} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                      <span className="text-gray-600 text-sm ml-1">for couple</span>
                    </div>
                    <ContactChoice
                      variant="pink"
                      label="Book Now"
                      subject={`Honeymoon Package - ${pkg.title}`}
                      message={`Hi! I'm interested in the ${pkg.title} honeymoon package. Can you provide more details?`}
                    />
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-100 space-y-2">
                    <ContactLinksRow
                      subject={`Honeymoon Package - ${pkg.title}`}
                      message={`Hi! I'm interested in the ${pkg.title} honeymoon package. Can you provide more details?`}
                    />
                    <CompareLinks
                      compact
                      links={getTourCompareLinks(pkg.location, pkg.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Religious Tours */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Religious Tours</h3>
            <a
              href={`${whatsappLink}?text=Hi! I want to see all religious tour options. Can you help?`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center space-x-1"
            >
              <span>View All Religious Tours</span>
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {religiousTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-purple-500/80 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                    <span className="text-sm">🕊️ Spiritual</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h4>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.map((highlight, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(tour.price)}</span>
                      <span className="text-gray-600 text-sm ml-1">per person</span>
                    </div>
                    <ContactChoice
                      variant="purple"
                      label="Book Now"
                      subject={`Religious Tour - ${tour.title}`}
                      message={`Hi! I'm interested in the ${tour.title} religious tour. Can you provide more details?`}
                    />
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-100 space-y-2">
                    <ContactLinksRow
                      subject={`Religious Tour - ${tour.title}`}
                      message={`Hi! I'm interested in the ${tour.title} religious tour. Can you provide more details?`}
                    />
                    <CompareLinks
                      compact
                      links={getTourCompareLinks(tour.location, tour.title)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventureTours;