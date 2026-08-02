import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { cartItemTotal, useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { navigateToCheckout, navigateToTrip } from '../data/trips';

const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, updateItem, removeItem, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        className="absolute inset-0 bg-black/45"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Trip Cart</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">Your cart is empty</p>
              <p className="text-sm mt-1">Browse packages and add a trip to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3 space-y-3">
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                        navigateToTrip(item.tripId);
                      }}
                      className="font-semibold text-sm text-gray-900 hover:text-orange-600 text-left line-clamp-2"
                    >
                      {item.title}
                    </button>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.tripCode} · {item.duration}
                    </p>
                    <p className="text-sm font-semibold text-orange-600 mt-1">
                      {formatPrice(cartItemTotal(item))}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 h-fit rounded-md hover:bg-red-50 text-red-500"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Travel start date</label>
                  <input
                    type="date"
                    value={item.startDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                    className="mt-1 w-full px-2.5 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                  {item.endDate && (
                    <p className="text-xs text-gray-500 mt-1">Ends on {item.endDate}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">Adults</span>
                    <button
                      type="button"
                      className="p-1 rounded border border-gray-300"
                      onClick={() => updateItem(item.id, { adults: Math.max(1, item.adults - 1) })}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.adults}</span>
                    <button
                      type="button"
                      className="p-1 rounded border border-gray-300"
                      onClick={() => updateItem(item.id, { adults: item.adults + 1 })}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">Kids</span>
                    <button
                      type="button"
                      className="p-1 rounded border border-gray-300"
                      onClick={() => updateItem(item.id, { children: Math.max(0, item.children - 1) })}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.children}</span>
                    <button
                      type="button"
                      className="p-1 rounded border border-gray-300"
                      onClick={() => updateItem(item.id, { children: item.children + 1 })}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-200 px-5 py-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal (guide)</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => {
              closeCart();
              navigateToCheckout();
            }}
            className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-3 font-semibold"
          >
            Proceed to Checkout
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-sm text-gray-500 hover:text-red-600"
            >
              Clear cart
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
