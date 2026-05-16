'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';

export default function ReservationCTADefault() {
  const { slug } = useTenant();

  return (
    <section className="section container">
      <div style={{ padding: 'clamp(2rem,5vw,4rem)', background: 'var(--espresso)', color: 'var(--cream)', borderRadius: '0.5rem' }}>
        <span className="eyebrow" style={{ color: 'var(--cocoa)' }}>Reserveer</span>
        <h2 style={{ marginTop: '1rem', color: 'var(--cream)' }}>Reserveer een <em>tafel</em>.</h2>
        <p className="lead" style={{ marginTop: '1rem', color: 'oklch(0.80 0.01 85)' }}>
          Zeker van een plek? Reserveer online in enkele stappen.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link className="btn btn--jam" href={`/${slug}/reserveren`}>
            Reserveer nu <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
