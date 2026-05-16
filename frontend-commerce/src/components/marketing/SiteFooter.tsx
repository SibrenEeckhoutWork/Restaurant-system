'use client';

import { useTenantOptional } from '@/context/TenantContext';

export default function SiteFooter() {
  const tenant = useTenantOptional();
  const name = tenant?.name ?? 'De Zoete Wever';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="footer__brand-mark">{name}</div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Origineel ontwerp.</span>
        </div>
      </div>
    </footer>
  );
}
