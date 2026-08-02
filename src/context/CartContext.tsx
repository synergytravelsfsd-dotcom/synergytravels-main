import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTripById, type Trip } from '../data/trips';

export type CartItem = {
  id: string;
  tripId: string;
  title: string;
  image: string;
  unitPrice: number;
  adults: number;
  children: number;
  startDate: string;
  endDate: string;
  tripCode: string;
  duration: string;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addTrip: (trip: Trip, options?: Partial<Pick<CartItem, 'adults' | 'children' | 'startDate' | 'endDate'>>) => void;
  updateItem: (id: string, patch: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'synergy_cart_v1';

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function travellersTotal(item: CartItem) {
  return Math.max(1, (item.adults || 0) + (item.children || 0));
}

function itemTotal(item: CartItem) {
  // Children charged at 70% of adult guide price
  const adults = Math.max(0, item.adults);
  const children = Math.max(0, item.children);
  return adults * item.unitPrice + children * Math.round(item.unitPrice * 0.7);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function cartItemTotal(item: CartItem) {
  return itemTotal(item);
}

export function cartTravellers(item: CartItem) {
  return travellersTotal(item);
}

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addTrip: CartContextValue['addTrip'] = (trip, options = {}) => {
    const startDate = options.startDate || '';
    const endDate =
      options.endDate || (startDate ? addDays(startDate, Math.max(trip.days - 1, 0)) : '');

    setItems((prev) => {
      const existing = prev.find((i) => i.tripId === trip.id && i.startDate === startDate);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? {
                ...i,
                adults: i.adults + (options.adults || 1),
                children: i.children + (options.children || 0),
              }
            : i
        );
      }

      const next: CartItem = {
        id: `${trip.id}-${Date.now()}`,
        tripId: trip.id,
        title: trip.title,
        image: trip.image,
        unitPrice: trip.price,
        adults: options.adults ?? 2,
        children: options.children ?? 0,
        startDate,
        endDate,
        tripCode: trip.tripCode,
        duration: trip.duration,
      };
      return [...prev, next];
    });
    setIsCartOpen(true);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + travellersTotal(i), 0),
      subtotal: items.reduce((sum, i) => sum + itemTotal(i), 0),
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((v) => !v),
      addTrip,
      updateItem: (id, patch) => {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;
            const next = { ...item, ...patch };
            if (patch.startDate) {
              const trip = getTripById(item.tripId);
              next.endDate = addDays(patch.startDate, Math.max((trip?.days || 1) - 1, 0));
            }
            return next;
          })
        );
      },
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clearCart: () => setItems([]),
    }),
    [items, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
