'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { roomsService, type Room, type CreateRoomPayload } from '@/services/rooms.service';

interface Props {
  mode: 'create' | 'edit' | null;
  room: Room | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: CreateRoomPayload = { name: '', capacity: 1 };

export function RoomPanel({ mode, room, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateRoomPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && room) {
      setForm({ name: room.name, capacity: room.capacity });
    } else if (mode === 'create') {
      setForm(EMPTY);
    }
    setError(null);
  }, [mode, room]);

  const set = (field: keyof CreateRoomPayload, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (mode === 'create') {
        await roomsService.create(form);
      } else {
        await roomsService.update(room!.id, form);
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
            {mode === 'create' ? 'Nieuwe ruimte' : 'Ruimte bewerken'}
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
              placeholder="Zaal A"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Capaciteit</Label>
            <Input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => set('capacity', parseInt(e.target.value, 10) || 1)}
              placeholder="20"
            />
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
