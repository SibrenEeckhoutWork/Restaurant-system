'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  reservationsService,
  type Reservation,
} from '@/services/reservations.service';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  pending: 'In afwachting',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === 'pending' &&
          'border-yellow-400 text-yellow-700 bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:bg-yellow-900/20',
        status === 'confirmed' &&
          'border-green-400 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-400 dark:bg-green-900/20',
        status === 'cancelled' &&
          'border-red-400 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400 dark:bg-red-900/20',
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

interface Props {
  onSelect: (r: Reservation) => void;
  onCreate: () => void;
}

export function ReservationsList({ onSelect, onCreate }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reservationsService.getAll({
        date: dateFilter || undefined,
        status: statusFilter || undefined,
      });
      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await reservationsService.updateStatus(id, status);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: status as Reservation['status'] } : r)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reservaties</h1>
          <p className="text-sm text-muted-foreground">Overzicht van alle reservaties</p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="size-4 mr-2" />
          Nieuwe reservatie
        </Button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-44"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Alle statussen</option>
          <option value="pending">In afwachting</option>
          <option value="confirmed">Bevestigd</option>
          <option value="cancelled">Geannuleerd</option>
        </select>
        {(dateFilter || statusFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setDateFilter(''); setStatusFilter(''); }}
          >
            Wis filters
          </Button>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Tijdslot</TableHead>
              <TableHead>Gast</TableHead>
              <TableHead>Tafel</TableHead>
              <TableHead>Personen</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10 text-sm"
                >
                  Geen reservaties gevonden.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => onSelect(r)}
                >
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.slot ? `${r.slot.startTime}–${r.slot.endTime}` : '—'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{r.guestName}</span>
                      <div className="text-xs text-muted-foreground">{r.guestEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.table?.name ?? '—'}
                  </TableCell>
                  <TableCell>{r.partySize}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      {updatingId === r.id ? (
                        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                      ) : (
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">In afwachting</option>
                          <option value="confirmed">Bevestigd</option>
                          <option value="cancelled">Geannuleerd</option>
                        </select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
