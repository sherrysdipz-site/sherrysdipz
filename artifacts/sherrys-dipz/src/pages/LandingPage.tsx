import React from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Leaf, HandHeart, Clock, FlaskConical } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'wouter';
import logoImg from '/logo_cropped.png';
import heroImg from '@assets/53BA409D-8089-4D04-899D-20C277B9E873_4_5005_c_1778994899377.jpeg';

const BADGES = [
  { icon: Leaf, label: 'Gluten Free' },
  { icon: FlaskConical, label: 'No Preservatives' },
  { icon: HandHeart, label: 'Hand Crafted' },
  { icon: Clock, label: 'Made to Order' },
];

export function LandingPage() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-[170px] flex items-center justify-between">
          <Link href="/">
            <img src={logoImg} alt="Sherry's Dipz" className="h-[160px] w-auto object-contain -ml-6" />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              About
            </Link>
          <Button 
            variant="outline" 
            className="relative rounded-full px-6 gap-2 border-primary/20 hover:border-primary/50"
            onClick={() => setIsCartOpen(true)}
            data-testid="button-header-cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full" data-testid="badge-cart-count">
                {totalItems}
              </span>
            )}
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg}
            alt="Sherry's Dipz — handcrafted Mediterranean dips" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
            Real ingredients.<br />No shortcuts.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow-md font-medium max-w-xl mx-auto">
            Handcrafted Mediterranean dips made to order — preservative free, gluten free, and bursting with authentic flavour.
          </p>
          <Button 
            size="lg" 
            className="font-serif text-lg h-14 px-8 rounded-full shadow-lg"
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Order Now
          </Button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 border-b bg-card">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-20">
        <div className="max-w-3xl mx-auto text-center px-6 mb-12">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Our Dips</h2>
          <p className="text-muted-foreground text-lg">
            Every jar is made fresh when you order — no preservatives, no fillers, just pure ingredients you can taste.
          </p>
        </div>
        <ProductGrid />
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Sherry's Dipz</h2>
          <p className="text-primary-foreground/80 mb-4 max-w-md mx-auto">
            Preservative free. Gluten free. Made with love, made to order.
          </p>
          <a
            href="https://www.instagram.com/sherrysdipz?igsh=eDluOWkxaDlyMmFl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @sherrysdipz
          </a>
          <div className="pt-8 border-t border-primary-foreground/20 text-sm text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between">
            <p>&copy; {new Date().getFullYear()} Sherry's Dipz. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Handcrafted in small batches.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
