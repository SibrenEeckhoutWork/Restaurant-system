'use client';

export default function BoxOrderFaqDefault() {
  return (
    <section className="section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(2rem,4vw,5rem)' }}>
        <div>
          <span className="eyebrow">Veelgestelde vragen</span>
          <h2 style={{ marginTop: '1rem' }}>Goed om te <em>weten</em>.</h2>
          <p className="lead" style={{ marginTop: '1.5rem' }}>
            Nog vragen? Neem contact met ons op.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <details className="card" open>
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Hoeveel op voorhand bestellen?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Minimaal 24 uur op voorhand. Voor weekends graag enkele dagen vroeger.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Levering of afhaling?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Beide opties zijn beschikbaar. Geef je voorkeur op bij de bestelling.
            </p>
          </details>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>
              Allergieën &amp; dieetwensen?
            </summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>
              Vermeld ze bij de bestelling — we passen aan waar het kan.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
