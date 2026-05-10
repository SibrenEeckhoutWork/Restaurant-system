'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Thuis' },
  { href: '/kaart', label: 'Kaart' },
  { href: '/bestellen', label: 'Ontbijtbox' },
  { href: '/zaaltje', label: 'Zaaltje' },
  { href: '/galerij', label: 'Galerij' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav__inner">
        <Link className="brand" href="/">
          <span className="brand__mark">de Zoete Wever</span>
          <span className="brand__name">est. Roeselare</span>
        </Link>

        <nav className={`nav__links${open ? ' is-open' : ''}`} aria-label="Hoofdmenu">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link className="nav__cta" href="/bestellen">
          Bestel ontbijtbox
          <span className="arrow" aria-hidden="true">→</span>
        </Link>

        <button
          className="nav__menu-btn"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Sluit' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
