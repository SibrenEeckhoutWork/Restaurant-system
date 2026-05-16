'use client';

import RevealSection from '@/components/marketing/RevealSection';

const gridItems = [
  { cls: 'g-1',  label: 'Hero — pancakes met boter (groot, 5×4)' },
  { cls: 'g-2',  label: 'Espresso — close-up op de bar' },
  { cls: 'g-3',  label: 'Granola pot — staand stilleven' },
  { cls: 'g-4',  label: 'Marijke achter de machine' },
  { cls: 'g-5',  label: 'Het traditioneel ontbijt — boven (groot)' },
  { cls: 'g-6',  label: 'Pistolets uit de oven' },
  { cls: 'g-7',  label: 'Bos verse bloemen op de bar' },
  { cls: 'g-8',  label: 'Zaaltje — gedekte tafel (panorama)' },
  { cls: 'g-9',  label: 'Detail — speculoospasta + lepel' },
  { cls: 'g-10', label: 'Gunther bij de pancakepan' },
  { cls: 'g-11', label: 'Zondagsbuffet — broden, jam (groot)' },
  { cls: 'g-12', label: 'De gevel op het Stationplein' },
  { cls: 'g-13', label: 'Vrienden aan tafel, lachende ochtend' },
];

export default function GallerySectionZoeteWever() {
  return (
    <>
      <div className="gallery-head">
        <div>
          <span className="eyebrow">Het huis op beeld</span>
          <h1 style={{ marginTop: '1rem' }}>Een paar <em className="script-accent">ochtenden</em>.</h1>
        </div>
        <p className="lead">
          Foto&apos;s uit de zaak, van de tafel, de pannen, het zaaltje en het volk.
        </p>
      </div>

      <RevealSection className="gallery-grid">
        {gridItems.map((item) => (
          <div key={item.cls} className={`g-item ${item.cls}`}>
            <div className="ph"><span>{item.label}</span></div>
          </div>
        ))}
      </RevealSection>

      <RevealSection className="section center-text">
        <span className="eyebrow">Volg de keuken</span>
        <h2 style={{ marginTop: '1rem' }}>Op <em className="script-accent">Instagram</em> &amp; Facebook.</h2>
        <p className="lead" style={{ margin: '1.5rem auto 2rem' }}>
          @dezoetewever — voor het dagelijks bord, een aankondiging van de zondagstaart,
          en de occasionele knipoog uit de keuken.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn--primary" href="https://www.instagram.com/dezoetewever/" target="_blank" rel="noopener noreferrer">
            Instagram <span className="arrow">→</span>
          </a>
          <a className="btn btn--ghost" href="https://www.facebook.com/dezoetewever" target="_blank" rel="noopener noreferrer">
            Facebook <span className="arrow">→</span>
          </a>
        </div>
      </RevealSection>
    </>
  );
}
