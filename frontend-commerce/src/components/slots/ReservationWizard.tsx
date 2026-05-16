'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  reservations?: { partySize: number }[];
}

type Step = 'date' | 'slot' | 'details' | 'done';

const NL_MONTHS = [
  'Januari','Februari','Maart','April','Mei','Juni',
  'Juli','Augustus','September','Oktober','November','December',
];
const NL_DAYS_SHORT = ['Ma','Di','Wo','Do','Vr','Za','Zo'];

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function todayIso() { return new Date().toISOString().slice(0, 10); }
function monFirstOffset(jsday: number) { return jsday === 0 ? 6 : jsday - 1; }
function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

interface CalendarProps {
  value: string;
  onChange: (d: string) => void;
  availableDates: Set<string>;
  loading: boolean;
  onMonthChange: (year: number, month: number) => void;
}

function Calendar({ value, onChange, availableDates, loading, onMonthChange }: CalendarProps) {
  const today = todayIso();
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());

  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const firstJsDay = new Date(vy, vm, 1).getDay();
  const leadingBlanks = monFirstOffset(firstJsDay);
  const isCurrentMonth = vy === now.getFullYear() && vm === now.getMonth();

  function goMonth(dir: 1 | -1) {
    let ny = vy, nm = vm + dir;
    if (nm < 0)  { ny--; nm = 11; }
    if (nm > 11) { ny++; nm = 0;  }
    setVy(ny); setVm(nm);
    onMonthChange(ny, nm);
  }

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal">
      <div className="cal__nav">
        <button type="button" className="cal__nav-btn" onClick={() => goMonth(-1)}
          disabled={isCurrentMonth} aria-label="Vorige maand">←</button>
        <span className="cal__month">{NL_MONTHS[vm]} {vy}</span>
        <button type="button" className="cal__nav-btn" onClick={() => goMonth(1)}
          aria-label="Volgende maand">→</button>
      </div>

      <div className={`cal__grid${loading ? ' cal__grid--loading' : ''}`}>
        {NL_DAYS_SHORT.map(d => <span key={d} className="cal__head">{d}</span>)}
        {cells.map((day, idx) => {
          if (!day) return <span key={`b-${idx}`} />;
          const iso = toIso(vy, vm, day);
          const isPast = iso < today;
          const isSelected = iso === value;
          const isToday = iso === today;
          const isAvail = availableDates.has(iso);

          let cls = 'cal__day';
          if (isPast)       cls += ' is-past';
          else if (loading) cls += ' is-loading';
          else if (isAvail) cls += ' is-open';
          else              cls += ' is-closed';
          if (isSelected)   cls += ' is-selected';
          if (isToday)      cls += ' is-today';

          return (
            <button key={iso} type="button" className={cls}
              disabled={isPast || loading || !isAvail}
              onClick={() => onChange(iso)}
              aria-pressed={isSelected} aria-label={iso}>
              {day}
            </button>
          );
        })}
      </div>

      <div className="cal__legend">
        <span className="cal__legend-item cal__legend-item--open">Beschikbaar</span>
        <span className="cal__legend-item cal__legend-item--closed">Niet beschikbaar</span>
      </div>
    </div>
  );
}

export default function ReservationWizard() {
  const { slug } = useTenant();
  const [step, setStep] = useState<Step>('date');

  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [calLoading, setCalLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  const fetchAvailableDates = useCallback(async (year: number, month: number, party: number) => {
    setCalLoading(true);
    try {
      const res = await fetch(
        `${API}/reservations/available-dates?year=${year}&month=${month + 1}&partySize=${party}&tenantSlug=${slug}`,
      );
      if (!res.ok) throw new Error();
      const dates = (await res.json()) as string[];
      setAvailableDates(new Set(dates));
    } catch {
      setAvailableDates(new Set());
    } finally {
      setCalLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const now = new Date();
    fetchAvailableDates(now.getFullYear(), now.getMonth(), partySize);
  }, [partySize, fetchAvailableDates, calendarRefreshKey]);

  function handleMonthChange(year: number, month: number) {
    setDate('');
    setSlotsError('');
    fetchAvailableDates(year, month, partySize);
  }

  function changePartySize(delta: 1 | -1) {
    const next = Math.min(20, Math.max(1, partySize + delta));
    if (next === partySize) return;
    setPartySize(next);
    setDate('');
    setSlotsError('');
    setSlots([]);
  }

  async function fetchSlots() {
    if (!date) return;
    setLoadingSlots(true);
    setSlotsError('');
    try {
      const res = await fetch(
        `${API}/reservations/availability?date=${date}&partySize=${partySize}&tenantSlug=${slug}`,
      );
      if (!res.ok) throw new Error('Kon beschikbaarheid niet ophalen.');
      const data = (await res.json()) as Slot[];
      if (!data.length) {
        setSlotsError('Geen beschikbare tijdsloten op deze datum voor jouw gezelschap. Probeer een andere dag.');
        return;
      }
      setSlots(data);
      setSelectedSlot(null);
      setStep('slot');
    } catch (e) {
      setSlotsError(e instanceof Error ? e.message : 'Er ging iets mis.');
    } finally {
      setLoadingSlots(false);
    }
  }

  async function submitReservation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${API}/reservations/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, slotId: selectedSlot.id, partySize,
          guestName: name, guestEmail: email,
          guestPhone: phone || undefined,
          notes: notes || undefined,
          tenantSlug: slug,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { message?: string };
        const msg = body.message
          ? Array.isArray(body.message) ? body.message.join(', ') : body.message
          : 'Reservatie mislukt. Probeer opnieuw.';
        throw new Error(msg);
      }
      setStep('done');
      setCalendarRefreshKey((k) => k + 1);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Er ging iets mis.');
    } finally {
      setSubmitting(false);
    }
  }

  function slotBooked(slot: Slot) {
    return (slot.reservations ?? []).reduce((s, r) => s + r.partySize, 0);
  }

  const stepIndex = { date: 0, slot: 1, details: 2, done: 3 }[step];

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

      {step !== 'done' && (
        <div className="reserv-steps-bar">
          {['Datum', 'Tijdslot', 'Gegevens'].map((label, i) => (
            <div key={label}
              className={`reserv-step-item${i === stepIndex ? ' is-active' : ''}${i < stepIndex ? ' is-done' : ''}`}>
              <span className="reserv-step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="reserv-step-label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {step === 'date' && (
        <div className="reserv-card">
          <h2 className="reserv-card__title">Kies een datum</h2>
          <div className="reserv-party-row">
            <span className="reserv-label" style={{ display: 'block' }}>Aantal personen</span>
            <div className="reserv-stepper">
              <button type="button" className="reserv-stepper__btn"
                onClick={() => changePartySize(-1)} aria-label="Minder personen">−</button>
              <span className="reserv-stepper__val">{partySize}</span>
              <button type="button" className="reserv-stepper__btn"
                onClick={() => changePartySize(1)} aria-label="Meer personen">+</button>
            </div>
            {calLoading
              ? <span className="reserv-cal-hint">Beschikbaarheid laden…</span>
              : <span className="reserv-cal-hint">Kies hierna een groene datum</span>
            }
          </div>
          <Calendar
            value={date}
            onChange={(d) => { setDate(d); setSlotsError(''); }}
            availableDates={availableDates}
            loading={calLoading}
            onMonthChange={handleMonthChange}
          />
          {date && (
            <p className="reserv-date-selected" style={{ marginTop: '1rem' }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '0.35rem' }}>Geselecteerd</span>
              <em>{formatDate(date)}</em>
            </p>
          )}
          {slotsError && <p className="reserv-error" style={{ marginTop: '1rem' }}>{slotsError}</p>}
          <button className="btn btn--jam" style={{ marginTop: '1.5rem' }}
            disabled={!date || loadingSlots} onClick={fetchSlots}>
            {loadingSlots ? 'Laden…' : 'Bekijk tijdsloten'}
            {!loadingSlots && <span className="arrow">→</span>}
          </button>
        </div>
      )}

      {step === 'slot' && (
        <div className="reserv-card">
          <button className="reserv-back" onClick={() => setStep('date')}>← Terug</button>
          <h2 className="reserv-card__title">Kies een tijdslot</h2>
          <p style={{ color: 'var(--espresso-2)', marginBottom: '2rem' }}>
            {formatDate(date)} · {partySize} {partySize === 1 ? 'persoon' : 'personen'}
          </p>
          <div className="reserv-slots">
            {slots.map((slot) => {
              const remaining = slot.maxCapacity - slotBooked(slot);
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <button key={slot.id} type="button"
                  className={`reserv-slot${isSelected ? ' is-selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}>
                  <span className="reserv-slot__time">
                    {slot.startTime.slice(0, 5)} — {slot.endTime.slice(0, 5)}
                  </span>
                  <span className="reserv-slot__cap">
                    {remaining} {remaining === 1 ? 'plek' : 'plekken'} vrij
                  </span>
                </button>
              );
            })}
          </div>
          {selectedSlot && (selectedSlot.maxCapacity - slotBooked(selectedSlot)) < partySize && (
            <p className="reserv-error" style={{ marginTop: '1rem' }}>
              Dit tijdslot heeft onvoldoende capaciteit voor {partySize} personen.
            </p>
          )}
          <button className="btn btn--jam" style={{ marginTop: '2rem' }}
            disabled={!selectedSlot || (selectedSlot.maxCapacity - slotBooked(selectedSlot)) < partySize}
            onClick={() => setStep('details')}>
            Ga verder <span className="arrow">→</span>
          </button>
        </div>
      )}

      {step === 'details' && (
        <form className="reserv-card" onSubmit={submitReservation}>
          <button type="button" className="reserv-back" onClick={() => setStep('slot')}>← Terug</button>
          <h2 className="reserv-card__title">Jouw gegevens</h2>
          <div className="reserv-summary">
            <span>{formatDate(date)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{selectedSlot?.startTime.slice(0, 5)} — {selectedSlot?.endTime.slice(0, 5)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{partySize} {partySize === 1 ? 'persoon' : 'personen'}</span>
          </div>
          <div className="reserv-fields">
            <label className="reserv-label">
              Naam *
              <input className="reserv-input" type="text" required placeholder="Voor- en achternaam"
                value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="reserv-label">
              E-mail *
              <input className="reserv-input" type="email" required placeholder="naam@voorbeeld.be"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="reserv-label">
              Telefoon
              <input className="reserv-input" type="tel" placeholder="optioneel"
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="reserv-label reserv-label--full">
              Opmerking
              <textarea className="reserv-input reserv-input--textarea"
                placeholder="Allergieën, speciale wensen, gelegenheid…"
                value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </div>
          {submitError && <p className="reserv-error">{submitError}</p>}
          <button className="btn btn--jam" style={{ marginTop: '2rem' }}
            type="submit" disabled={submitting}>
            {submitting ? 'Bezig…' : 'Bevestig reservatie'}
            {!submitting && <span className="arrow">→</span>}
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="reserv-card reserv-card--success">
          <div className="reserv-success-mark">✻</div>
          <h2 className="reserv-card__title">Reservatie ontvangen!</h2>
          <p className="lead" style={{ margin: '1rem 0 0.5rem' }}>
            We bevestigen je reservatie zo snel mogelijk via e-mail.
          </p>
          <div className="reserv-summary" style={{ marginTop: '1.5rem' }}>
            <span>{formatDate(date)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{selectedSlot?.startTime.slice(0, 5)} — {selectedSlot?.endTime.slice(0, 5)}</span>
            <span className="reserv-summary__dot">·</span>
            <span>{partySize} {partySize === 1 ? 'persoon' : 'personen'}</span>
          </div>
          <p style={{ color: 'var(--espresso-2)', marginTop: '0.5rem' }}>
            Bevestiging gestuurd naar <strong>{email}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => {
              setStep('date'); setDate(''); setPartySize(2); setSlots([]);
              setSelectedSlot(null); setName(''); setEmail(''); setPhone(''); setNotes('');
              setCalendarRefreshKey((k) => k + 1);
            }}>
              Nieuwe reservatie
            </button>
            <a className="btn btn--ghost" href={`/${slug}`}>Terug naar home</a>
          </div>
        </div>
      )}
    </>
  );
}
