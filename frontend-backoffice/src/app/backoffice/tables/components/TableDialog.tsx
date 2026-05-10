'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { tablesService, type Table, type CreateTablePayload } from '@/services/tables.service';
import { type Room } from '@/services/rooms.service';

interface Props {
  open: boolean;
  table: Table | null;
  rooms: Room[];
  onClose: () => void;
  onSaved: () => void;
}

export function TableDialog({ open, table, rooms, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateTablePayload>({ name: '', capacity: 1, roomId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        table
          ? { name: table.name, capacity: table.capacity, roomId: table.roomId }
          : { name: '', capacity: 1, roomId: rooms[0]?.id ?? '' },
      );
      setError(null);
    }
  }, [open, table, rooms]);

  const set = (field: keyof CreateTablePayload, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (table) {
        await tablesService.update(table.id, form);
      } else {
        await tablesService.create(form);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{table ? 'Tafel bewerken' : 'Nieuwe tafel'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Naam</Label>
            <Input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Tafel 1"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Capaciteit</Label>
            <Input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => set('capacity', parseInt(e.target.value, 10) || 1)}
              placeholder="4"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ruimte</Label>
            <select
              value={form.roomId}
              onChange={(e) => set('roomId', e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Annuleren
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            {table ? 'Opslaan' : 'Aanmaken'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
