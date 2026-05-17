import React from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'wouter';
import logoImg from '@assets/IMG_0155_1778994569052.JPG';
import heroImg from '@assets/53BA409D-8089-4D04-899D-20C277B9E873_4_5005_c_1778994899377.jpeg';

export function LandingPage() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <img src={logoImg} alt="Sherry's Dipz" className="h-14 w-auto object-contain" />
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
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg}
            alt="Sherry's Dipz — handcrafted Mediterranean dips" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
            The taste of <br /> home, crafted.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow-md font-medium max-w-xl mx-auto">
            Small-batch Mediterranean dips made fresh in our kitchen. From velvety labneh to smoky baba ganoush, every jar tells a story.
          </p>
          <Button 
            size="lg" 
            className="font-serif text-lg h-14 px-8 rounded-full shadow-lg"
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore the Menu
          </Button>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-20">
        <div className="max-w-3xl mx-auto text-center px-6 mb-12">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Our Dips</h2>
          <p className="text-muted-foreground text-lg">Handcrafted daily in small batches using premium olive oil and fresh ingredients.</p>
        </div>
        <ProductGrid />
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Sherry's Dipz</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Bringing authentic Mediterranean flavours to your table.
          </p>
          <div className="pt-8 border-t border-primary-foreground/20 text-sm text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between">
            <p>&copy; {new Date().getFullYear()} Sherry's Dipz. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Made with love in our kitchen.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
