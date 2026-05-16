'use client';

import { useReservationWizard, formatDate } from './hooks/useReservationWizard';
import Calendar from './Calendar';

export default function ReservationWizardZoeteWever() {
  const w = useReservationWizard();

  return (
    <>
      <div className="reserv-hero">
        <span className="eyebrow">Tafel reserveren</span>
        <h1 style={{ marginTop: '1rem' }}>
          Kom <em className="script-accent">ontbijten</em>.
        </h1>
        <p className="lead">
          Reserveer je plek aan tafel. We bevestigen zo snel mogelijk — meestal binnen één bakdag.
        </p>
      </div>

      {w.step !== 'done' && (
        <div className="reserv-steps-bar">
          {['Datum', 'Tijdslot', 'Gegevens'].map((label, i) => (
            <div key={label}
              className={`reserv-step-item${i === w.stepIndex ? ' is-active' : ''}${i < w.stepIndex ? ' is-done' : ''}`}>
              <span className="reserv-step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="reserv-step-label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {w.step === 'date' && (
        <div className="reserv-card">
          <h2 className="reserv-card__title">Kies een datum</h2>
          <div className="reserv-party-row">
            <span className="reserv-label" style={{ display: 'block' }}>Aantal personen</span>
            <div className="reserv-stepper">
              <button type="button" className="reserv-stepper__btn" onClick={() => w.changePartySize(-1)} aria-label="Minder personen">−</button>
              <span className="reserv-stepper__val">{w.partySize}</span>
              <button type="button" className="reserv-stepper__btn" onClick={() => w.changePartySize(1)} aria-label="Meer personen">+</button>
            </div>
            {w.calLoading
              ? <span className="reserv-cal-hint">Beschikbaarheid laden…</span>
              : <span className="reserv-cal-hint">Kies hierna een groene datum</span>
            }
          </div>
          <Calendar
            value={w.date}
            onChange={(d) => { w.setDate(d); }}
            availableDates={w.availableDates}
            loading={w.calLoading}
            onMonthChange={w.handleMonthChange}
          />
          {w.date && (
            <p className="reserv-date-selected" style={{ marginTop: '1rem' }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '0.35rem' }}>Geselecteerd</span>
              <em>{formatDate(w.date)}</em>
            </p>
          )}
          {w.slotsError && <p className="reserv-error" style={{ marginTop: '1rem' }}>{w.slotsError}</p>}
          <button className="btn btn--jam" style={{ marginTop: '1.5rem' }}
            disabled={!w.date || w.loadingSlots} onClick={w.fetchSlots}>
            {w.loadingSlots ? 'Laden…' : 'Bekijk tijdsloten'}
            {!w.loadingSlots && <span className="arrow">→</span>}
          </button>
        </div>
      )}

      {w.step === 'slot' && (
        <div className="reserv-card">
          <button className="reserv-back" onClick={() => w.setStep('date')}>← Terug</button>
          <h2 className="reserv-card__title">Kies een tijdslot</h2>
          <p style={{ color: 'var(--espresso-2)', marginBottom: '2rem' }}>
            {formatDate(w.date)} · {w.partySize} {w.partySize === 1 ? 'persoon' : 'personen'}
          </p>
          <div className="reserv-slots">
            {w.slots.map((slot) => {
              const remaining = slot.maxCapacity - w.slotBooked(slot);
              const isSelected = w.selectedSlot?.id === slot.id;
              return (
                <button key={slot.id} type="button"
                  className={`reserv-slot${isSelected ? ' is-selected' : ''}`}
                  onClick={() => w.setSelectedSlot(slot)}>
                  <span className="reserv-slot__time">{slot.startTime.slice(0, 5)} — {slot.endTime.slice(0, 5)}</span>
                  <span className="reserv-slot__cap">{remaining} {remaining === 1 ? 'plek' : 'plekken'} vrij</span>
                </button>
              );
            })}
          </div>
          {w.selectedSlot && (w.selectedSlot.maxCapacity - w.slotBooked(w.selectedSlot)) < w.partySize && (
            <p className="reserv-error" style={{ marginTop: '1rem' }}>
              Dit tijdslot heeft onvoldoende capaciteit voor {w.partySize} personen.
            </p>
          )}
          <button className="btn btn--jam" style={{ marginTop: '2rem' }}
            disabled={!w.selectedSlot || (w.selectedSlot.maxCapacity - w.slotBooked(w.selectedSlot)) < w.partySize}
            onClick={() => w.setStep('details')}>
            Ga verder <span className="arrow">→</span>
          </button>
        </div>
      )}

      {w.step === 'details' && (
        <form className="reserv-card" onSubmit={w.submitReservation}>
          <button type="button" className="reserv-back" onClick={() => w.setStep('slot')}>← Terug</button>
          <h2 className="reserv-card__title">Jouw gegevens</h2>
          <div className="reserv-summary">
            <span>{formatDate(w.date)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{w.selectedSlot?.startTime.slice(0, 5)} — {w.selectedSlot?.endTime.slice(0, 5)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{w.partySize} {w.partySize === 1 ? 'persoon' : 'personen'}</span>
          </div>
          <div className="reserv-fields">
            <label className="reserv-label">
              Naam *
              <input className="reserv-input" type="text" required placeholder="Voor- en achternaam" value={w.name} onChange={(e) => w.setName(e.target.value)} />
            </label>
            <label className="reserv-label">
              E-mail *
              <input className="reserv-input" type="email" required placeholder="naam@voorbeeld.be" value={w.email} onChange={(e) => w.setEmail(e.target.value)} />
            </label>
            <label className="reserv-label">
              Telefoon
              <input className="reserv-input" type="tel" placeholder="optioneel" value={w.phone} onChange={(e) => w.setPhone(e.target.value)} />
            </label>
            <label className="reserv-label reserv-label--full">
              Opmerking
              <textarea className="reserv-input reserv-input--textarea"
                placeholder="Allergieën, speciale wensen, gelegenheid…"
                value={w.notes} onChange={(e) => w.setNotes(e.target.value)} />
            </label>
          </div>
          {w.submitError && <p className="reserv-error">{w.submitError}</p>}
          <button className="btn btn--jam" style={{ marginTop: '2rem' }} type="submit" disabled={w.submitting}>
            {w.submitting ? 'Bezig…' : 'Bevestig reservatie'}
            {!w.submitting && <span className="arrow">→</span>}
          </button>
        </form>
      )}

      {w.step === 'done' && (
        <div className="reserv-card reserv-card--success">
          <div className="reserv-success-mark">✻</div>
          <h2 className="reserv-card__title">Reservatie ontvangen!</h2>
          <p className="lead" style={{ margin: '1rem 0 0.5rem' }}>
            We bevestigen je reservatie zo snel mogelijk via e-mail.
          </p>
          <div className="reserv-summary" style={{ marginTop: '1.5rem' }}>
            <span>{formatDate(w.date)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{w.selectedSlot?.startTime.slice(0, 5)} — {w.selectedSlot?.endTime.slice(0, 5)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{w.partySize} {w.partySize === 1 ? 'persoon' : 'personen'}</span>
          </div>
          <p style={{ color: 'var(--espresso-2)', marginTop: '0.5rem' }}>
            Bevestiging gestuurd naar <strong>{w.email}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={w.reset}>Nieuwe reservatie</button>
            <a className="btn btn--ghost" href={`/${w.slug}`}>Terug naar home</a>
          </div>
        </div>
      )}
    </>
  );
}
