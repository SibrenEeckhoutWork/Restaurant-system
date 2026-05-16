'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import RevealSection from '@/components/marketing/RevealSection';

export default function ReservationCTA() {
  const { slug } = useTenant();

  return (
    <RevealSection className="section container">
      <div className="buffet">
        <div>
          <span className="eyebrow" style={{ color: 'oklch(0.75 0.025 85)' }}>
            Iedere zondag
          </span>
          <h2 className="buffet__title" style={{ marginTop: '1rem' }}>
            Het <em>zondags-</em><br />buffet.
          </h2>
          <p className="lead">
            Onze keuken loopt over: ovenverse pistolets en koekjes, een eigen-receptenrek
            van granola en confituur, pancakes uit de pan, gesneden fruit, sap en de
            beste kop koffie. Reserveer je plek — het is altijd druk.
          </p>
          <dl className="buffet__hours">
            <dt>Eerste shift</dt>
            <dd>08:00 — 09:45</dd>
            <dt>Tweede shift</dt>
            <dd>10:00 — 12:00</dd>
          </dl>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link className="btn btn--jam" href={`/${slug}/reserveren`}>
              Reserveer een tafel <span className="arrow">→</span>
            </Link>
            <Link
              className="btn btn--ghost"
              href={`/${slug}/kaart`}
              style={{ color: 'var(--cream)', borderColor: 'oklch(0.4 0.03 55)' }}
            >
              Wat staat er op?
            </Link>
          </div>
        </div>
        <div className="buffet__art">
          <div className="ph ph--dark">
            <span>Buffet still life — broden, jam, koffie van bovenaf (1×1)</span>
          </div>
          <div className="stamp">vol = vol</div>
        </div>
      </div>
    </RevealSection>
  );
}
