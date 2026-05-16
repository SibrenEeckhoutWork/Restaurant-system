'use client';

import RevealSection from '@/components/marketing/RevealSection';

const hours = [
  { day: 1, open: false, label: 'Maandag',         time: 'gesloten' },
  { day: 2, open: false, label: 'Dinsdag',         time: 'gesloten' },
  { day: 3, open: true,  label: 'Woensdag',        time: '08:00 — 15:00' },
  { day: 4, open: true,  label: 'Donderdag',       time: '08:00 — 15:00' },
  { day: 5, open: true,  label: 'Vrijdag',         time: '08:00 — 15:00' },
  { day: 6, open: true,  label: 'Zaterdag',        time: '08:00 — 15:00' },
  { day: 0, open: true,  label: 'Zondag · buffet', time: '08:00 / 10:00' },
];

export default function ContactSectionZoeteWever() {
  const today = new Date().getDay();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (btn) { btn.textContent = 'Verzonden ✻'; btn.disabled = true; }
  }

  return (
    <>
      <section className="contact-grid">
        <div>
          <span className="eyebrow">Even snel</span>
          <h1 style={{ marginTop: '1rem' }}>Zeg <em className="script-accent">hallo</em>.</h1>
          <p className="lead">
            Reservatie, een feestje in het zaaltje, een vraag over de ontbijtbox,
            of gewoon goesting in koffie? Bel, mail, of kom langs.
          </p>

          <dl className="contact-info">
            <div><dt>Adres</dt><dd>Stationplein 37<br />8800 Roeselare</dd></div>
            <div><dt>Bellen</dt><dd><a href="tel:+32497469065">+32 497 46 90 65</a></dd></div>
            <div><dt>Mailen</dt><dd><a href="mailto:hallo@dezoetewever.be">hallo@dezoetewever.be</a></dd></div>
            <div>
              <dt>Openingsuren</dt>
              <dd style={{ fontStyle: 'normal', fontSize: '1rem' }}>
                <ul className="hours-list" style={{ marginTop: '0.5rem' }}>
                  {hours.map((h) => (
                    <li key={h.day} data-day={h.day} data-open={String(h.open)}
                      className={h.open && h.day === today ? 'is-open' : undefined}>
                      <span>{h.label}</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Stuur een bericht</h3>
          <p style={{ color: 'var(--espresso-2)', fontSize: '0.97rem', marginTop: '-0.25rem' }}>
            We antwoorden meestal binnen één bakdag.
          </p>
          <div className="form-row">
            <label>Naam<input type="text" name="naam" required placeholder="Je naam" /></label>
            <label>Telefoon<input type="tel" name="telefoon" placeholder="optioneel" /></label>
          </div>
          <label>E-mail<input type="email" name="mail" required placeholder="naam@voorbeeld.be" /></label>
          <label>Onderwerp
            <select name="onderwerp">
              <option>Reservatie ontbijt</option>
              <option>Ontbijtbox</option>
              <option>Zaaltje huren</option>
              <option>Bedrijfsaanvraag</option>
              <option>Andere</option>
            </select>
          </label>
          <label>Bericht<textarea name="bericht" required placeholder="Vertel ons wat we voor je kunnen betekenen…" /></label>
          <button className="btn btn--jam" type="submit">Verstuur <span className="arrow">→</span></button>
        </form>
      </section>

      <RevealSection className="section">
        <hr className="weave-rule" />
        <div className="visit-grid" style={{ marginTop: '3rem' }}>
          <div className="visit-info">
            <span className="eyebrow">Vind ons terug</span>
            <h2 style={{ marginTop: '1rem' }}>Recht over het <em className="script-accent">station</em>.</h2>
            <p className="lead">
              Met de trein? Twee minuten. Met de fiets? Stalling vlakbij. Met de auto?
              Parking onder het Stationplein.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a className="btn btn--primary"
                href="https://maps.google.com/?q=Stationplein+37,8800+Roeselare"
                target="_blank" rel="noopener noreferrer">
                Open in Maps <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="visit-map">
            <iframe
              title="Kaart Stationplein 37 Roeselare"
              src="https://maps.google.com/maps?width=100%25&height=442px&hl=nl&q=Stationplein+37,8800+Roeselare&ie=UTF8&t=&z=15&iwloc=B&output=embed"
              style={{ width: '100%', height: '100%', border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </RevealSection>
    </>
  );
}
