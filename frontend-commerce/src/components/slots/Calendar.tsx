'use client';

import { useState } from 'react';
import { NL_MONTHS, NL_DAYS_SHORT, toIso, todayIso, monFirstOffset } from './hooks/useReservationWizard';

interface CalendarProps {
  value: string;
  onChange: (d: string) => void;
  availableDates: Set<string>;
  loading: boolean;
  onMonthChange: (year: number, month: number) => void;
}

export default function Calendar({ value, onChange, availableDates, loading, onMonthChange }: CalendarProps) {
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
