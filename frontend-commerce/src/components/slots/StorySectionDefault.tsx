'use client';

import { useTenant } from '@/context/TenantContext';

export default function StorySectionDefault() {
  const { name } = useTenant();

  return (
    <section className="section container">
      <div className="story">
        <div className="story__caption">
          <span className="eyebrow">Ons verhaal</span>
          <h2>
            Met hart en<br />
            <em>vakmanschap</em>.
          </h2>
        </div>
        <div className="story__copy">
          <p>
            {name} is een plek waar kwaliteit en gastvrijheid centraal staan.
            We werken met verse ingrediënten en echte passie voor wat we doen.
          </p>
          <p>
            Kom gerust langs en ontdek het zelf.
          </p>
        </div>
      </div>
    </section>
  );
}
