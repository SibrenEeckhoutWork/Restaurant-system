import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/marketing/SiteNav';
import RevealSection from '@/components/marketing/RevealSection';
import BoxOrderSection from '@/components/marketing/BoxOrderSection';

export const metadata: Metadata = {
  title: 'Ontbijtbox — De Zoete Wever',
  description: 'Bestel een ontbijtbox van De Zoete Wever — voor thuis, voor het werk, voor een feestje.',
};

interface AccessoryProduct { id: string; name: string; price: number }
interface BoxProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  accessories: AccessoryProduct[];
}
interface MenuCategory { id: string; name: string; sortOrder: number; products: BoxProduct[] }

async function getBoxes(): Promise<BoxProduct[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: MenuCategory[] = await res.json();
    const cat = data.find((c) => c.name.toLowerCase().includes('ontbijtbox'));
    return cat?.products ?? [];
  } catch {
    return [];
  }
}


export default async function BestellenPage() {
  const boxes = await getBoxes();

  return (
    <>
      <SiteNav />

      <main className="container">

        <section className="order-hero">
          <div>
            <span className="eyebrow">Ontbijt aan huis</span>
            <h1 style={{ marginTop: '1rem' }}>Een <em>ontbijtbox</em> voor de mooiste ochtenden.</h1>
            <p className="lead">Verjaardag, moederdag, een team dat het verdiend heeft, of gewoon
            een lui weekend. Wij pakken het in, jij hoeft alleen de koffie te zetten.</p>
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

        <RevealSection className="section" id="boxes">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', marginBottom: '2.5rem' }}>
            <div>
              <span className="eyebrow">Drie formules</span>
              <h2 style={{ marginTop: '1rem' }}>Kies je <em className="script-accent">box</em>.</h2>
            </div>
            <p className="lead" style={{ maxWidth: '38ch' }}>Alle boxen worden &apos;s ochtends vers verpakt. Eet binnen de dag — zoals het hoort.</p>
          </div>

          <BoxOrderSection boxes={boxes} />
        </RevealSection>

        <RevealSection className="section bleed-cream-2" id="hoe">
          <div className="container">
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">Zo werkt het</span>
              <h2 style={{ marginTop: '1rem', maxWidth: '18ch' }}>Van bestelling tot <em className="script-accent">ontbijttafel</em>.</h2>
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

        <RevealSection className="section" id="bestelformulier">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(2rem,4vw,5rem)' }}>
            <div>
              <span className="eyebrow">Veelgestelde vragen</span>
              <h2 style={{ marginTop: '1rem' }}>Goed om te <em className="script-accent">weten</em>.</h2>
              <p className="lead" style={{ marginTop: '1.5rem' }}>Iets specifieks? Bel ons gerust — we denken graag mee.</p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a className="btn btn--primary" href="tel:+32497469065">+32 497 46 90 65</a>
                <Link className="btn btn--ghost" href="/contact">Neem contact op</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <details className="card" open>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>Hoeveel op voorhand bestellen?</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>Minimaal 24 uur op voorhand. Voor weekends en feestdagen: graag enkele dagen vroeger.</p>
              </details>
              <details className="card">
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>Tot waar leveren jullie?</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>Roeselare en omstreken (10 km). Buiten die zone: afhaling op het Stationplein 37.</p>
              </details>
              <details className="card">
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>Allergieën &amp; dieetwensen?</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>Vegetarisch, vegan, glutenvrij — meld het bij bestelling, we passen aan waar het kan.</p>
              </details>
              <details className="card">
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>Voor bedrijven?</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>Zeker. Voor teams vanaf 8 personen, met factuur. Vraag onze bedrijfsfolder aan via mail.</p>
              </details>
              <details className="card">
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--serif)', fontSize: '1.25rem', listStyle: 'none' }}>Hoe betaal ik?</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--espresso-2)' }}>Online via Bancontact, of bij afhaling cash of kaart. Een bevestigingsmail volgt steeds.</p>
              </details>
            </div>
          </div>
        </RevealSection>

      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <div className="footer__brand-mark">de Zoete Wever</div>
              <p style={{ color: 'oklch(0.82 0.02 85)', maxWidth: '32ch', fontSize: '0.97rem' }}>Een huiselijk ontbijt- en koffiehuis op het Stationplein in Roeselare.</p>
            </div>
            <div>
              <h4>Bezoek</h4>
              <ul><li>Stationplein 37</li><li>8800 Roeselare</li><li>BTW BE0795029717</li></ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="tel:+32497469065">+32 497 46 90 65</a></li>
                <li><a href="mailto:hallo@dezoetewever.be">hallo@dezoetewever.be</a></li>
              </ul>
            </div>
            <div>
              <h4>Volg ons</h4>
              <ul>
                <li><a href="https://www.instagram.com/dezoetewever/" target="_blank" rel="noopener noreferrer">Instagram →</a></li>
                <li><a href="https://www.facebook.com/dezoetewever" target="_blank" rel="noopener noreferrer">Facebook →</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 De Zoete Wever — Met liefde gebakken in Roeselare.</span>
            <span>Origineel ontwerp.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
