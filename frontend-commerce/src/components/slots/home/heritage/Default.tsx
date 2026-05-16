'use client';

import { useTenant } from '@/context/TenantContext';

export default function HeritageSectionDefault() {
  const { name } = useTenant();

  return (
    <section className="section bleed-cream-2">
      <div className="container">
        <div className="heritage">
          <div className="heritage__year">
            ✻<span style={{ color: 'var(--cocoa)' }}>·</span>
          </div>
          <div className="heritage__copy">
            <span className="eyebrow">Onze achtergrond</span>
            <h3 style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)', lineHeight: 1.15, marginTop: '1rem' }}>
              Een plek met <em className="script-accent">geschiedenis</em>.
            </h3>
            <p>
              {name} heeft een verhaal. Ontdek de plek, de mensen en de passie
              achter wat we elke dag opnieuw voor jullie doen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
