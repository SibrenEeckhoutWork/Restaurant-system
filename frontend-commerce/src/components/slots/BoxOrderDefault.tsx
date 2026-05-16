'use client';

import BoxOrderSection from '@/components/marketing/BoxOrderSection';
import { useBoxOrderData } from './hooks/useBoxOrderData';

export default function BoxOrderDefault() {
  const { boxes, loading, slug } = useBoxOrderData();

  return (
    <section className="section container">
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="eyebrow">Bestel online</span>
        <h1 style={{ marginTop: '1rem' }}>Ons <em>aanbod</em>.</h1>
        <p className="lead" style={{ marginTop: '1rem' }}>
          Kies een formule en bestel direct online.
        </p>
      </div>

      {loading
        ? <p style={{ color: 'var(--espresso-2)' }}>Laden…</p>
        : boxes.length === 0
          ? <p style={{ color: 'var(--cocoa)' }}>Nog geen producten beschikbaar.</p>
          : <BoxOrderSection boxes={boxes} tenantSlug={slug} />
      }
    </section>
  );
}
