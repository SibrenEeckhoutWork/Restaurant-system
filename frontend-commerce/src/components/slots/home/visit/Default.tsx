'use client';

import RevealSection from '@/components/marketing/RevealSection';

export default function VisitSectionDefault() {
  return (
    <RevealSection className="section container">
      <div className="visit-grid">
        <div className="visit-info">
          <span className="eyebrow">Kom langs</span>
          <h2>Bezoek ons.</h2>
          <dl>
            <div><dt>Adres</dt><dd>—</dd></div>
            <div><dt>Bereikbaar</dt><dd>—</dd></div>
            <div><dt>Openingsuren</dt><dd>—</dd></div>
          </dl>
        </div>
        <div className="visit-map">
          <div className="ph"><span>Map placeholder</span></div>
        </div>
      </div>
    </RevealSection>
  );
}
