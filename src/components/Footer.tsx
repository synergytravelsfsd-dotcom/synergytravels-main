import React from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { CONTACT, getWhatsAppLink } from '../constants/contact';
import { resolveNavigateTarget } from '../constants/pages';
import logoImg from '../assets/synergy-travels-tour-logo-light.png';

interface FooterProps {
  onLogoClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLogoClick }) => {
  const whatsappNumber = CONTACT.phone;
  const whatsappLink = getWhatsAppLink();
  const phoneLink = `tel:${whatsappNumber.replace(/\s/g, '')}`;

  const quickLinks = [
    { name: 'About Us', pageId: 'home' },
    { name: 'Compare Prices', pageId: 'compare' },
    { name: 'Travel Packages', pageId: 'packages' },
    { name: 'Umrah', pageId: 'umrah' },
    { name: 'Flight Booking', pageId: 'home' },
    { name: 'Hotel Reservations', pageId: 'hotels' },
    { name: 'Visa Services', pageId: 'visa' },
    { name: 'Corporate Travel', pageId: 'corporate' },
    { name: 'Travel Insurance', pageId: 'insurance' },
    { name: 'Contact Us', pageId: 'home' },
  ];

  const destinations = [
    { name: 'Europe Tours', pageId: 'tours' },
    { name: 'Asia Adventures', pageId: 'adventure' },
    { name: 'America Expeditions', pageId: 'tours' },
    { name: 'Africa Safaris', pageId: 'adventure' },
    { name: 'Australia Tours', pageId: 'tours' },
    { name: 'Middle East', pageId: 'tours' },
    { name: 'Umrah & Hajj', pageId: 'umrah' },
    { name: 'Honeymoon Packages', pageId: 'adventure' },
  ];

  const services = [
    { name: 'Flight Booking', pageId: 'home' },
    { name: 'Hotel Booking', pageId: 'hotels' },
    { name: 'Car Rentals', pageId: 'cars' },
    { name: 'Activities', pageId: 'activities' },
    { name: 'Cruises', pageId: 'cruises' },
    { name: 'Travel Insurance', pageId: 'insurance' },
    { name: 'Visa Assistance', pageId: 'visa' },
    { name: 'Hajj', pageId: 'hajj' },
    { name: 'Group Tours', pageId: 'tours' },
    { name: 'Corporate Travel', pageId: 'corporate' },
    { name: 'Adventure Tours', pageId: 'adventure' },
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      // Dispatch custom event to navigate to home page
      window.dispatchEvent(new CustomEvent('navigateToPage', { detail: 'home' }));
    }
  };

  const handleLinkClick = (pageId: string) => {
    window.dispatchEvent(
      new CustomEvent('navigateToPage', { detail: resolveNavigateTarget(pageId) })
    );
  };

  const handleServiceClick = (service: { name: string; pageId?: string; whatsappText?: string }) => {
    if (service.whatsappText) {
      window.open(`${whatsappLink}?text=${encodeURIComponent(service.whatsappText)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    if (service.pageId) {
      handleLinkClick(service.pageId);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 safe-pb">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info with Logo - Made Bigger */}
          <div className="space-y-4">
            <button 
              onClick={handleLogoClick}
              className="hover:opacity-90 transition-opacity focus:outline-none rounded-lg py-1"
              aria-label="Go to home page"
            >
              <img
                src={logoImg}
                alt="Synergy Travels & Tour"
                className="h-14 w-auto max-w-[210px] sm:h-[4.5rem] sm:max-w-[280px] md:h-20 md:max-w-[320px] lg:h-[5.5rem] lg:max-w-[380px] object-contain object-left hover:scale-[1.03] transition-transform"
              />
            </button>
            <p className="text-gray-300 leading-relaxed">
              Your trusted travel partner for over 15 years. We create unforgettable journeys 
              and provide comprehensive travel solutions for every adventure.
            </p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <a
                  href="https://maps.google.com/?q=Watford,+Hertfordshire,+UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                  aria-label="Open location in Google Maps"
                >
                  Watford, Hertfordshire, UK
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <a href={phoneLink} className="text-sm hover:text-white transition-colors" aria-label="Call us">
                  {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${CONTACT.email}`} className="text-sm hover:text-white transition-colors" aria-label="Email us">
                  {CONTACT.email}
                </a>
              </div>
              
              {/* WhatsApp Contact */}
              <div className="pt-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg w-fit"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp: {whatsappNumber}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleLinkClick(link.pageId)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* WhatsApp for Quick Links */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <a
                href={`${whatsappLink}?text=Hi! I need help with travel services. Can you assist me?`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center space-x-1"
                aria-label="Get quick help via WhatsApp"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Quick Help via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Destinations</h4>
            <ul className="space-y-2">
              {destinations.map((destination, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleLinkClick(destination.pageId)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                    aria-label={`Explore ${destination.name}`}
                  >
                    {destination.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleServiceClick(service)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                    aria-label={`Learn about ${service.name}`}
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 Synergy Travels & Tour. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 mt-2 justify-center sm:justify-end">
              <div className="flex items-center justify-center sm:justify-end space-x-1 text-gray-400">
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">WhatsApp: {whatsappNumber}</span>
              </div>
              <div className="flex space-x-4 justify-center sm:justify-end">
                <a
                  href={`${whatsappLink}?text=${encodeURIComponent('Hi! I would like to know more about your Privacy Policy.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xs"
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </a>
                <a
                  href={`${whatsappLink}?text=${encodeURIComponent('Hi! I would like to know more about your Terms of Service.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xs"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </a>
                <a
                  href={`${whatsappLink}?text=${encodeURIComponent('Hi! I would like to know more about your Cookie Policy.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-xs"
                  aria-label="Cookie Policy"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};