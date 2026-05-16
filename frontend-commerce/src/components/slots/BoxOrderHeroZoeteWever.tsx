'use client';

export default function BoxOrderHeroZoeteWever() {
  return (
    <>
      <section className="order-hero">
        <div>
          <span className="eyebrow">Ontbijt aan huis</span>
          <h1 style={{ marginTop: '1rem' }}>
            Een <em>ontbijtbox</em> voor de mooiste ochtenden.
          </h1>
          <p className="lead">
            Verjaardag, moederdag, een team dat het verdiend heeft, of gewoon
            een lui weekend. Wij pakken het in, jij hoeft alleen de koffie te zetten.
          </p>
          <div className="order-hero__actions">
            <a className="btn btn--jam btn--lg" href="#boxes">Kies je box <span className="arrow">↓</span></a>
            <a className="btn btn--ghost btn--lg" href="#hoe">Hoe werkt het?</a>
          </div>
          <p className="mono" style={{ marginTop: '1.5rem', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--cocoa)' }}>
            Levering of afhaling · Roeselare &amp; omstreken · Min. 24u op voorhand
          </p>
        </div>
        <div className="order-hero__photo">
          <div className="ph"><span>Ontbijtbox geopend op tafel — pistolets, fruit, jam, sap (5×6)</span></div>
        </div>
      </section>
      <hr className="weave-rule" />
    </>
  );
}
