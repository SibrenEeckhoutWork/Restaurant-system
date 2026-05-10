'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { reservationsService, type ReservationSlot, type Reservation } from '@/services/reservations.service';
import { cn } from '@/lib/utils';

type AgendaView = 'dag' | 'week' | 'maand';

const DAY_NL = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMondayOfWeek(anchor: Date): Date {
  const d = new Date(anchor);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthGrid(anchor: Date): Date[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const endOffset = (7 - lastDay.getDay()) % 7;
  const start = new Date(year, month, 1 - startOffset);
  const end = new Date(year, month + 1, endOffset);
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function getDatesInRange(fromDate: string, toDate: string): string[] {
  const dates: string[] = [];
  const [fy, fm, fd] = fromDate.split('-').map(Number);
  const [ty, tm, td] = toDate.split('-').map(Number);
  const cur = new Date(fy, fm - 1, fd);
  const end = new Date(ty, tm - 1, td);
  while (cur <= end) {
    dates.push(toDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function dateRangeForView(view: AgendaView, anchor: Date): { fromDate: string; toDate: string } {
  if (view === 'dag') {
    const d = toDateStr(anchor);
    return { fromDate: d, toDate: d };
  }
  if (view === 'week') {
    const mon = getMondayOfWeek(anchor);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { fromDate: toDateStr(mon), toDate: toDateStr(sun) };
  }
  const grid = getMonthGrid(anchor);
  return { fromDate: toDateStr(grid[0]), toDate: toDateStr(grid[grid.length - 1]) };
}

function slotMatchesDate(slot: ReservationSlot, dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  if (slot.recurrence === 'weekly') {
    return (slot.daysOfWeek ?? []).includes(d.getDay());
  }
  if (slot.recurrence === 'monthly') {
    return d.getDate() === (slot.monthDay ?? 1);
  }
  return true; // daily
}

function buildSlotsByDate(
  allSlots: ReservationSlot[],
  allReservations: Reservation[],
  dates: string[],
): Map<string, ReservationSlot[]> {
  const map = new Map<string, ReservationSlot[]>();
  dates.forEach((date) => {
    const dateRes = allReservations.filter((r) => r.date === date);
    const slotsForDate = allSlots
      .filter((s) => s.isActive && slotMatchesDate(s, date))
      .map((s) => ({
        ...s,
        reservations: dateRes.filter((r) => r.slotId === s.id),
      }));
    map.set(date, slotsForDate);
  });
  return map;
}

function slotBooked(slot: ReservationSlot): number {
  return (slot.reservations ?? [])
    .filter((r) => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.partySize, 0);
}

function SlotCard({
  slot,
  onSelectReservation,
  compact = false,
}: {
  slot: ReservationSlot;
  onSelectReservation: (r: Reservation) => void;
  compact?: boolean;
}) {
  const booked = slotBooked(slot);
  const pct = slot.maxCapacity > 0 ? booked / slot.maxCapacity : 0;
  const activeReservations = (slot.reservations ?? []).filter((r) => r.status !== 'cancelled');

  return (
    <div
      className={cn(
        'rounded-lg border text-xs space-y-1',
        compact ? 'p-1.5' : 'p-2.5',
        pct >= 1
          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          : pct >= 0.8
            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      )}
    >
      <div className="font-semibold text-foreground">
        {slot.startTime}–{slot.endTime}
      </div>
      <div className="text-muted-foreground">
        {booked}/{slot.maxCapacity}
        {(slot.rooms ?? []).length > 0 && (
          <span className="ml-1">· {slot.rooms!.map((r) => r.name).join(', ')}</span>
        )}
      </div>
      {!compact &&
        activeReservations.slice(0, 3).map((r) => (
          <button
            key={r.id}
            className="w-full text-left truncate text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => onSelectReservation(r)}
          >
            {r.guestName} ({r.partySize}p)
          </button>
        ))}
      {!compact && activeReservations.length > 3 && (
        <div className="text-muted-foreground">+{activeReservations.length - 3} meer</div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === 'pending' &&
          'border-yellow-400 text-yellow-700 bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400',
        status === 'confirmed' &&
          'border-green-400 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-400',
        status === 'cancelled' &&
          'border-red-400 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400',
      )}
    >
      {status === 'pending' ? 'Afwachting' : status === 'confirmed' ? 'Bevestigd' : 'Geannuleerd'}
    </Badge>
  );
}

// ── Day view ──────────────────────────────────────────────────────────────────

function DayView({
  date,
  slots,
  loading,
  onSelectReservation,
  onCreateReservation,
}: {
  date: string;
  slots: ReservationSlot[];
  loading: boolean;
  onSelectReservation: (r: Reservation) => void;
  onCreateReservation: (date: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-muted-foreground">Geen tijdslots op deze dag.</p>
        <Button size="sm" variant="outline" onClick={() => onCreateReservation(date)}>
          <Plus className="size-4 mr-2" />
          Reservatie toevoegen
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => onCreateReservation(date)}>
          <Plus className="size-4 mr-2" />
          Nieuwe reservatie
        </Button>
      </div>
      {slots.map((slot) => {
        const booked = slotBooked(slot);
        const pct = slot.maxCapacity > 0 ? booked / slot.maxCapacity : 0;
        const activeRes = (slot.reservations ?? []).filter((r) => r.status !== 'cancelled');

        return (
          <div key={slot.id} className="rounded-lg border overflow-hidden">
            <div
              className={cn(
                'flex items-center justify-between px-4 py-3',
                pct >= 1
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : pct >= 0.8
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-green-50 dark:bg-green-900/20',
              )}
            >
              <div>
                <span className="font-semibold text-sm">
                  {slot.startTime}–{slot.endTime}
                </span>
                {(slot.rooms ?? []).length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {slot.rooms!.map((r) => (
                      <Badge key={r.id} variant="secondary" className="text-xs">
                        {r.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-sm text-right">
                <div className="font-medium">
                  {booked}/{slot.maxCapacity} plaatsen
                </div>
              </div>
            </div>

            {activeRes.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Geen reservaties.
              </div>
            ) : (
              <div className="divide-y">
                {activeRes.map((r) => (
                  <button
                    key={r.id}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3 text-sm"
                    onClick={() => onSelectReservation(r)}
                  >
                    <StatusBadge status={r.status} />
                    <span className="font-medium">{r.guestName}</span>
                    <span className="text-muted-foreground">{r.partySize} personen</span>
                    {r.table && (
                      <span className="text-muted-foreground">{r.table.name}</span>
                    )}
                    {r.notes && (
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        · {r.notes}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Week view ─────────────────────────────────────────────────────────────────

function WeekView({
  anchor,
  slotsByDate,
  loading,
  onSelectReservation,
  onCreateReservation,
}: {
  anchor: Date;
  slotsByDate: Map<string, ReservationSlot[]>;
  loading: boolean;
  onSelectReservation: (r: Reservation) => void;
  onCreateReservation: (date: string) => void;
}) {
  const mon = getMondayOfWeek(anchor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
  const todayStr = toDateStr(new Date());

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day, idx) => {
        const ds = toDateStr(day);
        const daySlots = slotsByDate.get(ds) ?? [];
        const isToday = ds === todayStr;

        return (
          <div key={ds}>
            <button
              onClick={() => onCreateReservation(ds)}
              className={cn(
                'w-full text-center text-xs font-medium rounded-lg py-2 mb-2 group transition-colors',
                isToday
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              )}
              title={`Reservatie toevoegen op ${ds}`}
            >
              <div>{DAY_NL[idx]}</div>
              <div className="text-base font-semibold leading-tight">
                {day.getDate()}/{day.getMonth() + 1}
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-[10px] leading-tight mt-0.5">
                + reservatie
              </div>
            </button>

            <div className="space-y-1.5 min-h-[80px]">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </>
              ) : daySlots.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-4">—</div>
              ) : (
                daySlots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    onSelectReservation={onSelectReservation}
                    compact={false}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Month view ────────────────────────────────────────────────────────────────

function MonthView({
  anchor,
  slotsByDate,
  loading,
  onDayClick,
  onCreateReservation,
}: {
  anchor: Date;
  slotsByDate: Map<string, ReservationSlot[]>;
  loading: boolean;
  onDayClick: (d: Date) => void;
  onCreateReservation: (date: string) => void;
}) {
  const days = useMemo(() => getMonthGrid(anchor), [anchor]);
  const currentMonth = anchor.getMonth();
  const todayStr = toDateStr(new Date());

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NL.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
        {days.map((day) => {
          const ds = toDateStr(day);
          const daySlots = slotsByDate.get(ds) ?? [];
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = ds === todayStr;

          const totalBooked = daySlots.reduce(
            (sum, s) =>
              sum +
              (s.reservations ?? [])
                .filter((r) => r.status !== 'cancelled')
                .reduce((s2, r) => s2 + r.partySize, 0),
            0,
          );
          const totalCapacity = daySlots.reduce((sum, s) => sum + s.maxCapacity, 0);
          const fillPct = totalCapacity > 0 ? totalBooked / totalCapacity : 0;

          return (
            <div key={ds} className={cn('bg-background min-h-[80px] flex flex-col', !isCurrentMonth && 'opacity-40')}>
              {/* Day number — click to day view */}
              <button
                onClick={() => onDayClick(day)}
                className="flex items-center justify-between px-2 pt-2 pb-1 hover:bg-muted/40 transition-colors"
              >
                <div
                  className={cn(
                    'text-sm font-medium size-7 flex items-center justify-center rounded-full shrink-0',
                    isToday && 'bg-primary text-primary-foreground',
                  )}
                >
                  {day.getDate()}
                </div>
              </button>

              {/* Fill bar + add button */}
              <div className="px-2 pb-2 flex-1 flex flex-col gap-1">
                {loading ? (
                  <Skeleton className="h-3 w-full rounded mt-1" />
                ) : totalCapacity > 0 ? (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {totalBooked}/{totalCapacity}
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          fillPct >= 1
                            ? 'bg-red-500'
                            : fillPct >= 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500',
                        )}
                        style={{ width: `${Math.min(100, Math.round(fillPct * 100))}%` }}
                      />
                    </div>
                  </div>
                ) : null}
                <button
                  onClick={() => onCreateReservation(ds)}
                  className="mt-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 opacity-0 hover:opacity-100 group-hover:opacity-100"
                  title="Reservatie toevoegen"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  onSelectReservation: (r: Reservation) => void;
  onCreateReservation: (date: string) => void;
}

export function ReservationsAgenda({ onSelectReservation, onCreateReservation }: Props) {
  const [view, setView] = useState<AgendaView>('week');
  const [anchor, setAnchor] = useState(() => new Date());
  const [allSlots, setAllSlots] = useState<ReservationSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const { fromDate, toDate } = useMemo(
    () => dateRangeForView(view, anchor),
    [view, anchor],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [slotsData, resData] = await Promise.all([
        reservationsService.getSlots(),
        reservationsService.getAll({ fromDate, toDate }),
      ]);
      setAllSlots(slotsData);
      setReservations(resData);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => { load(); }, [load]);

  const dates = useMemo(() => getDatesInRange(fromDate, toDate), [fromDate, toDate]);

  const slotsByDate = useMemo(
    () => buildSlotsByDate(allSlots, reservations, dates),
    [allSlots, reservations, dates],
  );

  const navPrev = () => {
    const d = new Date(anchor);
    if (view === 'dag') d.setDate(d.getDate() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setAnchor(d);
  };

  const navNext = () => {
    const d = new Date(anchor);
    if (view === 'dag') d.setDate(d.getDate() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setAnchor(d);
  };

  const navLabel = () => {
    if (view === 'dag') {
      return anchor.toLocaleDateString('nl-BE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (view === 'week') {
      const mon = getMondayOfWeek(anchor);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      const fmt = (d: Date) =>
        d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
      return `${fmt(mon)} – ${fmt(sun)} ${mon.getFullYear()}`;
    }
    return anchor.toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' });
  };

  const handleDayClick = (day: Date) => {
    setAnchor(day);
    setView('dag');
  };

  const anchorDateStr = toDateStr(anchor);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">Agenda</h1>
          <p className="text-sm text-muted-foreground">Overzicht van tijdslots en reservaties</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border overflow-hidden text-sm">
            {(['dag', 'week', 'maand'] as AgendaView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 capitalize transition-colors',
                  view === v
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                )}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={navPrev}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium min-w-52 text-center px-1">
              {navLabel()}
            </span>
            <Button variant="outline" size="sm" onClick={navNext}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'dag' && (
        <DayView
          date={anchorDateStr}
          slots={slotsByDate.get(anchorDateStr) ?? []}
          loading={loading}
          onSelectReservation={onSelectReservation}
          onCreateReservation={onCreateReservation}
        />
      )}
      {view === 'week' && (
        <WeekView
          anchor={anchor}
          slotsByDate={slotsByDate}
          loading={loading}
          onSelectReservation={onSelectReservation}
          onCreateReservation={onCreateReservation}
        />
      )}
      {view === 'maand' && (
        <MonthView
          anchor={anchor}
          slotsByDate={slotsByDate}
          loading={loading}
          onDayClick={handleDayClick}
          onCreateReservation={onCreateReservation}
        />
      )}
    </div>
  );
}
