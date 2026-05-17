import React from 'react';
import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import logoImg from '@assets/logo_no_bg.png';
import founderImg from '@assets/IMG_8816_1778995907725.jpeg';

export function AboutPage() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <img src={logoImg} alt="Sherry's Dipz" className="h-14 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium text-primary hidden sm:block">
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
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-primary/10 border-b py-16 px-6 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground max-w-2xl mx-auto leading-tight">
          Meet the Founder
        </h1>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={founderImg}
                  alt="Sherry — Founder of Sherry's Dipz"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground rounded-2xl px-6 py-4 shadow-lg hidden md:block">
                <p className="font-serif text-lg font-bold">Sherry</p>
                <p className="text-sm opacity-90">Founder & Head Chef</p>
              </div>
            </div>

            {/* Story */}
            <div className="flex flex-col gap-6">
              <p className="text-foreground text-lg leading-relaxed">
                For decades, Sherry's kitchen has been the designated gathering place for family, friends, and anyone lucky enough to snag an invitation.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                What started as a personal obsession with perfecting Mediterranean flavor profiles quickly became a local legend. For years, the feedback was always the same: <span className="text-foreground font-medium italic">"You need to sell these."</span>
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                When Sherry transitioned to a gluten-free lifestyle, she noticed a glaring gap in the market. Healthy alternatives were often bland, and "clean" dips lacked the rich, velvet textures of traditional recipes. Driven by the belief that eating well should never mean eating boring, she spent years refining her signature blends — completely free of gluten and preservatives.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, Sherry's Dipz brings that exact, uncompromising standard from her fridge to yours. Handcrafted in small batches, made with pure ingredients, and always made to share.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button size="lg" className="font-serif text-lg h-14 px-8 rounded-full gap-2 group w-full sm:w-auto">
                    Order Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a
                  href="https://www.instagram.com/sherrysdipz?igsh=eDluOWkxaDlyMmFl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="font-serif text-lg h-14 px-8 rounded-full gap-2 w-full sm:w-auto border-primary/30 hover:border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Follow Along
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Sherry's Dipz</h2>
          <p className="text-primary-foreground/70 text-sm mb-6">Preservative free. Gluten free. Made with love, made to order.</p>
          <div className="pt-6 border-t border-primary-foreground/20 text-xs text-primary-foreground/50">
            <p>&copy; {new Date().getFullYear()} Sherry's Dipz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
