'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tablesService, type Table, type CreateTablePayload } from '@/services/tables.service';
import { type Room } from '@/services/rooms.service';

interface Props {
  mode: 'create' | 'edit' | null;
  table: Table | null;
  rooms: Room[];
  onClose: () => void;
  onSaved: () => void;
}

export function TablePanel({ mode, table, rooms, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateTablePayload>({ name: '', capacity: 1, roomId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && table) {
      setForm({ name: table.name, capacity: table.capacity, roomId: table.roomId });
    } else if (mode === 'create') {
      setForm({ name: '', capacity: 1, roomId: rooms[0]?.id ?? '' });
    }
    setError(null);
  }, [mode, table, rooms]);

  const set = (field: keyof CreateTablePayload, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (mode === 'create') {
        await tablesService.create(form);
      } else {
        await tablesService.update(table!.id, form);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  };

  if (!mode) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-[420px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base">
            {mode === 'create' ? 'Nieuwe tafel' : 'Tafel bewerken'}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
        </div>

        <div className="px-6 py-4 border-t space-y-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              Annuleren
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Aanmaken' : 'Opslaan'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
