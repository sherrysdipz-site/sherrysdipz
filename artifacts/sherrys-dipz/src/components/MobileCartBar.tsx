import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';

// A bar pinned to the bottom of the screen on phones once something is in the
// cart, so customers always know where their order is.
export function MobileCartBar() {
  const { totalItems, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const [location] = useLocation();

  const onBrowsingPage = location === '/' || location === '/about'; // checkout has its own bar
  if (totalItems === 0 || isCartOpen || !onBrowsingPage) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/95 to-background/0">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-between px-5 font-medium"
        data-testid="button-mobile-cart-bar"
      >
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          View order · {totalItems} {totalItems === 1 ? 'dip' : 'dips'}
        </span>
        <span className="flex items-center gap-1 font-semibold">
          ${subtotal.toFixed(2)}
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
