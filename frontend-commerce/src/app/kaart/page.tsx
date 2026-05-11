import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/marketing/SiteNav';
import RevealSection from '@/components/marketing/RevealSection';

export const metadata: Metadata = {
  title: 'Kaart — De Zoete Wever',
  description: 'De volledige kaart van De Zoete Wever — ontbijt, pancakes, granola, koffie en zoete bites.',
};

interface Allergy { id: string; name: string; icon: string | null }
interface AccessoryProduct { id: string; name: string; price: number }
interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  allergies: Allergy[];
  accessories: AccessoryProduct[];
}
interface MenuCategory { id: string; name: string; sortOrder: number; products: MenuItem[] }

async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: MenuCategory[] = await res.json();
    return data.filter((c) => !c.name.toLowerCase().includes('ontbijtbox'));
  } catch {
    return [];
  }
}

function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default async function KaartPage() {
  const categories = await getMenu();

  return (
    <>
      <SiteNav />

      <main style={{ flex: 1 }}>
        <div className="container">

          <div className="menu-head">
            <div>
              <span className="eyebrow">De volledige kaart</span>
              <h1 style={{ marginTop: '1rem' }}>De <em>kaart</em>.</h1>
            </div>
            <div className="menu-head__caption">
              <p className="lead">
                Alles wordt vers en met de hand gemaakt. Heb je een allergie of dieetwens?
                Laat het ons weten — we passen graag aan waar het kan.
              </p>
            </div>
          </div>

          {categories.length > 0 && (
            <nav className="menu-tabs" aria-label="Snel naar">
              {categories.map((cat) => (
                <a key={cat.id} href={`#cat-${cat.id}`}>{cat.name}</a>
              ))}
            </nav>
          )}

          {categories.length === 0 ? (
            <div style={{ padding: 'clamp(4rem,8vw,7rem) 0', textAlign: 'center' }}>
              <p className="lead" style={{ margin: '0 auto' }}>
                De kaart wordt binnenkort gepubliceerd.
              </p>
            </div>
          ) : (
            categories.map((cat, idx) => (
              <RevealSection key={cat.id} className="menu-section">
                <div id={`cat-${cat.id}`} style={{ scrollMarginTop: '120px' }} />
                <div className="menu-section__head">
                  <div>
                    <span className="eyebrow">№ {pad(idx + 1)}</span>
                    <h2 style={{ marginTop: '0.5rem' }}>{cat.name}.</h2>
                  </div>
                </div>

                <ul className="menu-list menu-list--two">
                  {cat.products.map((product) => (
                    <li key={product.id} className="menu-item">
                      <span className="menu-item__name">{product.name}</span>
                      <span className="menu-item__price">{formatPrice(product.price)}</span>
                      {product.description && (
                        <span className="menu-item__desc">{product.description}</span>
                      )}
                      {(product.allergies.length > 0 || product.accessories.length > 0) && (
                        <span className="menu-item__tags">
                          {product.allergies.map((a) => (
                            <span key={a.id}>{a.icon ? `${a.icon} ${a.name}` : a.name}</span>
                          ))}
                          {product.accessories.map((a) => (
                            <span key={a.id}>+ {a.name}</span>
                          ))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </RevealSection>
            ))
          )}

          <section style={{ padding: 'clamp(3rem,6vw,5rem) 0', textAlign: 'center' }}>
            <p className="lead" style={{ margin: '0 auto' }}>
              Liever ontbijten thuis?{' '}
              <Link href="/bestellen" style={{ color: 'var(--jam)' }}>
                Bestel onze ontbijtbox →
              </Link>
            </p>
          </section>

        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <div className="footer__brand-mark">de Zoete Wever</div>
              <p style={{ color: 'oklch(0.82 0.02 85)', maxWidth: '32ch', fontSize: '0.97rem' }}>
                Een huiselijk ontbijt- en koffiehuis op het Stationplein in Roeselare.
              </p>
            </div>
            <div>
              <h4>Bezoek</h4>
              <ul>
                <li>Stationplein 37</li>
                <li>8800 Roeselare</li>
                <li>BTW BE0795029717</li>
              </ul>
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
