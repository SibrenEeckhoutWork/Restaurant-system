'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';

export default function HeroSectionDefault() {
  const { slug, name } = useTenant();

  return (
    <section className="hero container">
      <div style={{ maxWidth: '640px', padding: 'clamp(4rem,8vw,7rem) 0' }}>
        <h1 className="hero__title">
          Welkom bij<br />
          <em>{name}</em>.
        </h1>
        <p className="lead" style={{ marginTop: '1.5rem' }}>
          Ontdek ons aanbod en reserveer een tafel of bestel online.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link className="btn btn--primary btn--lg" href={`/${slug}/kaart`}>
            Bekijk de kaart <span className="arrow">→</span>
          </Link>
          <Link className="btn btn--ghost btn--lg" href={`/${slug}/reserveren`}>
            Reserveer een tafel
          </Link>
        </div>
      </div>
    </section>
  );
}
