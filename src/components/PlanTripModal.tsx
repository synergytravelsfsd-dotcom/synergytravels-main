import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, Plane, Hotel, Car, Camera, MessageCircle, Mail } from 'lucide-react';
import { getWhatsAppLink, getEmailLink } from '../constants/contact';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanTripModal: React.FC<PlanTripModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [showContactChoice, setShowContactChoice] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '2',
    budget: '',
    travelType: '',
    tripPattern: 'roundtrip',
    multiCityStops: '',
    interests: [] as string[],
    accommodation: '',
    transportation: '',
    specialRequests: ''
  });

  const travelTypes = [
    { id: 'leisure', label: 'Leisure/Vacation', icon: <Camera className="h-5 w-5" /> },
    { id: 'business', label: 'Business Travel', icon: <Plane className="h-5 w-5" /> },
    { id: 'adventure', label: 'Adventure', icon: <MapPin className="h-5 w-5" /> },
    { id: 'honeymoon', label: 'Honeymoon', icon: <Hotel className="h-5 w-5" /> }
  ];

  const interests = [
    'Cultural Sites', 'Adventure Sports', 'Beach & Relaxation', 'Food & Cuisine',
    'Shopping', 'Nightlife', 'Nature & Wildlife', 'Photography',
    'Historical Sites', 'Museums', 'Local Experiences', 'Wellness & Spa'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter(i => i !== interest)
        : [...formData.interests, interest]
    });
  };

  const tripPatternLabel =
    formData.tripPattern === 'multicity'
      ? 'Multi-city'
      : formData.tripPattern === 'oneway'
        ? 'One Way'
        : 'Round Trip';

  const buildTripMessage = () => {
    return [
      'Hi! I would like to plan a trip with the following details:',
      `Destination: ${formData.destination || 'Not specified'}`,
      `Trip pattern: ${tripPatternLabel}`,
      formData.tripPattern === 'multicity' && formData.multiCityStops
        ? `Multi-city stops: ${formData.multiCityStops}`
        : null,
      `Dates: ${formData.startDate || 'N/A'} to ${formData.endDate || 'N/A'}`,
      `Travelers: ${formData.travelers}`,
      `Budget: ${formData.budget || 'Not specified'}`,
      `Travel Type: ${formData.travelType || 'Not specified'}`,
      `Interests: ${formData.interests.length ? formData.interests.join(', ') : 'Not specified'}`,
      `Accommodation: ${formData.accommodation || 'Not specified'}`,
      `Transportation: ${formData.transportation || 'Not specified'}`,
      `Special Requests: ${formData.specialRequests || 'None'}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactChoice(true);
  };

  const handleSendVia = (channel: 'whatsapp' | 'email') => {
    const message = buildTripMessage();
    const subject = 'Trip Planning Request - Synergy Travels & Tour';
    const url = channel === 'whatsapp' ? getWhatsAppLink(message) : getEmailLink(subject, message);
    window.open(url, channel === 'whatsapp' ? '_blank' : '_self');
    setShowContactChoice(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Plan Your Perfect Trip</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? 'bg-orange-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Basic Info</span>
              <span>Preferences</span>
              <span>Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="destination"
                      placeholder="Where would you like to go?"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5+">5+ Travelers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flight Pattern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'roundtrip', label: 'Round Trip' },
                    { id: 'oneway', label: 'One Way' },
                    { id: 'multicity', label: 'Multi-city' },
                  ].map((pattern) => (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, tripPattern: pattern.id })}
                      className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.tripPattern === pattern.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {pattern.label}
                    </button>
                  ))}
                </div>
                {formData.tripPattern === 'multicity' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cities / stops (in order)
                    </label>
                    <input
                      type="text"
                      name="multiCityStops"
                      placeholder="e.g. London → Dubai → Bangkok → Singapore → London"
                      value={formData.multiCityStops}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range (USD)
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your budget</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="over-10000">Over $10,000</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Travel Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Type of Travel
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {travelTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelType: type.id })}
                      className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                        formData.travelType === type.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 text-sm border rounded-lg transition-colors ${
                        formData.interests.includes(interest)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Preference
                  </label>
                  <select
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select preference</option>
                    <option value="budget">Budget Hotels</option>
                    <option value="mid-range">Mid-range Hotels</option>
                    <option value="luxury">Luxury Hotels</option>
                    <option value="boutique">Boutique Hotels</option>
                    <option value="resort">Resorts</option>
                    <option value="apartment">Apartments/Vacation Rentals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transportation Preference
                  </label>
                  <select
                    name="transportation"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select preference</option>
                    <option value="economy">Economy Class</option>
                    <option value="premium-economy">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                    <option value="mixed">Mixed (depending on route)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Requirements
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special dietary requirements, accessibility needs, celebration occasions, or other requests..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Submit Trip Request
              </button>
            )}
          </div>
        </form>

        {showContactChoice && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Send your request via</h3>
              <p className="text-sm text-gray-600 mb-4">Choose WhatsApp or Email to contact our travel experts.</p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSendVia('whatsapp')}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendVia('email')}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactChoice(false)}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTripModal;