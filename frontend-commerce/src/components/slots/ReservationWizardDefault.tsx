'use client';

import { useReservationWizard, formatDate } from './hooks/useReservationWizard';
import Calendar from './Calendar';

export default function ReservationWizardDefault() {
  const w = useReservationWizard();

  return (
    <section className="section container" style={{ maxWidth: '640px' }}>
      {w.step !== 'done' && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {['Datum', 'Tijdslot', 'Gegevens'].map((label, i) => (
            <span key={label} style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: i === w.stepIndex ? 'var(--espresso)' : i < w.stepIndex ? 'var(--jam)' : 'var(--cream-2)',
              color: i <= w.stepIndex ? 'var(--cream)' : 'var(--cocoa)',
            }}>
              {i + 1}. {label}
            </span>
          ))}
        </div>
      )}

      {w.step === 'date' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Kies een datum</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Aantal personen</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button type="button" onClick={() => w.changePartySize(-1)} style={{ width: '2rem', height: '2rem', border: '1px solid var(--rule)', borderRadius: '0.25rem', cursor: 'pointer' }}>−</button>
              <span style={{ fontWeight: 600, minWidth: '2ch', textAlign: 'center' }}>{w.partySize}</span>
              <button type="button" onClick={() => w.changePartySize(1)} style={{ width: '2rem', height: '2rem', border: '1px solid var(--rule)', borderRadius: '0.25rem', cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <Calendar
            value={w.date}
            onChange={(d) => w.setDate(d)}
            availableDates={w.availableDates}
            loading={w.calLoading}
            onMonthChange={w.handleMonthChange}
          />
          {w.date && <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>{formatDate(w.date)}</p>}
          {w.slotsError && <p style={{ color: 'oklch(0.5 0.2 30)', marginTop: '1rem' }}>{w.slotsError}</p>}
          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }}
            disabled={!w.date || w.loadingSlots} onClick={w.fetchSlots}>
            {w.loadingSlots ? 'Laden…' : 'Bekijk tijdsloten →'}
          </button>
        </div>
      )}

      {w.step === 'slot' && (
        <div>
          <button onClick={() => w.setStep('date')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--jam)', marginBottom: '1rem' }}>← Terug</button>
          <h2 style={{ marginBottom: '0.5rem' }}>Kies een tijdslot</h2>
          <p style={{ color: 'var(--cocoa)', marginBottom: '1.5rem' }}>
            {formatDate(w.date)} · {w.partySize} {w.partySize === 1 ? 'persoon' : 'personen'}
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {w.slots.map((slot) => {
              const remaining = slot.maxCapacity - w.slotBooked(slot);
              const isSelected = w.selectedSlot?.id === slot.id;
              return (
                <button key={slot.id} type="button" onClick={() => w.setSelectedSlot(slot)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', border: `2px solid ${isSelected ? 'var(--jam)' : 'var(--rule)'}`,
                    borderRadius: '0.25rem', background: isSelected ? 'oklch(0.97 0.01 32)' : 'var(--cream)',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <span style={{ fontWeight: 500 }}>{slot.startTime.slice(0, 5)} — {slot.endTime.slice(0, 5)}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--cocoa)' }}>{remaining} {remaining === 1 ? 'plek' : 'plekken'} vrij</span>
                </button>
              );
            })}
          </div>
          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }}
            disabled={!w.selectedSlot} onClick={() => w.setStep('details')}>
            Ga verder →
          </button>
        </div>
      )}

      {w.step === 'details' && (
        <form onSubmit={w.submitReservation}>
          <button type="button" onClick={() => w.setStep('slot')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--jam)', marginBottom: '1rem' }}>← Terug</button>
          <h2 style={{ marginBottom: '1.5rem' }}>Jouw gegevens</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: 500 }}>Naam *</span>
              <input type="text" required placeholder="Voor- en achternaam" value={w.name} onChange={(e) => w.setName(e.target.value)} style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '0.25rem' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: 500 }}>E-mail *</span>
              <input type="email" required placeholder="naam@voorbeeld.be" value={w.email} onChange={(e) => w.setEmail(e.target.value)} style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '0.25rem' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: 500 }}>Telefoon</span>
              <input type="tel" placeholder="optioneel" value={w.phone} onChange={(e) => w.setPhone(e.target.value)} style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '0.25rem' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: 500 }}>Opmerking</span>
              <textarea placeholder="Allergieën, speciale wensen…" value={w.notes} onChange={(e) => w.setNotes(e.target.value)}
                style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '0.25rem', minHeight: '100px', resize: 'vertical' }} />
            </label>
          </div>
          {w.submitError && <p style={{ color: 'oklch(0.5 0.2 30)', marginTop: '1rem' }}>{w.submitError}</p>}
          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} type="submit" disabled={w.submitting}>
            {w.submitting ? 'Bezig…' : 'Bevestig reservatie →'}
          </button>
        </form>
      )}

      {w.step === 'done' && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2>Reservatie ontvangen!</h2>
          <p className="lead" style={{ margin: '1rem 0' }}>
            Bevestiging gestuurd naar <strong>{w.email}</strong>.
          </p>
          <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={w.reset}>
            Nieuwe reservatie
          </button>
        </div>
      )}
    </section>
  );
}
