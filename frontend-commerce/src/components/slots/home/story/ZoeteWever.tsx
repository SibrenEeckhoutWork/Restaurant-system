'use client';

import RevealSection from '@/components/marketing/RevealSection';

export default function StorySectionZoeteWever() {
  return (
    <RevealSection className="section container">
      <div className="story">
        <div className="story__caption">
          <span className="eyebrow">Het kindje van Marijke &amp; Gunther</span>
          <h2>
            Alsof je de keuken<br />
            van <em className="script-accent">vrienden</em> binnenwandelt.
          </h2>
          <div className="signature">
            <span style={{ fontSize: '2rem', lineHeight: '1' }}>— M &amp; G</span>
            <span
              className="mono"
              style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cocoa)' }}
            >
              Bakkers, sinds altijd
            </span>
          </div>
        </div>
        <div className="story__copy">
          <p>
            De Zoete Wever is het kindje van Marijke en Gunther. Met meer dan twintig jaar
            ervaring in de bakkerswereld is de liefde voor zoet altijd gebleven — en zo werd
            De Zoete Wever geboren.
          </p>
          <p>
            We gaan voor gezellig en huiselijk, maar vooral voor gewoon. We bakken alles
            waar jullie bij zitten. Gunther verdiepte zich in de pannenkoeken, poffertjes
            en pancakes; Marijke nam het koffie- en barista-gedeelte voor haar rekening.
          </p>
        </div>
      </div>
    </RevealSection>
  );
}
