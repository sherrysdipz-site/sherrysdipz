import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Leaf, FlaskConical, HandHeart, Clock } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SectionLink } from '@/components/ScrollManager';

const PROMISES = [
  { icon: Leaf, label: 'Gluten free' },
  { icon: FlaskConical, label: 'No preservatives' },
  { icon: HandHeart, label: 'Handmade in small batches' },
  { icon: Clock, label: 'Made fresh to order' },
];

const STEPS = [
  {
    title: 'Pick your dips',
    body: 'Choose from six Mediterranean dips, each in an 8 oz tub. Mix and match as many as you like.',
  },
  {
    title: 'Choose a pickup time',
    body: 'Pickups run Thursday to Saturday, 2–6 pm. Order at least two days ahead so everything is made fresh for you.',
  },
  {
    title: 'Pay your way',
    body: 'Send an Interac e-Transfer after you order, or pay cash when you pick up. No card details needed.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-16 pb-14 md:pt-24 md:pb-16 grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center">
        <div className="md:order-2 aspect-[5/4] md:aspect-[6/5] rounded-3xl overflow-hidden bg-muted">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/dips/hero.jpg" />
            <img
              src="/images/dips/hero-sm.jpg"
              alt="Sherry's Dipz containers of hummus, labneh, olive dip, matbucha, tahini and Turkish eggplant"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        <div className="md:order-1">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-secondary mb-5">
              Small batch · Gluten free · Made to order
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.02] tracking-tight mb-6">
              Real ingredients.<br />
              <span className="italic font-normal text-primary">No shortcuts.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 leading-relaxed mb-8 max-w-md">
              Handcrafted Mediterranean dips from Sherry's kitchen — preservative free, gluten free, and full of real flavour.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <SectionLink
                section="menu"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-medium text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                Order for pickup
                <ArrowRight className="h-5 w-5" />
              </SectionLink>
              <SectionLink
                section="how-it-works"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-foreground/20 bg-background/60 backdrop-blur font-medium text-lg hover:border-foreground/50 transition-colors"
              >
                How it works
              </SectionLink>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="border-y border-border/70 bg-card">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
          {PROMISES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Menu */}
      <section id="menu" className="scroll-mt-20 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-secondary mb-3">The menu</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              Six dips, made fresh for you
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:text-right">
            Every tub is 8 oz, gluten free and preservative free — made in small batches after you order.
          </p>
        </div>
        <ProductGrid />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-primary/10 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-secondary mb-3">How it works</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-12 md:mb-16 max-w-xl">
            Ordering is simple
          </h2>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col">
                <span className="font-serif text-6xl italic text-primary/60 leading-none mb-4">{i + 1}</span>
                <h3 className="font-serif text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Meet Sherry */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-[5fr_6fr] gap-10 md:gap-16 items-center">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
            <img
              src="/images/sherry.jpg"
              alt="Sherry in her kitchen with a roll of Sherry's Dipz labels"
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-secondary mb-3">Meet Sherry</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-6">
              "You need to sell these."
            </h2>
            <div className="space-y-4 text-lg text-foreground/75 leading-relaxed mb-8">
              <p>
                For decades, Sherry's kitchen has been the gathering place for family and friends — and her dips were always the first thing gone.
              </p>
              <p>
                When she went gluten free, she couldn't find dips that were both clean and delicious. So she spent years perfecting her own, with no gluten, no preservatives, and no compromises.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
            >
              Read Sherry's story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
