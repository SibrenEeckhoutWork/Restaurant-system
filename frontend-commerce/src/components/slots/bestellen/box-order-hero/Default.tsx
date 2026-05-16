'use client';

export default function BoxOrderHeroDefault() {
  return (
    <section className="order-hero">
      <div>
        <span className="eyebrow">Bestel online</span>
        <h1 style={{ marginTop: '1rem' }}>
          Een <em>ontbijtbox</em> voor thuis.
        </h1>
        <p className="lead">
          Kies een formule, vul je gegevens in en wij zorgen voor de rest.
          Levering of afhaling — vers verpakt.
        </p>
        <div className="order-hero__actions">
          <a className="btn btn--jam btn--lg" href="#boxes">Kies je box <span className="arrow">↓</span></a>
          <a className="btn btn--ghost btn--lg" href="#hoe">Hoe werkt het?</a>
        </div>
      </div>
      <div className="order-hero__photo">
        <div className="ph"><span>Ontbijtbox foto</span></div>
      </div>
    </section>
  );
}
