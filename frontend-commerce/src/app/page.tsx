import Link from 'next/link';
import SiteNav from '@/components/marketing/SiteNav';
import RevealSection from '@/components/marketing/RevealSection';

const ribbonItems = [
  'home made granola',
  'ovenverse pistolets',
  'pancakes & poffertjes',
  'barista koffie',
  'vers fruitsap',
  'zondagsbuffet',
];

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

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <section className="hero container">
          <div className="hero__grid">
            <div className="hero__copy">
              <span className="eyebrow">Ontbijt · Koffie · Roeselare</span>
              <h1 className="hero__title" style={{ marginTop: '1.25rem' }}>
                Goeiemorgen,<br />
                <em>liefste</em><br />
                ochtend.
              </h1>
              <p className="lead">
                Een huiselijk ontbijthuis in het oude Café De&nbsp;Wever. Wij bakken alles
                waar jullie bij zitten — van ovenverse pistolets tot pancakes en home made
                granola — en schenken er de beste kop koffie van het Stationplein bij.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link className="btn btn--primary btn--lg" href="/kaart">
                  Bekijk de kaart <span className="arrow">→</span>
                </Link>
                <Link className="btn btn--ghost btn--lg" href="/bestellen">
                  Ontbijtbox bestellen
                </Link>
              </div>
              <dl className="hero__meta">
                <div>
                  <dt>Open vandaag</dt>
                  <dd>08:00 — 14:00</dd>
                </div>
                <div>
                  <dt>Stationplein 37</dt>
                  <dd>8800 Roeselare</dd>
                </div>
              </dl>
            </div>

            <div className="hero__photo">
              <div className="ph">
                <span>Hero photo · pancakes met verse fruit, in licht ochtendlicht (4×5)</span>
              </div>
              <div className="badge" aria-hidden="true">
                <span>Elke<br />zondag<br />buffet ✻</span>
              </div>
            </div>
          </div>

          <div className="hero__ribbon" aria-hidden="true">
            <div className="track">
              {[...ribbonItems, ...ribbonItems].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY ── */}
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
              <p>
                De bakkersmicrobe is nog steeds aanwezig. We verwennen jullie graag met
                ovenverse pistoletjes en koekjes, een glaasje fruitsap, vers gesneden fruit
                en een lekkere grote kop koffie.
              </p>
            </div>
          </div>
        </RevealSection>

        <hr className="weave-rule" />

        {/* ── SUNDAY BUFFET ── */}
        <RevealSection className="section container">
          <div className="buffet">
            <div>
              <span className="eyebrow" style={{ color: 'oklch(0.75 0.025 85)' }}>
                Iedere zondag
              </span>
              <h2 className="buffet__title" style={{ marginTop: '1rem' }}>
                Het <em>zondags-</em><br />buffet.
              </h2>
              <p className="lead">
                Onze keuken loopt over: ovenverse pistolets en koekjes, een eigen-receptenrek
                van granola en confituur, pancakes uit de pan, gesneden fruit, sap en de
                beste kop koffie. Reserveer je plek — het is altijd druk.
              </p>
              <dl className="buffet__hours">
                <dt>Eerste shift</dt>
                <dd>08:00 — 09:45</dd>
                <dt>Tweede shift</dt>
                <dd>10:00 — 12:00</dd>
              </dl>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link className="btn btn--jam" href="/contact">
                  Reserveer een tafel <span className="arrow">→</span>
                </Link>
                <Link
                  className="btn btn--ghost"
                  href="/kaart"
                  style={{ color: 'var(--cream)', borderColor: 'oklch(0.4 0.03 55)' }}
                >
                  Wat staat er op?
                </Link>
              </div>
            </div>
            <div className="buffet__art">
              <div className="ph ph--dark">
                <span>Buffet still life — broden, jam, koffie van bovenaf (1×1)</span>
              </div>
              <div className="stamp">vol = vol</div>
            </div>
          </div>
        </RevealSection>

        {/* ── WHAT WE SERVE ── */}
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
            <Link className="btn btn--ghost" href="/kaart">
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

        {/* ── HERITAGE ── */}
        <RevealSection className="section bleed-cream-2">
          <div className="container">
            <div className="heritage">
              <div className="heritage__year">
                1900<span style={{ color: 'var(--cocoa)' }}>·</span>
              </div>
              <div className="heritage__copy">
                <span className="eyebrow">Een knipoog naar de wever</span>
                <h3
                  style={{
                    fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)',
                    lineHeight: '1.15',
                    marginTop: '1rem',
                  }}
                >
                  Niet toevallig een verwijzing naar{' '}
                  <em className="script-accent">&ldquo;de wever&rdquo;</em>.
                </h3>
                <p>
                  De Zoete Wever heeft zijn onderkomen gevonden in het voormalig gebouw van{' '}
                  <em>Café De Wever</em>. Sinds 1900 is hier altijd café geweest, steeds onder
                  die naam — die op zijn beurt verwijst naar het boeiende weverijverleden dat
                  Roeselare rijk was.
                </p>
                <p>Hier en daar vind je nog een knipoog terug.</p>
              </div>
            </div>
            <div className="weave-strip" style={{ marginTop: '3rem' }} />
          </div>
        </RevealSection>

        {/* ── VISIT ── */}
        <RevealSection className="section container">
          <div className="visit-grid">
            <div className="visit-info">
              <span className="eyebrow">Kom langs</span>
              <h2>
                Een huis op het<br /><em className="script-accent">Stationplein</em>.
              </h2>
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
                    <small>
                      <a href="mailto:hallo@dezoetewever.be">hallo@dezoetewever.be</a>
                    </small>
                  </dd>
                </div>
                <div>
                  <dt>Openingsuren</dt>
                  <dd>
                    Wo–Za · 08:00 — 15:00
                    <small>
                      Zondag · buffet 08:00 / 10:00 — Maandag &amp; dinsdag gesloten
                    </small>
                  </dd>
                </div>
              </dl>
              <div style={{ marginTop: '1rem' }}>
                <Link className="btn btn--primary" href="/contact">
                  Reserveren &amp; contact <span className="arrow">→</span>
                </Link>
              </div>
            </div>
            <div className="visit-map">
              <div className="ph">
                <span>
                  Map embed · Stationplein 37, 8800 Roeselare — Google Maps iframe placeholder
                </span>
              </div>
            </div>
          </div>
        </RevealSection>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <div className="footer__brand-mark">de Zoete Wever</div>
              <p style={{ color: 'oklch(0.82 0.02 85)', maxWidth: '32ch', fontSize: '0.97rem' }}>
                Een huiselijk ontbijt- en koffiehuis op het Stationplein in Roeselare.
                Bakkerschap, koffie, gezelligheid.
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
                <li>
                  <a href="https://www.instagram.com/dezoetewever/" target="_blank" rel="noopener noreferrer">
                    Instagram →
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/dezoetewever" target="_blank" rel="noopener noreferrer">
                    Facebook →
                  </a>
                </li>
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
