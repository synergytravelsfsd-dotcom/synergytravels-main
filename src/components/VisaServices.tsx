import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, MapPin, AlertCircle, Calendar, Phone } from 'lucide-react';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getVisaCompareLinks } from '../constants/integrations';

const VisaServices: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  const visaServices = [
    {
      country: 'United States',
      flag: '🇺🇸',
      visaType: 'Tourist Visa (B1/B2)',
      processingTime: '10-15 days',
      requirements: ['Valid Passport', 'Filled DS-160 Form', 'Passport Photos', 'Interview Appointment'],
      description: 'Complete assistance for US tourist visa application including form filling and interview preparation.'
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      visaType: 'Standard Visitor Visa',
      processingTime: '15-20 days',
      requirements: ['Valid Passport', 'Application Form', 'Financial Documents', 'Travel Itinerary'],
      description: 'Full support for UK visitor visa with document verification and application tracking.'
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      visaType: 'Visitor Visa (TRV)',
      processingTime: '20-25 days',
      requirements: ['Valid Passport', 'Application Form', 'Photos', 'Proof of Funds'],
      description: 'Comprehensive Canada visitor visa assistance with fast-track processing options.'
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      visaType: 'Visitor Visa (600)',
      processingTime: '12-18 days',
      requirements: ['Valid Passport', 'Online Application', 'Health Insurance', 'Character Documents'],
      description: 'Expert guidance for Australia visitor visa with health examination coordination.'
    },
    {
      country: 'Germany',
      flag: '🇩🇪',
      visaType: 'Schengen Visa',
      processingTime: '10-15 days',
      requirements: ['Valid Passport', 'Application Form', 'Travel Insurance', 'Hotel Bookings'],
      description: 'Schengen visa services covering 26 European countries with single application.'
    },
    {
      country: 'Japan',
      flag: '🇯🇵',
      visaType: 'Tourist Visa',
      processingTime: '5-7 days',
      requirements: ['Valid Passport', 'Application Form', 'Itinerary', 'Financial Proof'],
      description: 'Fast Japan tourist visa processing with cultural orientation support.'
    }
  ];

  // New Visa Services with Consultation
  const specialVisaServices = [
    {
      country: 'Saudi Arabia (Makkah)',
      flag: '🇸🇦',
      visaType: 'Umrah Visa',
      processingTime: '3-5 days',
      requirements: ['Valid Passport', 'Umrah Package Booking', 'Vaccination Certificate', 'Photos'],
      description: 'Complete Umrah visa processing with religious guidance and Makkah accommodation assistance.',
      consultation: true,
      specialNote: 'Includes religious consultation and Makkah travel guidance'
    },
    {
      country: 'UAE (Dubai)',
      flag: '🇦🇪',
      visaType: 'Tourist/Business Visa',
      processingTime: '2-4 days',
      requirements: ['Valid Passport', 'Application Form', 'Hotel Booking', 'Return Ticket'],
      description: 'Fast Dubai visa processing with business and tourism consultation services.',
      consultation: true,
      specialNote: 'Business setup consultation and Dubai investment guidance available'
    },
    {
      country: 'Azerbaijan (Baku)',
      flag: '🇦🇿',
      visaType: 'Tourist/Business Visa',
      processingTime: '5-7 days',
      requirements: ['Valid Passport', 'Application Form', 'Invitation Letter', 'Travel Insurance'],
      description: 'Azerbaijan visa services with business consultation and cultural guidance.',
      consultation: true,
      specialNote: 'Business opportunities consultation and cultural orientation included'
    },
    {
      country: 'Thailand',
      flag: '🇹🇭',
      visaType: 'Tourist Visa',
      processingTime: '3-5 days',
      requirements: ['Valid Passport', 'Application Form', 'Photos', 'Financial Proof'],
      description: 'Thailand visa processing with travel consultation and cultural guidance.',
      consultation: true,
      specialNote: 'Travel planning consultation and cultural tips included'
    },
    {
      country: 'Malaysia',
      flag: '🇲🇾',
      visaType: 'Tourist/Business Visa',
      processingTime: '3-5 days',
      requirements: ['Valid Passport', 'Application Form', 'Return Ticket', 'Hotel Booking'],
      description: 'Malaysia visa services with business and tourism consultation.',
      consultation: true,
      specialNote: 'Business opportunities and tourism planning consultation available'
    }
  ];

  const documentServices = [
    {
      title: 'Passport Services',
      description: 'New passport application, renewal, and emergency passport assistance with complete documentation support.',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      features: ['New Passport Application', 'Passport Renewal', 'Emergency Passport', 'Document Verification']
    },
    {
      title: 'Document Attestation',
      description: 'Educational, personal, and commercial document attestation services for international use.',
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      features: ['Educational Certificates', 'Personal Documents', 'Commercial Papers', 'Embassy Attestation']
    },
    {
      title: 'Travel Insurance',
      description: 'Comprehensive travel insurance coverage for all destinations with medical and trip protection.',
      icon: <AlertCircle className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      features: ['Medical Coverage', 'Trip Cancellation', 'Baggage Protection', 'Emergency Assistance']
    },
    {
      title: 'Invitation Letters',
      description: 'Business and tourist invitation letters for visa applications with proper documentation.',
      icon: <Calendar className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      features: ['Business Invitations', 'Tourist Invitations', 'Conference Letters', 'Family Visit Letters']
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Visa & Documentation Services
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Hassle-free visa processing and complete documentation assistance for all your travel needs. 
            Our expert team ensures smooth and fast processing with guaranteed success rates.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Visa Services Enquiry"
              message="Hi! I need help with visa services and documentation. Can you assist?"
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email for visa consultation
            </div>
          </div>
        </div>

        {/* Special Visa Services with Consultation */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              🌟 Special Visa Services with Expert Consultation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium visa services with personalized consultation for Makkah, Dubai, Baku, Thailand, and Malaysia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {specialVisaServices.map((visa, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-blue-100">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl" role="img" aria-label={`${visa.country} flag`}>{visa.flag}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{visa.country}</h3>
                    <p className="text-sm text-gray-600">{visa.visaType}</p>
                  </div>
                  {visa.consultation && (
                    <div className="ml-auto">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        + Consultation
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{visa.description}</p>
                
                {visa.specialNote && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                    <p className="text-blue-700 text-sm font-medium">
                      💡 {visa.specialNote}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{visa.processingTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Expert Consultation</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {visa.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <ContactChoice
                    fullWidth
                    variant="primary"
                    label="Apply with Consultation"
                    subject={`Visa Consultation - ${visa.country} ${visa.visaType}`}
                    message={`Hi! I need ${visa.country} ${visa.visaType} with consultation. Can you assist me?`}
                  />
                  
                  <div className="text-center space-y-2">
                    <ContactLinksRow
                      subject={`Visa Consultation - ${visa.country}`}
                      message={`Hi! I need ${visa.country} ${visa.visaType} with consultation. Can you assist me?`}
                    />
                    <CompareLinks compact links={getVisaCompareLinks(visa.country)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Consultation Services Highlight */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">🎯 Expert Consultation Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm">Phone Consultation</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <p className="text-sm">Business Guidance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <p className="text-sm">Travel Planning</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm">Document Review</p>
                </div>
              </div>
              <ContactChoice
                variant="primary"
                buttonClassName="bg-white hover:bg-blue-50 text-blue-600"
                label="Get Expert Consultation"
                subject="Expert Visa Consultation"
                message="Hi! I need expert consultation for visa and travel planning. Can you help?"
              />
            </div>
          </div>
        </div>

        {/* Regular Visa Services */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Standard Visa Processing Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visaServices.map((visa, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl" role="img" aria-label={`${visa.country} flag`}>{visa.flag}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{visa.country}</h3>
                    <p className="text-sm text-gray-600">{visa.visaType}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{visa.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{visa.processingTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Expert Assistance</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {visa.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <ContactChoice
                    fullWidth
                    variant="orange"
                    label="Apply Now"
                    subject={`Visa Application - ${visa.country} ${visa.visaType}`}
                    message={`Hi! I need help with ${visa.country} ${visa.visaType}. Can you assist me?`}
                  />
                  
                  <div className="text-center space-y-2">
                    <ContactLinksRow
                      subject={`Visa Application - ${visa.country}`}
                      message={`Hi! I need help with ${visa.country} ${visa.visaType}. Can you assist me?`}
                    />
                    <CompareLinks compact links={getVisaCompareLinks(visa.country)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Services */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Additional Document Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Services Include:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <ContactChoice
                    fullWidth
                    variant="orange"
                    label="Get Quote"
                    buttonClassName="bg-orange-600 hover:bg-orange-700 text-white text-sm"
                    subject={`Document Service - ${service.title}`}
                    message={`Hi! I need help with ${service.title}. Can you provide more details?`}
                  />
                  
                  <div className="text-center pt-3 border-t border-gray-100 space-y-2">
                    <ContactLinksRow
                      subject={`Document Service - ${service.title}`}
                      message={`Hi! I need help with ${service.title}. Can you provide more details?`}
                    />
                    <CompareLinks compact links={getVisaCompareLinks(service.title)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Checker Tool */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-12 lg:mb-16">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Visa Requirement Checker</h2>
            <p className="text-gray-600">
              Check visa requirements for your destination country and get instant information
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="destination-country" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <select
                  id="destination-country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  aria-label="Select destination country"
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="SA">Saudi Arabia (Makkah)</option>
                  <option value="AE">UAE (Dubai)</option>
                  <option value="AZ">Azerbaijan (Baku)</option>
                  <option value="TH">Thailand</option>
                  <option value="MY">Malaysia</option>
                </select>
              </div>
              
              <ContactChoice
                fullWidth
                variant="orange"
                label="Check Requirements"
                subject="Visa Requirement Check"
                message={`Hi! I want to check visa requirements for ${selectedCountry || 'my destination'}. Can you help?`}
              />
              {selectedCountry && (
                <div className="mt-4">
                  <CompareLinks
                    title="Official & reference sites"
                    links={getVisaCompareLinks(
                      {
                        US: 'United States',
                        UK: 'United Kingdom',
                        CA: 'Canada',
                        AU: 'Australia',
                        DE: 'Germany',
                        JP: 'Japan',
                        SA: 'Saudi Arabia',
                        AE: 'UAE',
                        AZ: 'Azerbaijan',
                        TH: 'Thailand',
                        MY: 'Malaysia',
                      }[selectedCountry] || selectedCountry
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 lg:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Need Help with Your Visa Application?</h2>
            <p className="text-orange-100 mb-6">
              Our visa experts are here to help you navigate the application process. 
              Get personalized assistance and ensure your application is successful.
            </p>
            <div className="flex justify-center">
              <ContactChoice
                variant="green"
                label="Schedule Consultation"
                subject="Visa Application Consultation"
                message="Hi! I need help with my visa application. Can you provide consultation?"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaServices;