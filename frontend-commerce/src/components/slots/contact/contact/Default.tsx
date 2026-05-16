'use client';

import { useState } from 'react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function ContactSectionDefault() {
  const { name, slug } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API}/contact/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naam: fd.get('naam'),
          email: fd.get('mail'),
          telefoon: fd.get('telefoon') || undefined,
          onderwerp: fd.get('onderwerp'),
          bericht: fd.get('bericht'),
          tenantSlug: slug,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { message?: string };
        throw new Error(body.message ? String(body.message) : 'Versturen mislukt. Probeer opnieuw.');
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis.');
    } finally {
      setSubmitting(false);
    }
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
        {error && <p style={{ color: 'var(--color-error, red)', fontSize: '0.9rem' }}>{error}</p>}
        <button className="btn btn--jam" type="submit" disabled={submitting || sent}>
          {sent ? 'Verzonden ✻' : submitting ? 'Bezig…' : <>Verstuur <span className="arrow">→</span></>}
        </button>
      </form>
    </section>
  );
}
