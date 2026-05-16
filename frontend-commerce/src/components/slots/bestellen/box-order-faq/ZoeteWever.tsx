'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import RevealSection from '@/components/marketing/RevealSection';

export default function BoxOrderFaqZoeteWever() {
  const { slug } = useTenant();

  return (
    <RevealSection className="section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(2rem,4vw,5rem)' }}>
        <div>
          <span className="eyebrow">Veelgestelde vragen</span>
          <h2 style={{ marginTop: '1rem' }}>Goed om te <em className="script-accent">weten</em>.</h2>
          <p className="lead" style={{ marginTop: '1.5rem' }}>
            Iets specifieks? Bel ons gerust — we denken graag mee.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a className="btn btn--primary" href="tel:+32497469065">+32 497 46 90 65</a>
            <Link className="btn btn--ghost" href={`/${slug}/contact`}>Neem contact op</Link>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <details className="card" open>
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Hoeveel op voorhand bestellen?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Minimaal 24 uur op voorhand. Voor weekends en feestdagen: graag enkele dagen vroeger.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Tot waar leveren jullie?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Roeselare en omstreken (10 km). Buiten die zone: afhaling op het Stationplein 37.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Allergieën &amp; dieetwensen?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Vegetarisch, vegan, glutenvrij — meld het bij bestelling, we passen aan waar het kan.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Voor bedrijven?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Zeker. Voor teams vanaf 8 personen, met factuur. Vraag onze bedrijfsfolder aan via mail.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Hoe betaal ik?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Online via Bancontact, of bij afhaling cash of kaart. Een bevestigingsmail volgt steeds.
            </p>
          </details>
        </div>
      </div>
    </RevealSection>
  );
}
