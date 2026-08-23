import React, { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Services from './components/Services';
import TravelPackages from './components/TravelPackages';
import Tours from './components/Tours';
import VisaServices from './components/VisaServices';
import AdventureTours from './components/AdventureTours';
import CorporateTravel from './components/CorporateTravel';
import TripDetail from './components/TripDetail';
import Checkout from './components/Checkout';
import CartDrawer from './components/CartDrawer';
import PaymentReturnHandler from './components/PaymentReturnHandler';
import ConversionHome from './components/ConversionHome';
import FlightsPage from './components/FlightsPage';
import HotelsEnquiryPage from './components/HotelsEnquiryPage';
import InsurancePage from './components/InsurancePage';
import ContactPage from './components/ContactPage';
import LegalPage from './components/LegalPage';
import LeadsAdmin from './components/admin/LeadsAdmin';
import QuotePublic from './components/QuotePublic';
import CustomerPortal from './components/CustomerPortal';
import WhatsAppFab from './components/WhatsAppFab';
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
import { trackEvent } from './lib/analytics';

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

      if (resolved === 'quote') {
        setSelectedTripId(tripId || selectedTripId);
        setCurrentPage('quote');
        syncHash('quote', tripId || selectedTripId);
        scrollTop();
        return;
      }

      if (resolved === 'portal') {
        setSelectedTripId(tripId || selectedTripId);
        setCurrentPage('portal');
        syncHash('portal', tripId || selectedTripId);
        scrollTop();
        return;
      }

      if (
        resolved !== 'checkout' &&
        resolved !== 'compare' &&
        resolved !== 'not-found' &&
        !resolved.includes('policy') &&
        resolved !== 'terms-and-conditions' &&
        resolved !== 'refund-cancellation'
      ) {
        setReturnPage(resolved);
        setSelectedTripId(null);
      }

      setCurrentPage(resolved);
      syncHash(resolved, resolved === 'trip-detail' ? tripId : null);
      trackEvent('page_view', { page: resolved });
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
      if (parsed.page === 'quote' && parsed.tripId) {
        setSelectedTripId(parsed.tripId);
        setCurrentPage('quote');
        return;
      }
      if (parsed.page === 'portal' && parsed.tripId) {
        setSelectedTripId(parsed.tripId);
        setCurrentPage('portal');
        return;
      }
      setCurrentPage(parsed.page);
      if (
        parsed.page !== 'trip-detail' &&
        parsed.page !== 'quote' &&
        parsed.page !== 'portal' &&
        parsed.page !== 'checkout' &&
        parsed.page !== 'compare'
      ) {
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
            <ConversionHome />
            <Services />
            <TravelPackages />
          </>
        );
      case 'flights':
        return <FlightsPage />;
      case 'compare':
        return <CompareResults />;
      case 'packages':
        return <TravelPackages />;
      case 'tours':
        return <Tours />;
      case 'visa':
        return <VisaServices />;
      case 'hotels':
        return <HotelsEnquiryPage />;
      case 'adventure':
        return <AdventureTours />;
      case 'corporate':
        return <CorporateTravel />;
      case 'insurance':
        return <InsurancePage />;
      case 'umrah':
      case 'hajj':
      case 'activities':
      case 'cars':
      case 'cruises':
        return <VerticalHubPage pageId={currentPage} />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <LeadsAdmin />;
      case 'quote':
        return selectedTripId ? <QuotePublic token={selectedTripId} /> : <NotFoundPage />;
      case 'portal':
        return selectedTripId ? <CustomerPortal token={selectedTripId} /> : <NotFoundPage />;
      case 'privacy-policy':
      case 'terms-and-conditions':
      case 'cookie-policy':
      case 'refund-cancellation':
        return <LegalPage pageId={currentPage} />;
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
            {currentPage !== 'admin' && currentPage !== 'quote' && currentPage !== 'portal' && <WhatsAppFab />}
          </div>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
