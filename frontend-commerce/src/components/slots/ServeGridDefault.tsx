'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import { useMenuData, formatPrice } from './hooks/useMenuData';

export default function ServeGridDefault() {
  const { slug } = useTenant();
  const { categories, loading } = useMenuData();

  const items = categories.flatMap((c) => c.products).slice(0, 3);

  return (
    <section className="section container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', marginBottom: '1rem' }}>
        <div>
          <span className="eyebrow">Ons aanbod</span>
          <h2 style={{ marginTop: '1rem' }}>Wat staat er<br />op de kaart.</h2>
        </div>
        <Link className="btn btn--ghost" href={`/${slug}/kaart`}>
          Volledige kaart <span className="arrow">→</span>
        </Link>
      </div>

      {loading && <p style={{ color: 'var(--espresso-2)' }}>Laden…</p>}

      {!loading && items.length === 0 && (
        <p style={{ color: 'var(--cocoa)' }}>Kaart wordt binnenkort gepubliceerd.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="serve-grid">
          {items.map((item, i) => (
            <article key={item.id} className="serve-item">
              <div className="serve-item__photo">
                <div className="ph"><span>{item.name}</span></div>
              </div>
              <span className="serve-item__num">№ 0{i + 1}</span>
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
              <p style={{ fontWeight: 600 }}>{formatPrice(item.price)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
