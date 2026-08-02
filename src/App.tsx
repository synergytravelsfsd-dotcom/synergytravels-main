import React, { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Services from './components/Services';
import FlightSearch from './components/FlightSearch';
import TravelPackages from './components/TravelPackages';
import Tours from './components/Tours';
import VisaServices from './components/VisaServices';
import Hotels from './components/Hotels';
import AdventureTours from './components/AdventureTours';
import CorporateTravel from './components/CorporateTravel';
import TripDetail from './components/TripDetail';
import Checkout from './components/Checkout';
import CartDrawer from './components/CartDrawer';
import PaymentReturnHandler from './components/PaymentReturnHandler';
import MetaSearchHero from './components/metasearch/MetaSearchHero';
import CompareResults from './components/metasearch/CompareResults';
import VerticalHubPage from './components/metasearch/VerticalHubPage';
import NotFoundPage from './components/NotFoundPage';
import { Footer } from './components/Footer';
import CurrencyProvider from './context/CurrencyContext';
import LanguageProvider from './context/LanguageContext';
import CartProvider from './context/CartContext';
import {
  buildPageHash,
  isAppPage,
  parsePageHash,
  resolveNavigateTarget,
  type AppPage,
} from './constants/pages';
import type { SearchVertical } from './metasearch/types';
import { useMetaSearchStore } from './metasearch/store';

type NavDetail =
  | string
  | {
      page: string;
      tripId?: string;
      vertical?: SearchVertical;
    };

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [returnPage, setReturnPage] = useState<AppPage>('packages');
  const [paymentBanner, setPaymentBanner] = useState<string | null>(null);
  const setVertical = useMetaSearchStore((s) => s.setVertical);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const scrollTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const syncHash = useCallback((page: AppPage, tripId?: string | null) => {
    const next = buildPageHash(page, tripId);
    const path = `${window.location.pathname}${window.location.search}`;
    if (page === 'home') {
      if (window.location.hash) {
        window.history.replaceState(null, '', path);
      }
      return;
    }
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', `${path}${next}`);
    }
  }, []);

  const handleExplorePackages = () => {
    setCurrentPage('packages');
    setReturnPage('packages');
    syncHash('packages');
    scrollTop();
  };

  const handleLogoClick = () => {
    setCurrentPage('home');
    setSelectedTripId(null);
    syncHash('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = useCallback(
    (page: string, tripId?: string | null) => {
      const resolved = isAppPage(page) ? page : resolveNavigateTarget(page);

      if (resolved === 'trip-detail') {
        setSelectedTripId(tripId || selectedTripId);
        setCurrentPage('trip-detail');
        syncHash('trip-detail', tripId || selectedTripId);
        scrollTop();
        return;
      }

      if (resolved !== 'checkout' && resolved !== 'compare' && resolved !== 'not-found') {
        setReturnPage(resolved);
        setSelectedTripId(null);
      }

      setCurrentPage(resolved);
      syncHash(resolved, resolved === 'trip-detail' ? tripId : null);
      scrollTop();
    },
    [selectedTripId, syncHash]
  );

  useEffect(() => {
    const applyHash = () => {
      const parsed = parsePageHash(window.location.hash);
      if (parsed.page === 'trip-detail' && parsed.tripId) {
        setSelectedTripId(parsed.tripId);
        setCurrentPage('trip-detail');
        return;
      }
      setCurrentPage(parsed.page);
      if (parsed.page !== 'trip-detail' && parsed.page !== 'checkout' && parsed.page !== 'compare') {
        setReturnPage(parsed.page === 'not-found' ? 'home' : parsed.page);
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    const handleNavigateToPage = (event: CustomEvent<NavDetail>) => {
      const detail = event.detail;
      if (typeof detail === 'string') {
        handlePageChange(detail);
        return;
      }
      if (!detail?.page) return;

      if (detail.vertical) {
        setVertical(detail.vertical);
      }

      if (detail.page === 'trip-detail' && detail.tripId) {
        setReturnPage(
          currentPage === 'trip-detail' || currentPage === 'checkout' ? returnPage : currentPage
        );
        handlePageChange('trip-detail', detail.tripId);
        return;
      }

      handlePageChange(detail.page);
    };

    window.addEventListener('navigateToPage', handleNavigateToPage as EventListener);
    return () => {
      window.removeEventListener('navigateToPage', handleNavigateToPage as EventListener);
    };
  }, [currentPage, returnPage, handlePageChange, setVertical]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <MetaSearchHero onExplorePackages={handleExplorePackages} />
            <FlightSearch />
            <Services />
            <TravelPackages />
          </>
        );
      case 'compare':
        return <CompareResults />;
      case 'packages':
        return <TravelPackages />;
      case 'tours':
        return <Tours />;
      case 'visa':
        return <VisaServices />;
      case 'hotels':
        return <Hotels />;
      case 'adventure':
        return <AdventureTours />;
      case 'corporate':
        return <CorporateTravel />;
      case 'umrah':
      case 'hajj':
      case 'insurance':
      case 'activities':
      case 'cars':
      case 'cruises':
        return <VerticalHubPage pageId={currentPage} />;
      case 'trip-detail':
        return (
          <TripDetail
            tripId={selectedTripId || ''}
            onBack={() => handlePageChange(returnPage || 'packages')}
            onCheckout={() => handlePageChange('checkout')}
          />
        );
      case 'checkout':
        return <Checkout onBack={() => handlePageChange(returnPage || 'packages')} />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <NotFoundPage />;
    }
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  const needsTopPad = currentPage !== 'home' && currentPage !== 'compare';
  const topPadClass = needsTopPad ? 'pt-16 sm:pt-20 md:pt-24 lg:pt-28' : '';
  const navHighlight: string =
    currentPage === 'trip-detail' || currentPage === 'checkout'
      ? returnPage
      : currentPage === 'not-found'
        ? 'home'
        : currentPage;

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <PaymentReturnHandler
            onBanner={setPaymentBanner}
            onGoCheckout={() => handlePageChange('checkout')}
          />
          <div className="min-h-screen bg-white">
            <Navigation
              currentPage={navHighlight}
              setCurrentPage={handlePageChange}
              onLogoClick={handleLogoClick}
            />

            <div className={topPadClass}>
              {paymentBanner && (
                <div className="max-w-5xl mx-auto px-4 pt-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 px-4 py-3 text-sm flex items-start justify-between gap-3">
                    <span>{paymentBanner}</span>
                    <button
                      type="button"
                      className="text-emerald-700 font-semibold"
                      onClick={() => setPaymentBanner(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              {renderPage()}
            </div>

            <Footer onLogoClick={handleLogoClick} />
            <CartDrawer />
          </div>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
