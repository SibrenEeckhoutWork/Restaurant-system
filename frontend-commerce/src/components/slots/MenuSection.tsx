'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import RevealSection from '@/components/marketing/RevealSection';

const API = process.env.NEXT_PUBLIC_API_URL!;

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

function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function MenuSection() {
  const { slug } = useTenant();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/menu?tenantSlug=${slug}`)
      .then((r) => r.ok ? r.json() as Promise<MenuCategory[]> : [])
      .then((data) => setCategories(data.filter((c) => !c.name.toLowerCase().includes('ontbijtbox'))))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
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

      {loading && (
        <p style={{ padding: 'clamp(4rem,8vw,7rem) 0', textAlign: 'center', color: 'var(--espresso-2)' }}>
          Laden…
        </p>
      )}

      {!loading && categories.length > 0 && (
        <nav className="menu-tabs" aria-label="Snel naar">
          {categories.map((cat) => (
            <a key={cat.id} href={`#cat-${cat.id}`}>{cat.name}</a>
          ))}
        </nav>
      )}

      {!loading && categories.length === 0 && (
        <div style={{ padding: 'clamp(4rem,8vw,7rem) 0', textAlign: 'center' }}>
          <p className="lead" style={{ margin: '0 auto' }}>
            De kaart wordt binnenkort gepubliceerd.
          </p>
        </div>
      )}

      {!loading && categories.map((cat, idx) => (
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
      ))}

      <section style={{ padding: 'clamp(3rem,6vw,5rem) 0', textAlign: 'center' }}>
        <p className="lead" style={{ margin: '0 auto' }}>
          Liever ontbijten thuis?{' '}
          <Link href={`/${slug}/bestellen`} style={{ color: 'var(--jam)' }}>
            Bestel onze ontbijtbox →
          </Link>
        </p>
      </section>
    </>
  );
}
