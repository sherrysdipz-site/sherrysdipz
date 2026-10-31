import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

function scrollToHash(hash: string) {
  const el = document.getElementById(hash.replace(/^#/, ''));
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

// New pages start at the top (instead of keeping the previous page's scroll
// position), unless the URL points at a section like /#menu.
export function ScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait a frame so the target page has rendered.
      requestAnimationFrame(() => {
        if (!scrollToHash(hash)) window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

// A link to a section of the home page (e.g. "/#menu") that works from any page.
export function SectionLink({
  section,
  className,
  children,
  onClick,
}: {
  section: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [location, navigate] = useLocation();

  return (
    <a
      href={`/#${section}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        if (location === '/') {
          window.history.replaceState(null, '', `/#${section}`);
          scrollToHash(section);
        } else {
          navigate(`/#${section}`);
        }
      }}
    >
      {children}
    </a>
  );
}
