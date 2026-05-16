'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenantOptional } from '@/context/TenantContext';

const fallbackLinks = [
  { href: '/', label: 'Thuis' },
  { href: '/kaart', label: 'Kaart' },
  { href: '/bestellen', label: 'Ontbijtbox' },
  { href: '/reserveren', label: 'Reserveren' },
  { href: '/galerij', label: 'Galerij' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteNav() {
  const tenant = useTenantOptional();
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

  const slug = tenant?.slug;
  const siteConfig = tenant?.siteConfig;
  const brandName = tenant?.name ?? 'de Zoete Wever';

  const links = tenant
    ? [
        { href: `/${slug}`, label: 'Thuis' },
        ...(siteConfig?.pages?.kaart?.length      ? [{ href: `/${slug}/kaart`,      label: 'Kaart' }]      : []),
        ...(siteConfig?.pages?.bestellen?.length  ? [{ href: `/${slug}/bestellen`,  label: 'Ontbijtbox' }] : []),
        ...(siteConfig?.pages?.reserveren?.length ? [{ href: `/${slug}/reserveren`, label: 'Reserveren' }] : []),
        ...(siteConfig?.pages?.contact?.length    ? [{ href: `/${slug}/contact`,    label: 'Contact' }]    : []),
      ]
    : fallbackLinks;

  const ctaHref = tenant ? `/${slug}/bestellen` : '/bestellen';
  const homeHref = tenant ? `/${slug}` : '/';

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="nav__inner">
        <Link className="brand" href={homeHref}>
          <span className="brand__mark">{brandName}</span>
          <span className="brand__name">est. Roeselare</span>
        </Link>

        <nav className="nav__links" aria-label="Hoofdmenu">
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

        <Link className="nav__cta" href={ctaHref}>
          Bestel ontbijtbox
          <span className="arrow" aria-hidden="true">→</span>
        </Link>

        <button
          className="nav__menu-btn"
          aria-expanded={open}
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav__hamburger${open ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {open && (
        <nav className="nav__mobile" aria-label="Mobiel menu">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link className="nav__mobile-cta" href={ctaHref}>
            Bestel ontbijtbox →
          </Link>
        </nav>
      )}
    </header>
  );
}
