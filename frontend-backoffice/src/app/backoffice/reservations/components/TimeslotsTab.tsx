'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { reservationsService, type ReservationSlot } from '@/services/reservations.service';
import { roomsService, type Room } from '@/services/rooms.service';

type Recurrence = 'daily' | 'weekly' | 'monthly';

const WEEK_DAYS = [
  { label: 'Ma', value: 1 },
  { label: 'Di', value: 2 },
  { label: 'Wo', value: 3 },
  { label: 'Do', value: 4 },
  { label: 'Vr', value: 5 },
  { label: 'Za', value: 6 },
  { label: 'Zo', value: 0 },
];

const RECURRENCE_LABELS: Record<Recurrence, string> = {
  daily: 'Dagelijks',
  weekly: 'Wekelijks',
  monthly: 'Maandelijks',
};

function recurrenceLabel(slot: ReservationSlot): string {
  if (slot.recurrence === 'weekly') {
    const days = (slot.daysOfWeek ?? [])
      .map((d) => WEEK_DAYS.find((w) => w.value === d)?.label ?? '')
      .filter(Boolean)
      .join(', ');
    return days || 'Wekelijks';
  }
  if (slot.recurrence === 'monthly') {
    return `Maandelijks (dag ${slot.monthDay ?? 1})`;
  }
  return 'Dagelijks';
}

function roomCapacity(room: Room): number {
  return (room.tables ?? []).reduce((sum, t) => sum + t.capacity, 0);
}

const emptyForm = () => ({
  startTime: '12:00',
  endTime: '14:00',
  roomIds: [] as string[],
  recurrence: 'daily' as Recurrence,
  daysOfWeek: [] as number[],
  monthDay: 1,
});

