'use client';

import RevealSection from '@/components/marketing/RevealSection';

export default function BoxOrderStepsZoeteWever() {
  return (
    <RevealSection className="section bleed-cream-2" id="hoe">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow">Zo werkt het</span>
          <h2 style={{ marginTop: '1rem', maxWidth: '18ch' }}>
            Van bestelling tot <em className="script-accent">ontbijttafel</em>.
          </h2>
        </div>
        <div className="order-steps">
          <div className="order-step">
            <h3>Kies een box</h3>
            <p>Drie formules: licht, klassiek, of hartig. Voeg gerust extra&apos;s toe — een citroentaart, een pot granola.</p>
          </div>
          <div className="order-step">
            <h3>Vul je gegevens in</h3>
            <p>Voor wanneer, voor hoeveel personen, levering of afhaling. Allergieën? Vermeld het.</p>
          </div>
          <div className="order-step">
            <h3>Wij pakken het in</h3>
            <p>&apos;s Ochtends vers, in een mooie kartonnen box met servetten en een handgeschreven kaartje.</p>
          </div>
          <div className="order-step">
            <h3>Smakelijk eten</h3>
            <p>Levering tussen 7u en 10u, of afhaling op het Stationplein. Eet binnen de dag.</p>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
