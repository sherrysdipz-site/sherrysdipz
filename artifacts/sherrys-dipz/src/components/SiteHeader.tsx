import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SectionLink } from '@/components/ScrollManager';
import logoImg from '/logo-header.png';

// The logo hangs below the header as a large badge at the top of the page,
// then shrinks to fit inside the header once the visitor scrolls.
// Pages using this header need extra top padding on their first section to clear the badge.
export function SiteHeader() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLink = 'text-muted-foreground hover:text-foreground transition-colors';

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 md:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <nav className="flex items-center gap-8 text-sm font-medium">
          <SectionLink section="menu" className={`hidden md:inline ${navLink}`}>
            Menu
          </SectionLink>
          <SectionLink section="how-it-works" className={`hidden md:inline ${navLink}`}>
            How it works
          </SectionLink>
          <Link href="/about" className={location === '/about' ? 'text-foreground' : navLink}>
            Our story
          </Link>
        </nav>

        <Link
          href="/"
          aria-label="Sherry's Dipz home"
          className="absolute left-1/2 top-1 -translate-x-1/2"
          data-testid="link-header-logo"
        >
          <img
            src={logoImg}
            alt="Sherry's Dipz"
            className={`w-auto object-contain drop-shadow-[0_6px_12px_rgba(70,45,25,0.18)] transition-[height] duration-300 ease-out ${
              scrolled ? 'h-14 md:h-[72px]' : 'h-28 md:h-40'
            }`}
          />
        </Link>

        <div className="col-start-3 flex justify-end">
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
