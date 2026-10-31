import React from 'react';
import { Link } from 'wouter';
import { SectionLink } from '@/components/ScrollManager';

const INSTAGRAM_URL = 'https://www.instagram.com/sherrysdipz?igsh=eDluOWkxaDlyMmFl';

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export { INSTAGRAM_URL };

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl font-semibold mb-3">Sherry's Dipz</p>
          <p className="text-background/70 max-w-sm leading-relaxed">
            Small-batch Mediterranean dips, made to order in Sherry's kitchen. Gluten free, preservative free, always.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-background/50 mb-1">Explore</p>
          <SectionLink section="menu" className="text-background/80 hover:text-background">The menu</SectionLink>
          <SectionLink section="how-it-works" className="text-background/80 hover:text-background">How ordering works</SectionLink>
          <Link href="/about" className="text-background/80 hover:text-background">Our story</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-background/50 mb-1">Say hello</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-background/80 hover:text-background">
            <InstagramIcon className="h-4 w-4" />
            @sherrysdipz
          </a>
          <a href="mailto:sherrysdipz@gmail.com" className="text-background/80 hover:text-background">
            sherrysdipz@gmail.com
          </a>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 text-xs text-background/50 flex flex-col sm:flex-row gap-2 justify-between">
          <p>&copy; {new Date().getFullYear()} Sherry's Dipz</p>
          <p>Handcrafted in small batches.</p>
        </div>
      </div>
    </footer>
  );
}
