import React, { useState } from 'react';
import { MapPin, Calendar, Users, Star, MessageCircle, Plane, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT, getWhatsAppLink, getEmailLink } from '../constants/contact';
import PlanTripModal from './PlanTripModal';

interface HeroProps {
  onExplorePackages: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplorePackages }) => {
  const { t, isRTL } = useLanguage();
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const whatsappNumber = CONTACT.phone;
  const whatsappLink = getWhatsAppLink('Hi! I would like to enquire about your travel services.');
  const emailLink = getEmailLink(
    'Travel Enquiry - Synergy Travels & Tour',
    'Hi! I would like to enquire about your travel services.'
  );

  return (
    <div className={`relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-28 sm:pt-32 overflow-hidden min-h-screen flex items-center ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        
        {/* Flying Planes */}
        <div className="absolute top-1/4 left-0 animate-plane-fly">
          <Plane className="h-8 w-8 text-cyan-400/60 transform rotate-45" />
        </div>
        <div className="absolute top-1/3 right-0 animate-plane-fly-reverse delay-3000">
          <Plane className="h-6 w-6 text-pink-400/60 transform -rotate-45 scale-x-[-1]" />
        </div>
        <div className="absolute bottom-1/3 left-0 animate-plane-fly-diagonal delay-6000">
          <Plane className="h-7 w-7 text-purple-400/60 transform rotate-12" />
        </div>
        <div className="absolute top-2/3 right-0 animate-plane-fly-curve delay-9000">
          <Plane className="h-5 w-5 text-indigo-400/60 transform rotate-90" />
        </div>
        
        {/* More Floating Elements */}
        <div className="absolute top-32 right-20 w-4 h-4 bg-cyan-400/40 rounded-full animate-bounce-slow delay-300"></div>
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-pink-400/40 rounded-full animate-bounce-slow delay-700"></div>
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce-slow delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-indigo-400/40 rounded-full animate-bounce-slow delay-1300"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-cyan-300/50 rounded-full animate-float-slow delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-pink-300/50 rounded-full animate-float-slow delay-800"></div>
        
        {/* Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-slide-right"></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-slide-left delay-1000"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-slide-right delay-2000"></div>
        </div>
      </div>
      
      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-shift"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className={`text-center ${isRTL ? 'rtl' : 'ltr'}`}>
          {/* Main Heading - Better Aligned */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-title-reveal">
            <span className="block">{t('hero.title1')}</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
              {t('hero.title2')}
            </span>
          </h1>
          
          {/* Multilingual Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-up delay-300 font-light">
            {t('hero.subtitle')}
          </p>
          
          {/* Action Buttons - Better Spacing */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-buttons-slide delay-500 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button 
              onClick={onExplorePackages}
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl animate-button-glow"
            >
              <span className={`relative z-10 flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Plane className="h-6 w-6 animate-plane-tilt" />
                <span>{t('hero.exploreBtn')}</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
            </button>

            <button
              type="button"
              onClick={() => setIsPlanTripOpen(true)}
              className={`flex items-center space-x-3 bg-white text-indigo-900 px-8 py-5 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-all transform hover:scale-110 shadow-2xl ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Calendar className="h-6 w-6" />
              <span>Plan Trip</span>
            </button>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-110 shadow-2xl hover:shadow-3xl animate-glow-pulse ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <MessageCircle className="h-6 w-6 animate-bounce-gentle" />
              <span>{t('hero.whatsapp')}: {whatsappNumber}</span>
            </a>
            <a
              href={emailLink}
              className={`flex items-center space-x-3 bg-white/15 backdrop-blur-md border border-white/30 text-white px-8 py-5 rounded-2xl font-semibold text-lg hover:bg-white/25 transition-all transform hover:scale-110 shadow-2xl ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Mail className="h-6 w-6" />
              <span>Email Us</span>
            </a>
          </div>

          <PlanTripModal isOpen={isPlanTripOpen} onClose={() => setIsPlanTripOpen(false)} />

          {/* Enhanced Stats with Better Alignment */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="group animate-card-float" style={{animationDelay: '0s'}}>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-110 hover:rotate-2 animate-card-glow">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-2xl inline-block mb-6 animate-icon-spin">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 animate-number-count">150+</div>
                <div className="text-slate-300 text-lg">{t('hero.stats.destinations')}</div>
              </div>
            </div>
            
            <div className="group animate-card-float" style={{animationDelay: '0.2s'}}>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-110 hover:-rotate-2 animate-card-glow delay-200">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-2xl inline-block mb-6 animate-icon-spin delay-200">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 animate-number-count delay-200">50K+</div>
                <div className="text-slate-300 text-lg">{t('hero.stats.travelers')}</div>
              </div>
            </div>
            
            <div className="group animate-card-float" style={{animationDelay: '0.4s'}}>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-110 hover:rotate-2 animate-card-glow delay-400">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl inline-block mb-6 animate-icon-spin delay-400">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 animate-number-count delay-400">15+</div>
                <div className="text-slate-300 text-lg">{t('hero.stats.experience')}</div>
              </div>
            </div>
            
            <div className="group animate-card-float" style={{animationDelay: '0.6s'}}>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-110 hover:-rotate-2 animate-card-glow delay-600">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl inline-block mb-6 animate-icon-spin delay-600">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 animate-number-count delay-600">4.9</div>
                <div className="text-slate-300 text-lg">{t('hero.stats.rating')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Wave Shape with Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" className="w-full h-32 animate-wave-flow">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.2)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.1)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="white"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes plane-fly {
          0% { transform: translateX(-100px) translateY(20px) rotate(45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-20px) rotate(45deg); opacity: 0; }
        }
        
        @keyframes plane-fly-reverse {
          0% { transform: translateX(calc(100vw + 100px)) translateY(20px) rotate(-45deg) scaleX(-1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-100px) translateY(-20px) rotate(-45deg) scaleX(-1); opacity: 0; }
        }
        
        @keyframes plane-fly-diagonal {
          0% { transform: translateX(-100px) translateY(100px) rotate(12deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-100px) rotate(12deg); opacity: 0; }
        }
        
        @keyframes plane-fly-curve {
          0% { transform: translateX(calc(100vw + 100px)) translateY(0px) rotate(90deg); opacity: 0; }
          25% { transform: translateX(75vw) translateY(-50px) rotate(45deg); opacity: 1; }
          50% { transform: translateX(50vw) translateY(-30px) rotate(0deg); opacity: 1; }
          75% { transform: translateX(25vw) translateY(-50px) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-100px) translateY(0px) rotate(-90deg); opacity: 0; }
        }
        
        @keyframes plane-tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slide-left {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes title-reveal {
          0% { opacity: 0; transform: translateY(50px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes text-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes buttons-slide {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 60px rgba(147, 51, 234, 0.4), 0 0 80px rgba(236, 72, 153, 0.3); }
        }
        
        @keyframes icon-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes number-count {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 80px rgba(5, 150, 105, 0.6); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 70px rgba(147, 51, 234, 0.6), 0 0 90px rgba(236, 72, 153, 0.4); }
        }
        
        @keyframes wave-flow {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-20px); }
        }
        
        .animate-plane-fly {
          animation: plane-fly 15s linear infinite;
        }
        
        .animate-plane-fly-reverse {
          animation: plane-fly-reverse 18s linear infinite;
        }
        
        .animate-plane-fly-diagonal {
          animation: plane-fly-diagonal 20s linear infinite;
        }
        
        .animate-plane-fly-curve {
          animation: plane-fly-curve 25s ease-in-out infinite;
        }
        
        .animate-plane-tilt {
          animation: plane-tilt 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 8s ease-in-out infinite;
        }
        
        .animate-slide-left {
          animation: slide-left 8s ease-in-out infinite;
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }
        
        .animate-title-reveal {
          animation: title-reveal 1s ease-out;
        }
        
        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: text-shimmer 3s ease-in-out infinite;
        }
        
        .animate-fade-up {
          animation: fade-up 1s ease-out both;
        }
        
        .animate-buttons-slide {
          animation: buttons-slide 1s ease-out both;
        }
        
        .animate-card-float {
          animation: card-float 6s ease-in-out infinite;
        }
        
        .animate-card-glow {
          animation: card-glow 4s ease-in-out infinite;
        }
        
        .animate-icon-spin {
          animation: icon-spin 20s linear infinite;
        }
        
        .animate-number-count {
          animation: number-count 1s ease-out both;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-button-glow {
          animation: button-glow 3s ease-in-out infinite;
        }
        
        .animate-wave-flow {
          animation: wave-flow 6s ease-in-out infinite;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1300 { animation-delay: 1.3s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-3000 { animation-delay: 3s; }
        .delay-6000 { animation-delay: 6s; }
        .delay-9000 { animation-delay: 9s; }
        
        .rtl {
          direction: rtl;
        }
        
        .ltr {
          direction: ltr;
        }
      `}</style>
    </div>
  );
};

export default Hero;