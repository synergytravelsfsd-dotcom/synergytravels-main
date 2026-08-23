import React from 'react';
import { Building, Users, Plane, Calendar, Clock, CheckCircle, Award, Shield } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import ContactChoice, { ContactLinksRow } from './ContactChoice';
import CompareLinks from './CompareLinks';
import { getCorporateCompareLinks } from '../constants/integrations';

const CorporateTravel: React.FC = () => {
  const { formatPrice } = useCurrency();

  const corporateServices = [
    {
      title: 'Business Travel Management',
      description: 'Comprehensive travel management for corporate executives and teams.',
      icon: <Building className="h-8 w-8" />,
      features: ['24/7 Support', 'Expense Management', 'Policy Compliance', 'Reporting'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Group Travel Solutions',
      description: 'Organized group travel for conferences, meetings, and corporate events.',
      icon: <Users className="h-8 w-8" />,
      features: ['Group Bookings', 'Dedicated Coordinator', 'Special Rates', 'Logistics Support'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Event & Conference Travel',
      description: 'Specialized travel arrangements for corporate events and conferences.',
      icon: <Calendar className="h-8 w-8" />,
      features: ['Venue Coordination', 'Accommodation Blocks', 'Transport Logistics', 'On-site Support'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Emergency Travel Services',
      description: 'Rapid response for urgent business travel needs and emergencies.',
      icon: <Clock className="h-8 w-8" />,
      features: ['24/7 Emergency Line', 'Last-minute Bookings', 'Travel Alerts', 'Crisis Management'],
      color: 'from-red-500 to-red-600'
    }
  ];

  const benefits = [
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Cost Optimization',
      description: 'Reduce travel costs by up to 30% with our corporate rates and smart booking strategies.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Risk Management',
      description: 'Comprehensive travel risk assessment and mitigation strategies for safe business travel.'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Policy Compliance',
      description: 'Automated policy enforcement and approval workflows to ensure compliance.'
    },
    {
      icon: <Plane className="h-6 w-6" />,
      title: 'Global Reach',
      description: 'Worldwide coverage with local expertise and 24/7 support in every time zone.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Travel Manager, TechCorp',
      company: 'Fortune 500 Technology Company',
      quote: 'Synergy Travels & Tour has transformed our corporate travel program. The cost savings and efficiency gains have been remarkable.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Chen',
      position: 'CFO, Global Consulting',
      company: 'International Consulting Firm',
      quote: 'Their attention to detail and proactive approach to travel management has made our business travel seamless.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Emily Rodriguez',
      position: 'HR Director, Manufacturing Inc',
      company: 'Global Manufacturing Company',
      quote: 'The dedicated support and emergency services have been invaluable during critical business situations.',
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Corporate Travel Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Streamline your business travel with our comprehensive corporate travel management services. 
            From individual bookings to large-scale events, we've got your business covered.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-3 mb-8 animate-bounce-gentle">
            <ContactChoice
              variant="green"
              label="Contact Us"
              subject="Corporate Travel Enquiry"
              message="Hi! I need a custom quote for corporate travel services. Can you help?"
            />
            <div className="text-gray-600 text-sm">
              Choose WhatsApp or Email for corporate travel solutions
            </div>
            <CompareLinks
              className="mt-3"
              title="Explore corporate partners"
              links={getCorporateCompareLinks()}
            />
          </div>
        </div>

        {/* Corporate Services */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-slide-up">Our Corporate Services</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {corporateServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}>
                  {service.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-center pt-4 border-t border-gray-100">
                  <ContactLinksRow
                    subject={`Corporate Travel - ${service.title}`}
                    message={`Hi! I'm interested in ${service.title}. Can you provide more details?`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-slide-up">Why Choose Our Corporate Travel Services</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-slide-up">What Our Corporate Clients Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg animate-card-float"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                
                <div className="text-center pt-4 border-t border-gray-100">
                  <ContactLinksRow
                    subject="Corporate Travel Enquiry"
                    message="Hi! I need a custom quote for corporate travel services. Can you help?"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Corporate Travel?</h3>
            <p className="text-orange-100 mb-6">
              Join over 500+ companies that trust Synergy Travels & Tour for their business travel needs. 
              Get a custom quote and see how we can optimize your travel program.
            </p>
            <div className="flex flex-col items-center gap-4">
              <ContactChoice
                variant="green"
                label="Get Custom Quote"
                subject="Corporate Travel / B2B Account"
                message="Hi! I'd like a corporate / B2B travel account with credit terms and an agent portal. Can you set us up?"
              />
              <p className="text-orange-100 text-sm max-w-lg">
                After onboarding, your team gets a private agent portal for travel requests, approvals, and credit.
              </p>
              <CompareLinks
                title="Relevant corporate travel sites"
                links={getCorporateCompareLinks()}
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
      `}</style>
    </section>
  );
};

export default CorporateTravel;