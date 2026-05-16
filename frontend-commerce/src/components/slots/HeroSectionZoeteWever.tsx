'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';

const ribbonItems = [
  'home made granola',
  'ovenverse pistolets',
  'pancakes & poffertjes',
  'barista koffie',
  'vers fruitsap',
  'zondagsbuffet',
];

export default function HeroSectionZoeteWever() {
  const { slug } = useTenant();

  return (
    <section className="hero container">
      <div className="hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">Ontbijt · Koffie · Roeselare</span>
          <h1 className="hero__title" style={{ marginTop: '1.25rem' }}>
            Goeiemorgen,<br />
            <em>liefste</em><br />
            ochtend.
          </h1>
          <p className="lead">
            Een huiselijk ontbijthuis in het oude Café De&nbsp;Wever. Wij bakken alles
            waar jullie bij zitten — van ovenverse pistolets tot pancakes en home made
            granola — en schenken er de beste kop koffie van het Stationplein bij.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link className="btn btn--primary btn--lg" href={`/${slug}/kaart`}>
              Bekijk de kaart <span className="arrow">→</span>
            </Link>
            <Link className="btn btn--ghost btn--lg" href={`/${slug}/bestellen`}>
              Ontbijtbox bestellen
            </Link>
          </div>
          <dl className="hero__meta">
            <div>
              <dt>Open vandaag</dt>
              <dd>08:00 — 14:00</dd>
            </div>
            <div>
              <dt>Stationplein 37</dt>
              <dd>8800 Roeselare</dd>
            </div>
          </dl>
        </div>

        <div className="hero__photo">
          <div className="ph">
            <span>Hero photo · pancakes met verse fruit, in licht ochtendlicht (4×5)</span>
          </div>
          <div className="badge" aria-hidden="true">
            <span>Elke<br />zondag<br />buffet ✻</span>
          </div>
        </div>
      </div>

      <div className="hero__ribbon" aria-hidden="true">
        <div className="track">
          {[...ribbonItems, ...ribbonItems].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
