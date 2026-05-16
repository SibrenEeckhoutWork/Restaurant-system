'use client';

import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';
import RevealSection from '@/components/marketing/RevealSection';

const serveItems = [
  {
    num: '01',
    title: 'Home made',
    accent: 'granola',
    desc: 'Geroosterde haver, hazelnoten, zonnebloempit en een vleugje ahornsiroop. Met dikke yoghurt, vers fruit en een lepel huiscompote.',
    photo: 'Granola bowl met yoghurt, fruit, honing (4×5)',
  },
  {
    num: '02',
    title: 'Pancakes &',
    accent: 'poffertjes',
    desc: "Gunther's specialiteit. Lichte beslag, hete pan, een toef boter en een keuze tussen ahornsiroop, speculoos of seizoensconfituur.",
    photo: 'Stapel pancakes, gesmolten boter & sirop (4×5)',
  },
  {
    num: '03',
    title: 'Het traditioneel',
    accent: 'ontbijt',
    desc: 'Ovenverse pistolets, broodkoekjes, een glaasje vers fruitsap, gesneden fruit en de beste grote kop koffie van het plein.',
    photo: 'Traditioneel ontbijt — pistolets, fruit, sap (4×5)',
  },
];

export default function MenuPreviewSection() {
  const { slug } = useTenant();

  return (
    <>
      <RevealSection className="section container">
        <div className="story">
          <div className="story__caption">
            <span className="eyebrow">Het kindje van Marijke &amp; Gunther</span>
            <h2>
              Alsof je de keuken<br />
              van <em className="script-accent">vrienden</em> binnenwandelt.
            </h2>
            <div className="signature">
              <span style={{ fontSize: '2rem', lineHeight: '1' }}>— M &amp; G</span>
              <span
                className="mono"
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--cocoa)',
                }}
              >
                Bakkers, sinds altijd
              </span>
            </div>
          </div>
          <div className="story__copy">
            <p>
              De Zoete Wever is het kindje van Marijke en Gunther. Met meer dan twintig jaar
              ervaring in de bakkerswereld is de liefde voor zoet altijd gebleven — en zo werd
              De Zoete Wever geboren.
            </p>
            <p>
              We gaan voor gezellig en huiselijk, maar vooral voor gewoon. We bakken alles
              waar jullie bij zitten. Gunther verdiepte zich in de pannenkoeken, poffertjes
              en pancakes; Marijke nam het koffie- en barista-gedeelte voor haar rekening.
            </p>
          </div>
        </div>
      </RevealSection>

      <hr className="weave-rule" />

      <RevealSection className="section container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'end',
            marginBottom: '1rem',
          }}
        >
          <div>
            <span className="eyebrow">Wat staat er op je tafel</span>
            <h2 style={{ marginTop: '1rem' }}>
              Drie ontbijten,<br />één <em className="script-accent">verhaal</em>.
            </h2>
          </div>
          <Link className="btn btn--ghost" href={`/${slug}/kaart`}>
            Volledige kaart <span className="arrow">→</span>
          </Link>
        </div>
        <div className="serve-grid">
          {serveItems.map((item) => (
            <article key={item.num} className="serve-item">
              <div className="serve-item__photo">
                <div className="ph"><span>{item.photo}</span></div>
              </div>
              <span className="serve-item__num">№ {item.num}</span>
              <h3>
                {item.title} <em>{item.accent}</em>
              </h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </RevealSection>
    </>
  );
}
