import React from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SectionLink } from '@/components/ScrollManager';
import logoImg from '/logo-header.png';

export function SiteHeader() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="Sherry's Dipz home">
          <img src={logoImg} alt="Sherry's Dipz" className="h-14 md:h-[72px] w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <SectionLink section="menu" className="text-muted-foreground hover:text-foreground transition-colors">
            Menu
          </SectionLink>
          <SectionLink section="how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </SectionLink>
          <Link
            href="/about"
            className={`transition-colors hover:text-foreground ${
              location === '/about' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Our story
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/about" className="md:hidden text-sm font-medium text-muted-foreground hover:text-foreground">
            Our story
          </Link>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-4 h-10 text-sm font-medium hover:border-foreground/40 transition-colors"
            data-testid="button-header-cart"
            aria-label={`Open your order, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">
              {totalItems > 0 ? `$${subtotal.toFixed(2)}` : 'Your order'}
            </span>
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[11px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full"
                data-testid="badge-cart-count"
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
