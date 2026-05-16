'use client';

import { useTenant } from '@/context/TenantContext';

const placeholders = Array.from({ length: 6 }, (_, i) => i + 1);

export default function GallerySectionDefault() {
  const { name } = useTenant();

  return (
    <>
      <div className="gallery-head">
        <div>
          <span className="eyebrow">Galerij</span>
          <h1 style={{ marginTop: '1rem' }}>{name} <em>in beeld</em>.</h1>
        </div>
        <p className="lead">Foto&apos;s volgen binnenkort.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
        padding: 'clamp(2rem,4vw,4rem) 0',
      }}>
        {placeholders.map((i) => (
          <div key={i} className="ph" style={{ aspectRatio: '4/3', borderRadius: '0.25rem' }}>
            <span>Foto {i}</span>
          </div>
        ))}
      </div>
    </>
  );
}
