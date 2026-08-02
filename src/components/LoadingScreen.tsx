import React, { useEffect, useState } from 'react';
import { Plane, Globe } from 'lucide-react';
import logoImg from '../assets/synergy-travels-tour-logo-light.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing your journey...');

  useEffect(() => {
    const loadingTexts = [
      'Preparing your journey...',
      'Connecting to destinations...',
      'Loading travel experiences...',
      'Almost ready to explore...',
      'Welcome to Synergy Travels & Tour!'
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update loading text based on progress
        if (newProgress >= 20 && newProgress < 40) {
          setLoadingText(loadingTexts[1]);
        } else if (newProgress >= 40 && newProgress < 60) {
          setLoadingText(loadingTexts[2]);
        } else if (newProgress >= 60 && newProgress < 80) {
          setLoadingText(loadingTexts[3]);
        } else if (newProgress >= 80) {
          setLoadingText(loadingTexts[4]);
        }

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onLoadingComplete();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Earth and Plane Animation Container */}
        <div className="relative mb-12">
          {/* Earth */}
          <div className="relative w-80 h-80 mx-auto">
            {/* Earth Globe */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 shadow-2xl animate-earth-rotate relative overflow-hidden">
              {/* Continents */}
              <div className="absolute inset-0 rounded-full">
                {/* Africa */}
                <div className="absolute top-1/3 left-1/2 w-10 h-16 bg-green-600 rounded-lg transform -translate-x-1/2 animate-continent-drift"></div>
                {/* Asia */}
                <div className="absolute top-1/4 right-1/4 w-16 h-10 bg-green-700 rounded-lg animate-continent-drift delay-1000"></div>
                {/* Americas */}
                <div className="absolute top-1/3 left-1/4 w-8 h-20 bg-green-600 rounded-lg animate-continent-drift delay-2000"></div>
                {/* Europe */}
                <div className="absolute top-1/4 left-1/2 w-6 h-8 bg-green-700 rounded transform -translate-x-1/2 animate-continent-drift delay-1500"></div>
              </div>
              
              {/* Atmosphere Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-transparent to-cyan-400/20 animate-atmosphere-glow"></div>
            </div>

            {/* Orbital Rings */}
            <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-orbit-ring-1"></div>
            <div className="absolute inset-0 border border-purple-400/20 rounded-full animate-orbit-ring-2" style={{ transform: 'scale(1.2)' }}></div>
            <div className="absolute inset-0 border border-pink-400/20 rounded-full animate-orbit-ring-3" style={{ transform: 'scale(1.4)' }}></div>

            {/* BIG Flying Planes Around Earth */}
            <div className="absolute inset-0">
              {/* Plane 1 - Equatorial orbit - HUGE */}
              <div className="absolute top-1/2 left-1/2 w-full h-full animate-plane-orbit-1">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
                  <div className="relative">
                    {/* Plane Shadow/Glow */}
                    <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg scale-150"></div>
                    {/* Main Plane */}
                    <Plane className="h-16 w-16 text-cyan-400 animate-plane-tilt-orbit relative z-10 drop-shadow-2xl" />
                    {/* Plane Trail */}
                    <div className="absolute top-1/2 left-full w-32 h-1 bg-gradient-to-r from-cyan-400/60 to-transparent animate-trail-glow"></div>
                  </div>
                </div>
              </div>

              {/* Plane 2 - Polar orbit - LARGE */}
              <div className="absolute top-1/2 left-1/2 w-full h-full animate-plane-orbit-2">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20">
                  <div className="relative">
                    {/* Plane Shadow/Glow */}
                    <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-lg scale-150"></div>
                    {/* Main Plane */}
                    <Plane className="h-14 w-14 text-pink-400 animate-plane-tilt-orbit delay-1000 relative z-10 drop-shadow-2xl" />
                    {/* Plane Trail */}
                    <div className="absolute top-1/2 left-full w-28 h-1 bg-gradient-to-r from-pink-400/60 to-transparent animate-trail-glow delay-1000"></div>
                  </div>
                </div>
              </div>

              {/* Plane 3 - Diagonal orbit - BIG */}
              <div className="absolute top-1/2 left-1/2 w-full h-full animate-plane-orbit-3">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-24">
                  <div className="relative">
                    {/* Plane Shadow/Glow */}
                    <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg scale-150"></div>
                    {/* Main Plane */}
                    <Plane className="h-12 w-12 text-purple-400 animate-plane-tilt-orbit delay-2000 relative z-10 drop-shadow-2xl" />
                    {/* Plane Trail */}
                    <div className="absolute top-1/2 left-full w-24 h-1 bg-gradient-to-r from-purple-400/60 to-transparent animate-trail-glow delay-2000"></div>
                  </div>
                </div>
              </div>

              {/* Additional BIG Planes for More Impact */}
              {/* Plane 4 - Reverse orbit - MASSIVE */}
              <div className="absolute top-1/2 left-1/2 w-full h-full animate-plane-orbit-reverse">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12">
                  <div className="relative">
                    {/* Plane Shadow/Glow */}
                    <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-lg scale-150"></div>
                    {/* Main Plane */}
                    <Plane className="h-18 w-18 text-emerald-400 animate-plane-tilt-orbit delay-3000 relative z-10 drop-shadow-2xl transform scale-110" />
                    {/* Plane Trail */}
                    <div className="absolute top-1/2 left-full w-36 h-1 bg-gradient-to-r from-emerald-400/60 to-transparent animate-trail-glow delay-3000"></div>
                  </div>
                </div>
              </div>

              {/* Plane 5 - Fast orbit - HUGE */}
              <div className="absolute top-1/2 left-1/2 w-full h-full animate-plane-orbit-fast">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                  <div className="relative">
                    {/* Plane Shadow/Glow */}
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-lg scale-150"></div>
                    {/* Main Plane */}
                    <Plane className="h-20 w-20 text-yellow-400 animate-plane-tilt-orbit delay-4000 relative z-10 drop-shadow-2xl transform scale-125" />
                    {/* Plane Trail */}
                    <div className="absolute top-1/2 left-full w-40 h-1 bg-gradient-to-r from-yellow-400/60 to-transparent animate-trail-glow delay-4000"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Satellite Dots */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-satellite-orbit shadow-lg"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${3 + i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Floating Travel Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 animate-float-icon delay-500">
              <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-400/50">
                <span className="text-cyan-400 text-2xl">✈️</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 animate-float-icon delay-1000">
              <div className="w-12 h-12 bg-pink-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-pink-400/50">
                <span className="text-pink-400 text-2xl">🏨</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 animate-float-icon delay-1500">
              <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/50">
                <span className="text-purple-400 text-2xl">🗺️</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 animate-float-icon delay-2000">
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/50">
                <span className="text-green-400 text-2xl">🎒</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-0 animate-float-icon delay-2500">
              <div className="w-12 h-12 bg-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-400/50">
                <span className="text-orange-400 text-2xl">🌍</span>
              </div>
            </div>
            <div className="absolute top-1/2 right-0 animate-float-icon delay-3000">
              <div className="w-12 h-12 bg-indigo-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-indigo-400/50">
                <span className="text-indigo-400 text-2xl">🎫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logo — transparent, no pasted white card */}
        <div className="mb-8 animate-logo-glow flex justify-center px-4">
          <img
            src={logoImg}
            alt="Synergy Travels & Tour"
            className="h-20 sm:h-28 md:h-32 w-auto max-w-[90vw] mx-auto object-contain drop-shadow-[0_8px_28px_rgba(249,115,22,0.35)]"
          />
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <p className="text-xl text-slate-300 animate-text-fade font-medium">{loadingText}</p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-96 max-w-sm mx-auto mb-6">
          <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300 ease-out animate-progress-glow shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-400 mt-3">
            <span>0%</span>
            <span className="animate-pulse font-bold text-white">{progress}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Enhanced Loading Dots */}
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-loading-dot shadow-lg"></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-loading-dot delay-200 shadow-lg"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-loading-dot delay-400 shadow-lg"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes earth-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes continent-drift {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes atmosphere-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes orbit-ring-1 {
          0% { transform: rotate(0deg) scale(1.1); opacity: 0.3; }
          100% { transform: rotate(360deg) scale(1.1); opacity: 0.3; }
        }

        @keyframes orbit-ring-2 {
          0% { transform: rotate(0deg) scale(1.3); opacity: 0.2; }
          100% { transform: rotate(-360deg) scale(1.3); opacity: 0.2; }
        }

        @keyframes orbit-ring-3 {
          0% { transform: rotate(0deg) scale(1.5); opacity: 0.1; }
          100% { transform: rotate(360deg) scale(1.5); opacity: 0.1; }
        }

        @keyframes plane-orbit-1 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes plane-orbit-2 {
          0% { transform: rotate(0deg) rotateX(60deg); }
          100% { transform: rotate(360deg) rotateX(60deg); }
        }

        @keyframes plane-orbit-3 {
          0% { transform: rotate(0deg) rotateY(45deg); }
          100% { transform: rotate(360deg) rotateY(45deg); }
        }

        @keyframes plane-orbit-reverse {
          0% { transform: rotate(360deg) rotateZ(30deg); }
          100% { transform: rotate(0deg) rotateZ(30deg); }
        }

        @keyframes plane-orbit-fast {
          0% { transform: rotate(0deg) rotateX(30deg) rotateY(30deg); }
          100% { transform: rotate(360deg) rotateX(30deg) rotateY(30deg); }
        }

        @keyframes plane-tilt-orbit {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-20deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1.2); }
          75% { transform: rotate(20deg) scale(1.1); }
        }

        @keyframes trail-glow {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes satellite-orbit {
          0% { 
            transform: rotate(0deg) translateX(180px) rotate(0deg);
            opacity: 0.5;
          }
          50% { opacity: 1; }
          100% { 
            transform: rotate(360deg) translateX(180px) rotate(-360deg);
            opacity: 0.5;
          }
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.2); }
        }

        @keyframes logo-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
          50% { text-shadow: 0 0 60px rgba(147, 51, 234, 0.7), 0 0 80px rgba(236, 72, 153, 0.5); }
        }

        @keyframes text-fade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes progress-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.7), 0 0 40px rgba(236, 72, 153, 0.5); }
        }

        @keyframes loading-dot {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.8); opacity: 1; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .animate-earth-rotate {
          animation: earth-rotate 25s linear infinite;
        }

        .animate-continent-drift {
          animation: continent-drift 3s ease-in-out infinite;
        }

        .animate-atmosphere-glow {
          animation: atmosphere-glow 4s ease-in-out infinite;
        }

        .animate-orbit-ring-1 {
          animation: orbit-ring-1 10s linear infinite;
        }

        .animate-orbit-ring-2 {
          animation: orbit-ring-2 15s linear infinite;
        }

        .animate-orbit-ring-3 {
          animation: orbit-ring-3 20s linear infinite;
        }

        .animate-plane-orbit-1 {
          animation: plane-orbit-1 8s linear infinite;
        }

        .animate-plane-orbit-2 {
          animation: plane-orbit-2 12s linear infinite;
        }

        .animate-plane-orbit-3 {
          animation: plane-orbit-3 15s linear infinite;
        }

        .animate-plane-orbit-reverse {
          animation: plane-orbit-reverse 10s linear infinite;
        }

        .animate-plane-orbit-fast {
          animation: plane-orbit-fast 6s linear infinite;
        }

        .animate-plane-tilt-orbit {
          animation: plane-tilt-orbit 3s ease-in-out infinite;
        }

        .animate-trail-glow {
          animation: trail-glow 2s ease-in-out infinite;
        }

        .animate-satellite-orbit {
          animation: satellite-orbit 4s linear infinite;
        }

        .animate-float-icon {
          animation: float-icon 5s ease-in-out infinite;
        }

        .animate-logo-glow {
          animation: logo-glow 3s ease-in-out infinite;
        }

        .animate-text-fade {
          animation: text-fade 2s ease-in-out infinite;
        }

        .animate-progress-glow {
          animation: progress-glow 2s ease-in-out infinite;
        }

        .animate-loading-dot {
          animation: loading-dot 1.5s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-2500 { animation-delay: 2.5s; }
        .delay-3000 { animation-delay: 3s; }
        .delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default LoadingScreen;