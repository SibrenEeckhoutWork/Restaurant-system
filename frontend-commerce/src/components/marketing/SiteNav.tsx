'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenantOptional } from '@/context/TenantContext';

const fallbackLinks = [
  { href: '/', label: 'Thuis', children: [] },
  { href: '/kaart', label: 'Kaart', children: [] },
  { href: '/bestellen', label: 'Ontbijtbox', children: [] },
  { href: '/reserveren', label: 'Reserveren', children: [] },
  { href: '/galerij', label: 'Galerij', children: [] },
  { href: '/contact', label: 'Contact', children: [] },
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
    ? Object.entries(siteConfig?.nav?.items ?? {})
        .filter(([, item]) => item.active)
        .sort(([, a], [, b]) => (a.order ?? 99) - (b.order ?? 99))
        .map(([key, item]) => {
          const segment = item.path ?? key;
          return {
            href: key === 'home' ? `/${slug}` : `/${slug}/${segment}`,
            label: item.label ?? key,
            children: (item.children ?? []).filter((c) => c.active),
          };
        })
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
