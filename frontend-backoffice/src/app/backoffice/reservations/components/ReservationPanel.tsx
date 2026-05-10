'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  reservationsService,
  type Reservation,
  type ReservationSlot,
} from '@/services/reservations.service';
import { tablesService, type Table as TableType } from '@/services/tables.service';

interface Props {
  mode: 'create' | 'view' | null;
  reservation: Reservation | null;
  defaultDate?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function ReservationPanel({ mode, reservation, defaultDate, onClose, onSaved }: Props) {
  const [status, setStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullReservation, setFullReservation] = useState<Reservation | null>(null);
  const [loadingFull, setLoadingFull] = useState(false);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<ReservationSlot[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    slotId: '',
    tableId: '',
    partySize: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    notes: '',
  });

  useEffect(() => {
    setError(null);
    setFullReservation(null);
    if (mode === 'view' && reservation) {
      setStatus(reservation.status);
      setLoadingFull(true);
      reservationsService
        .getOne(reservation.id)
        .then(setFullReservation)
        .finally(() => setLoadingFull(false));
    } else if (mode === 'create') {
      setDate(defaultDate ?? '');
      setSlots([]);
      setForm({ slotId: '', tableId: '', partySize: 2, guestName: '', guestEmail: '', guestPhone: '', notes: '' });
      tablesService.getAll().then((t) => {
        setTables(t);
        setForm((f) => ({ ...f, tableId: t[0]?.id ?? '' }));
      });
    }
  }, [mode, reservation, defaultDate]);

  useEffect(() => {
    if (mode !== 'create' || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    reservationsService
      .getSlots({ date })
      .then((s) => {
        setSlots(s);
        setForm((f) => ({ ...f, slotId: s[0]?.id ?? '' }));
      })
      .finally(() => setLoadingSlots(false));
  }, [date, mode]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleStatusSave = async () => {
    if (!reservation) return;
    setSaving(true);
    setError(null);
    try {
      await reservationsService.updateStatus(reservation.id, status);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      await reservationsService.create({
        date,
        slotId: form.slotId,
        tableId: form.tableId,
        partySize: form.partySize,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone || undefined,
        notes: form.notes || undefined,
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  };

  if (!mode) return null;

  const selectedSlot = slots.find((s) => s.id === form.slotId);
  const slotBooked = selectedSlot
    ? (selectedSlot.reservations ?? []).reduce((sum, r) => sum + r.partySize, 0)
    : 0;
  const slotRemaining = selectedSlot ? selectedSlot.maxCapacity - slotBooked : 0;

  const r = fullReservation ?? reservation;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-[420px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base">
            {mode === 'create' ? 'Nieuwe reservatie' : 'Reservatie details'}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {mode === 'view' && reservation ? (
            <>
              {loadingFull ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  Laden...
                </div>
              ) : (
                <div className="rounded-lg border divide-y text-sm">
                  {([
                    ['Datum', r?.date ?? '—'],
                    [
                      'Tijdslot',
                      r?.slot ? `${r.slot.startTime}–${r.slot.endTime}` : '—',
                    ],
                    ['Tafel', r?.table?.name ?? '—'],
                    ['Personen', String(r?.partySize ?? '—')],
                    ['Naam', r?.guestName ?? '—'],
                    ['E-mail', r?.guestEmail ?? '—'],
                    ...(r?.guestPhone ? [['Telefoon', r.guestPhone]] : []),
                    ...(r?.customer ? [['Klant', r.customer.name]] : []),
                    ...(r?.notes ? [['Notities', r.notes]] : []),
                    [
                      'Aangemaakt',
                      r?.createdAt
                        ? new Date(r.createdAt).toLocaleDateString('nl-BE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '—',
                    ],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-right max-w-[60%] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Status aanpassen</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="pending">In afwachting</option>
                  <option value="confirmed">Bevestigd</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Datum</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {date && (
                <div className="space-y-1.5">
                  <Label>Tijdslot</Label>
                  {loadingSlots ? (
                    <p className="text-sm text-muted-foreground">Laden...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Geen actieve tijdslots voor deze datum.
                    </p>
                  ) : (
                    <>
                      <select
                        value={form.slotId}
                        onChange={(e) => setField('slotId', e.target.value)}
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {slots.map((s) => {
                          const booked = (s.reservations ?? []).reduce((sum, r) => sum + r.partySize, 0);
                          return (
                            <option key={s.id} value={s.id}>
                              {s.startTime}–{s.endTime} · {booked}/{s.maxCapacity} bezet
                              {(s.rooms ?? []).length > 0 && ` · ${s.rooms!.map((r) => r.name).join(', ')}`}
                            </option>
                          );
                        })}
                      </select>
                      {selectedSlot && (
                        <p className="text-xs text-muted-foreground">
                          {slotRemaining} {slotRemaining === 1 ? 'plaats' : 'plaatsen'} beschikbaar
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Tafel</Label>
                <select
                  value={form.tableId}
                  onChange={(e) => setField('tableId', e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Selecteer een tafel</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (max {t.capacity}p)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Aantal personen</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.partySize}
                  onChange={(e) => setField('partySize', parseInt(e.target.value, 10) || 1)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Naam gast</Label>
                <Input
                  value={form.guestName}
                  onChange={(e) => setField('guestName', e.target.value)}
                  placeholder="Jan Janssen"
                />
              </div>

              <div className="space-y-1.5">
                <Label>E-mailadres</Label>
                <Input
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => setField('guestEmail', e.target.value)}
                  placeholder="jan@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Telefoonnummer (optioneel)</Label>
                <Input
                  value={form.guestPhone}
                  onChange={(e) => setField('guestPhone', e.target.value)}
                  placeholder="+32 ..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Notities (optioneel)</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Allergieën, speciale verzoeken..."
                />
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t space-y-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              Annuleren
            </Button>
            <Button
              className="flex-1"
              onClick={mode === 'create' ? handleCreate : handleStatusSave}
              disabled={
                saving ||
                (mode === 'create' &&
                  (!form.slotId || !form.tableId || !form.guestName || !form.guestEmail))
              }
            >
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Aanmaken' : 'Opslaan'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
