'use client';

import RevealSection from '@/components/marketing/RevealSection';
import BoxOrderSection from '@/components/marketing/BoxOrderSection';
import { useBoxOrderData } from './hooks/useBoxOrderData';

export default function BoxOrderZoeteWever() {
  const { boxes, loading, slug } = useBoxOrderData();

  return (
    <RevealSection className="section" id="boxes">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', marginBottom: '2.5rem' }}>
        <div>
          <span className="eyebrow">Drie formules</span>
          <h2 style={{ marginTop: '1rem' }}>Kies je <em className="script-accent">box</em>.</h2>
        </div>
        <p className="lead" style={{ maxWidth: '38ch' }}>
          Alle boxen worden &apos;s ochtends vers verpakt. Eet binnen de dag — zoals het hoort.
        </p>
      </div>
      {loading
        ? <p style={{ color: 'var(--espresso-2)' }}>Laden…</p>
        : <BoxOrderSection boxes={boxes} tenantSlug={slug} />
      }
    </RevealSection>
  );
}
