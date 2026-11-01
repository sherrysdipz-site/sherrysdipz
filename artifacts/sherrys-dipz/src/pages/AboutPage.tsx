import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter, InstagramIcon, INSTAGRAM_URL } from '@/components/SiteFooter';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Hero Banner */}
      <section className="bg-primary/10 border-b pt-20 pb-16 md:pt-28 px-6 text-center">
        <p className="text-sm font-medium text-secondary uppercase tracking-[0.2em] mb-3">Our story</p>
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
                  src="/images/sherry.jpg"
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
                <Link href="/#menu">
                  <Button size="lg" className="font-serif text-lg h-14 px-8 rounded-full gap-2 group w-full sm:w-auto">
                    Order Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="font-serif text-lg h-14 px-8 rounded-full gap-2 w-full sm:w-auto border-primary/30 hover:border-primary">
                    <InstagramIcon className="h-5 w-5" />
                    Follow Along
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