export function TimeslotsTab() {
  const [slots, setSlots] = useState<ReservationSlot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [slotsData, roomsData] = await Promise.all([
        reservationsService.getSlots(),
        roomsService.getAll(),
      ]);
      setSlots(slotsData);
      setRooms(roomsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleActive = async (slot: ReservationSlot) => {
    setToggling(slot.id);
    try {
      await reservationsService.updateSlot(slot.id, { isActive: !slot.isActive });
      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, isActive: !s.isActive } : s)),
      );
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (slot: ReservationSlot) => {
    if (!confirm(`Tijdslot ${slot.startTime}–${slot.endTime} verwijderen?`)) return;
    setDeleting(slot.id);
    try {
      await reservationsService.removeSlot(slot.id);
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } finally {
      setDeleting(null);
    }
  };

  const set = <K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    value: ReturnType<typeof emptyForm>[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const toggleRoom = (id: string) => {
    const ids = form.roomIds;
    set('roomIds', ids.includes(id) ? ids.filter((r) => r !== id) : [...ids, id]);
  };

  const toggleWeekDay = (day: number) => {
    const days = form.daysOfWeek;
    set('daysOfWeek', days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };

  const computedCapacity = rooms
    .filter((r) => form.roomIds.includes(r.id))
    .reduce((sum, r) => sum + roomCapacity(r), 0);

  const handleCreate = async () => {
    if (form.roomIds.length === 0) { setError('Selecteer minstens één ruimte.'); return; }
    if (!form.startTime || !form.endTime) { setError('Vul start- en eindtijd in.'); return; }
    if (form.recurrence === 'weekly' && form.daysOfWeek.length === 0) {
      setError('Selecteer minstens één weekdag.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await reservationsService.createSlot({
        startTime: form.startTime,
        endTime: form.endTime,
        roomIds: form.roomIds,
        recurrence: form.recurrence,
        daysOfWeek: form.recurrence === 'weekly' ? form.daysOfWeek : undefined,
        monthDay: form.recurrence === 'monthly' ? form.monthDay : undefined,
      });
      setPanelOpen(false);
      setForm(emptyForm());
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Tijdslots</h1>
            <p className="text-sm text-muted-foreground">Herbruikbare tijdslots per ruimte</p>
          </div>
          <Button
            size="sm"
            onClick={() => { setForm(emptyForm()); setError(null); setPanelOpen(true); }}
          >
            <Plus className="size-4 mr-2" />
            Nieuw tijdslot
          </Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tijdslot</TableHead>
                <TableHead>Herhaling</TableHead>
                <TableHead>Ruimtes</TableHead>
                <TableHead>Capaciteit</TableHead>
                <TableHead>Actief</TableHead>
                <TableHead className="w-16 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : slots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                    Geen tijdslots gevonden.
                  </TableCell>
                </TableRow>
              ) : (
                slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">
                      {slot.startTime}–{slot.endTime}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {recurrenceLabel(slot)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {(slot.rooms ?? []).length === 0 ? (
                          <span className="text-muted-foreground text-sm italic">—</span>
                        ) : (
                          (slot.rooms ?? []).map((r) => (
                            <Badge key={r.id} variant="secondary">{r.name}</Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{slot.maxCapacity}</TableCell>
                    <TableCell>
                      {toggling === slot.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          checked={slot.isActive}
                          onCheckedChange={() => handleToggleActive(slot)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(slot)}
                          disabled={deleting === slot.id}
                        >
                          {deleting === slot.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setPanelOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[460px] bg-background border-l shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-base">Nieuw tijdslot</h2>
              <Button variant="ghost" size="icon-sm" onClick={() => setPanelOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Recurrence */}
              <div className="space-y-1.5">
                <Label>Herhaling</Label>
                <div className="flex gap-1.5">
                  {(['daily', 'weekly', 'monthly'] as Recurrence[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => set('recurrence', r)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        form.recurrence === r
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {RECURRENCE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>

              {form.recurrence === 'weekly' && (
                <div className="space-y-1.5">
                  <Label>Weekdagen</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {WEEK_DAYS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => toggleWeekDay(value)}
                        className={`w-10 h-10 rounded-lg text-sm border transition-colors ${
                          form.daysOfWeek.includes(value)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.recurrence === 'monthly' && (
                <div className="space-y-1.5">
                  <Label>Dag van de maand</Label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={form.monthDay}
                    onChange={(e) => set('monthDay', parseInt(e.target.value, 10) || 1)}
                  />
                </div>
              )}

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Begintijd</Label>
                  <Input
                    value={form.startTime}
                    onChange={(e) => set('startTime', e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Eindtijd</Label>
                  <Input
                    value={form.endTime}
                    onChange={(e) => set('endTime', e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
              </div>

              {/* Room selection */}
              <div className="space-y-1.5">
                <Label>Ruimtes</Label>
                {rooms.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen ruimtes gevonden.</p>
                ) : (
                  <div className="space-y-2">
                    {rooms.map((room) => {
                      const cap = roomCapacity(room);
                      const selected = form.roomIds.includes(room.id);
                      return (
                        <button
                          key={room.id}
                          onClick={() => toggleRoom(room.id)}
                          className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors ${
                            selected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                selected ? 'bg-primary border-primary' : 'border-muted-foreground'
                              }`}
                            >
                              {selected && (
                                <svg className="size-2.5 text-primary-foreground" viewBox="0 0 10 10" fill="currentColor">
                                  <path d="M8.5 2.5L4 7.5L1.5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">{room.name}</span>
                          </div>
                          <div className="text-muted-foreground text-xs text-right">
                            <div>{room.tables?.length ?? 0} tafels</div>
                            <div>{cap} plaatsen</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {form.roomIds.length > 0 && (
                  <div className="rounded-lg bg-muted px-4 py-2 text-sm flex justify-between">
                    <span className="text-muted-foreground">Totale capaciteit</span>
                    <span className="font-semibold">{computedCapacity} plaatsen</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t space-y-2">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPanelOpen(false)}
                  disabled={saving}
                >
                  Annuleren
                </Button>
                <Button className="flex-1" onClick={handleCreate} disabled={saving}>
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Aanmaken
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
