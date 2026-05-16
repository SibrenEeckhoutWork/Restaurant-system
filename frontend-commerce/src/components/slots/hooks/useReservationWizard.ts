'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';

const API = process.env.NEXT_PUBLIC_API_URL!;

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  reservations?: { partySize: number }[];
}

export type WizardStep = 'date' | 'slot' | 'details' | 'done';

export const NL_MONTHS = [
  'Januari','Februari','Maart','April','Mei','Juni',
  'Juli','Augustus','September','Oktober','November','December',
];
export const NL_DAYS_SHORT = ['Ma','Di','Wo','Do','Vr','Za','Zo'];

export function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
export function todayIso() { return new Date().toISOString().slice(0, 10); }
export function monFirstOffset(jsday: number) { return jsday === 0 ? 6 : jsday - 1; }
export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function useReservationWizard() {
  const { slug } = useTenant();
  const [step, setStep] = useState<WizardStep>('date');

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

  async function submitReservation(e: { preventDefault(): void }) {
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

  function reset() {
    setStep('date'); setDate(''); setPartySize(2); setSlots([]);
    setSelectedSlot(null); setName(''); setEmail(''); setPhone(''); setNotes('');
    setCalendarRefreshKey((k) => k + 1);
  }

  const stepIndex = { date: 0, slot: 1, details: 2, done: 3 }[step];

  return {
    slug, step, setStep, stepIndex,
    date, setDate, partySize, changePartySize,
    availableDates, calLoading, handleMonthChange,
    loadingSlots, slotsError,
    slots, selectedSlot, setSelectedSlot, fetchSlots, slotBooked,
    name, setName, email, setEmail, phone, setPhone, notes, setNotes,
    submitting, submitError, submitReservation,
    reset,
  };
}
