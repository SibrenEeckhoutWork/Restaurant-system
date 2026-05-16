'use client';

export default function BoxOrderStepsDefault() {
  return (
    <section className="section bleed-cream-2" id="hoe">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="eyebrow">Zo werkt het</span>
          <h2 style={{ marginTop: '1rem', maxWidth: '18ch' }}>
            Stap voor stap naar <em>jouw box</em>.
          </h2>
        </div>
        <div className="order-steps">
          <div className="order-step">
            <h3>Kies een box</h3>
            <p>Bekijk het aanbod en selecteer de formule die bij jou past.</p>
          </div>
          <div className="order-step">
            <h3>Vul je gegevens in</h3>
            <p>Datum, aantal personen, levering of afhaling. Allergieën? Vermeld het.</p>
          </div>
          <div className="order-step">
            <h3>Wij maken het klaar</h3>
            <p>Vers verpakt op de afgesproken dag.</p>
          </div>
          <div className="order-step">
            <h3>Smakelijk eten</h3>
            <p>Ophalen of geleverd aan de deur. Eet binnen de dag.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
