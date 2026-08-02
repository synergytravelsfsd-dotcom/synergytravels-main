import React, { useState } from 'react';
import { Menu, X, ChevronDown, Globe, Languages, ShoppingCart } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/synergy-travels-tour-logo.png';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogoClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  onLogoClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { selectedCurrency, currencies, setCurrency } = useCurrency();
  const { selectedLanguage, languages, setLanguage, t, isRTL } = useLanguage();
  const { itemCount, openCart, toggleCart } = useCart();

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'compare', label: t('nav.compare') },
    { id: 'packages', label: t('nav.packages') },
    { id: 'umrah', label: t('nav.umrah') },
    { id: 'tours', label: t('nav.tours') },
    { id: 'visa', label: t('nav.visa') },
    { id: 'hotels', label: t('nav.hotels') },
    { id: 'adventure', label: t('nav.adventure') },
    { id: 'corporate', label: t('nav.corporate') },
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      setCurrentPage('home');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleNavItemClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsMenuOpen(false);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <nav className={`fixed w-full bg-white/95 backdrop-blur-lg border-b border-gray-200/50 z-50 shadow-lg ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-24 sm:h-28 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <div className={`flex items-center shrink-0 ${isRTL ? 'space-x-reverse' : ''}`}>
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
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-x-4 xl:gap-x-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`text-xs xl:text-sm font-medium transition-all duration-200 relative group whitespace-nowrap ${
                  currentPage === item.id
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 ${isRTL ? 'right-0' : 'left-0'} w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform transition-transform duration-200 ${
                  currentPage === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </button>
            ))}
          </div>

          {/* Language & Currency Selectors */}
          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => handleNavItemClick('compare')}
              className="lg:hidden px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg"
            >
              {t('nav.compare')}
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
              aria-label="Open trip cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50 ${isRTL ? 'space-x-reverse' : ''}`}
                aria-label="Select language"
              >
                <Languages className="h-4 w-4" />
                <span>{selectedLanguage.flag}</span>
                <span>{selectedLanguage.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isLanguageOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slide-up`}>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLanguage(language);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center ${isRTL ? 'justify-end space-x-reverse' : 'justify-between'} space-x-2 ${
                        selectedLanguage.code === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      aria-label={`Select ${language.name}`}
                    >
                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <span className="text-lg">{language.flag}</span>
                        <div className={`text-${isRTL ? 'right' : 'left'}`}>
                          <span className="font-medium">{language.nativeName}</span>
                          <span className="text-gray-500 ml-2 text-xs">({language.name})</span>
                        </div>
                      </div>
                      {selectedLanguage.code === language.code && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50 ${isRTL ? 'space-x-reverse' : ''}`}
                aria-label="Select currency"
              >
                <Globe className="h-4 w-4" />
                <span>{selectedCurrency.code}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isCurrencyOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slide-up`}>
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setCurrency(currency);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        selectedCurrency.code === currency.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      aria-label={`Select ${currency.name}`}
                    >
                      <div>
                        <span className="font-medium">{currency.symbol} {currency.code}</span>
                        <span className="text-gray-500 ml-2 text-xs">{currency.name}</span>
                      </div>
                      {selectedCurrency.code === currency.code && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tablet/Mobile Cart + Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-orange-600 md:hidden"
              aria-label="Open trip cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`block w-full text-${isRTL ? 'right' : 'left'} px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Language & Currency Selectors */}
            <div className="border-t border-gray-200 pt-3">
              <div className="px-3 py-2">
                <p className={`text-sm font-medium text-gray-700 mb-2 text-${isRTL ? 'right' : 'left'}`}>{t('common.language')}</p>
                <select
                  value={selectedLanguage.code}
                  onChange={(e) => {
                    const language = languages.find(l => l.code === e.target.value);
                    if (language) setLanguage(language);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  aria-label="Select language"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.flag} {language.nativeName} ({language.name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="px-3 py-2">
                <p className={`text-sm font-medium text-gray-700 mb-2 text-${isRTL ? 'right' : 'left'}`}>{t('common.currency')}</p>
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const currency = currencies.find(c => c.code === e.target.value);
                    if (currency) setCurrency(currency);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  aria-label="Select currency"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .rtl {
          direction: rtl;
        }
        
        .ltr {
          direction: ltr;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;