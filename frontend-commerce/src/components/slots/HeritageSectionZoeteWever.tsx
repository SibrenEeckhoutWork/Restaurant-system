'use client';

import RevealSection from '@/components/marketing/RevealSection';

export default function HeritageSectionZoeteWever() {
  return (
    <RevealSection className="section bleed-cream-2">
      <div className="container">
        <div className="heritage">
          <div className="heritage__year">
            1900<span style={{ color: 'var(--cocoa)' }}>·</span>
          </div>
          <div className="heritage__copy">
            <span className="eyebrow">Een knipoog naar de wever</span>
            <h3 style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)', lineHeight: 1.15, marginTop: '1rem' }}>
              Niet toevallig een verwijzing naar{' '}
              <em className="script-accent">&ldquo;de wever&rdquo;</em>.
            </h3>
            <p>
              De Zoete Wever heeft zijn onderkomen gevonden in het voormalig gebouw van{' '}
              <em>Café De Wever</em>. Sinds 1900 is hier altijd café geweest, steeds onder
              die naam — die op zijn beurt verwijst naar het boeiende weverijverleden dat
              Roeselare rijk was.
            </p>
            <p>Hier en daar vind je nog een knipoog terug.</p>
          </div>
        </div>
        <div className="weave-strip" style={{ marginTop: '3rem' }} />
      </div>
    </RevealSection>
  );
}
