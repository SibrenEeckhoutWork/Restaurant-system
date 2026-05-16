'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import RevealSection from '@/components/marketing/RevealSection';

export default function VisitSectionZoeteWever() {
  const { slug } = useTenant();

  return (
    <RevealSection className="section container">
      <div className="visit-grid">
        <div className="visit-info">
          <span className="eyebrow">Kom langs</span>
          <h2>Een huis op het<br /><em className="script-accent">Stationplein</em>.</h2>
          <dl>
            <div>
              <dt>Adres</dt>
              <dd>
                Stationplein 37<br />8800 Roeselare
                <small>Recht tegenover het station — fietsenstalling vlakbij.</small>
              </dd>
            </div>
            <div>
              <dt>Bereikbaar</dt>
              <dd>
                +32 497 46 90 65
                <small><a href="mailto:hallo@dezoetewever.be">hallo@dezoetewever.be</a></small>
              </dd>
            </div>
            <div>
              <dt>Openingsuren</dt>
              <dd>
                Wo–Za · 08:00 — 15:00
                <small>Zondag · buffet 08:00 / 10:00 — Maandag &amp; dinsdag gesloten</small>
              </dd>
            </div>
          </dl>
          <div style={{ marginTop: '1rem' }}>
            <Link className="btn btn--primary" href={`/${slug}/contact`}>
              Reserveren &amp; contact <span className="arrow">→</span>
            </Link>
          </div>
        </div>
        <div className="visit-map">
          <div className="ph">
            <span>Map embed · Stationplein 37, 8800 Roeselare — Google Maps iframe placeholder</span>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
