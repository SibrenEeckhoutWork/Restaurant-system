'use client';

import { useMenuData, formatPrice } from './hooks/useMenuData';

export default function MenuSectionDefault() {
  const { categories, loading } = useMenuData();

  return (
    <>
      <div className="menu-head">
        <div>
          <span className="eyebrow">Menukaart</span>
          <h1 style={{ marginTop: '1rem' }}>Ons <em>aanbod</em>.</h1>
        </div>
      </div>

      {loading && (
        <p style={{ padding: 'clamp(4rem,8vw,7rem) 0', textAlign: 'center', color: 'var(--espresso-2)' }}>
          Laden…
        </p>
      )}

      {!loading && categories.length === 0 && (
        <div style={{ padding: 'clamp(4rem,8vw,7rem) 0', textAlign: 'center' }}>
          <p className="lead" style={{ margin: '0 auto' }}>
            De kaart wordt binnenkort gepubliceerd.
          </p>
        </div>
      )}

      {!loading && categories.map((cat) => (
        <section key={cat.id} style={{ padding: 'clamp(2rem,4vw,4rem) 0', borderBottom: '1px solid var(--rule)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{cat.name}</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
            {cat.products.map((product) => (
              <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{product.name}</span>
                  {product.description && (
                    <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--cocoa)', marginTop: '0.2rem' }}>
                      {product.description}
                    </span>
                  )}
                </div>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(product.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
