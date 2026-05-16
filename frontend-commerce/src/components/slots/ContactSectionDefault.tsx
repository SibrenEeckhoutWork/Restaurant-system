'use client';

import { useTenant } from '@/context/TenantContext';

export default function ContactSectionDefault() {
  const { name } = useTenant();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (btn) { btn.textContent = 'Verzonden ✻'; btn.disabled = true; }
  }

  return (
    <section className="contact-grid">
      <div>
        <span className="eyebrow">Contact</span>
        <h1 style={{ marginTop: '1rem' }}>Neem <em>contact op</em>.</h1>
        <p className="lead">
          Vragen, reservaties of andere berichten? Stuur ons een bericht en we antwoorden zo snel mogelijk.
        </p>
        <dl className="contact-info" style={{ marginTop: '2rem' }}>
          <div>
            <dt>Zaak</dt>
            <dd>{name}</dd>
          </div>
        </dl>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Stuur een bericht</h3>
        <div className="form-row">
          <label>Naam<input type="text" name="naam" required placeholder="Je naam" /></label>
          <label>Telefoon<input type="tel" name="telefoon" placeholder="optioneel" /></label>
        </div>
        <label>E-mail<input type="email" name="mail" required placeholder="naam@voorbeeld.be" /></label>
        <label>Onderwerp
          <select name="onderwerp">
            <option>Reservatie</option>
            <option>Bestelling</option>
            <option>Andere</option>
          </select>
        </label>
        <label>Bericht<textarea name="bericht" required placeholder="Hoe kunnen we je helpen?" /></label>
        <button className="btn btn--jam" type="submit">Verstuur <span className="arrow">→</span></button>
      </form>
    </section>
  );
}
