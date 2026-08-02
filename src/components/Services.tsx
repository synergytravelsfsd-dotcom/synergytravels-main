import React from 'react';
import { 
  Plane, 
  MapPin, 
  FileText, 
  Hotel, 
  Mountain, 
  Heart, 
  Building, 
  Users
} from 'lucide-react';
import ContactChoice from './ContactChoice';
import { resolveNavigateTarget } from '../constants/pages';

const Services: React.FC = () => {

  const services = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: 'Flight Booking',
      description: 'Live flight search with real-time pricing from 500+ airlines worldwide.',
      color: 'from-blue-500 to-cyan-500',
      features: ['Real-time pricing', 'Global coverage', 'Best price guarantee'],
      pageId: 'home' // Links to flight search on home page
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Travel Packages',
      description: 'Curated travel experiences tailored to your preferences and budget.',
      color: 'from-green-500 to-emerald-500',
      features: ['Custom itineraries', 'Local experiences', 'Expert guides'],
      pageId: 'packages'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Visa Services',
      description: 'Complete visa assistance with fast-track processing and documentation.',
      color: 'from-purple-500 to-violet-500',
      features: ['Fast processing', 'Document support', 'Success guarantee'],
      pageId: 'visa'
    },
    {
      icon: <Hotel className="h-8 w-8" />,
      title: 'Hotel Reservations',
      description: 'Premium accommodations and reliable transportation worldwide.',
      color: 'from-orange-500 to-red-500',
      features: ['Luxury hotels', 'Best rates', 'Instant confirmation'],
      pageId: 'hotels'
    },
    {
      icon: <Mountain className="h-8 w-8" />,
      title: 'Adventure Tours',
      description: 'Thrilling adventures for the bold with professional safety standards.',
      color: 'from-red-500 to-pink-500',
      features: ['Safety certified', 'Expert guides', 'All skill levels'],
      pageId: 'adventure'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Honeymoon Packages',
      description: 'Romantic getaways designed for unforgettable moments together.',
      color: 'from-pink-500 to-rose-500',
      features: ['Romantic settings', 'Special amenities', 'Privacy assured'],
      pageId: 'adventure' // Honeymoon packages are in adventure tours
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: 'Corporate Travel',
      description: 'Professional travel solutions optimized for business efficiency.',
      color: 'from-indigo-500 to-blue-500',
      features: ['Cost optimization', '24/7 support', 'Policy compliance'],
      pageId: 'corporate'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Group Tours',
      description: 'Organized group experiences for families, friends, and organizations.',
      color: 'from-cyan-500 to-teal-500',
      features: ['Group discounts', 'Dedicated coordinator', 'Flexible planning'],
      pageId: 'tours'
    }
  ];

  const handleServiceClick = (pageId: string) => {
    window.dispatchEvent(
      new CustomEvent('navigateToPage', { detail: resolveNavigateTarget(pageId) })
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            🌟 Premium Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Travel Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            From flight bookings to complete travel packages, we provide end-to-end solutions 
            with personalized service and competitive prices.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Travel Services Enquiry"
              message="Hi! I would like to enquire about your travel services."
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email · Get instant quotes and 24/7 support
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-blue-200 cursor-pointer"
              onClick={() => handleServiceClick(service.pageId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleServiceClick(service.pageId);
                }
              }}
              aria-label={`Navigate to ${service.title} page`}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {service.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center">
                <span>Explore {service.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust us with their adventures. 
              Let's create your perfect travel experience together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ContactChoice
                variant="green"
                label="Contact Us"
                subject="Travel Services Enquiry"
                message="Hi! I would like to enquire about your travel services."
              />
              <button 
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                onClick={() => handleServiceClick('packages')}
                aria-label="Get started with travel packages"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Services;