import React, { createContext, useContext, useState } from 'react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 278 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 3.75 }
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  const convertPrice = (usdPrice: number): number => {
    return Math.round(usdPrice * selectedCurrency.rate);
  };

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = convertPrice(usdPrice);
    return `${selectedCurrency.symbol}${convertedPrice.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      currencies,
      setCurrency,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;