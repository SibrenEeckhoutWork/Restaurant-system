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
import { roomsService, type Room, type CreateRoomPayload } from '@/services/rooms.service';

interface Props {
  open: boolean;
  room: Room | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: CreateRoomPayload = { name: '', capacity: 1 };

export function RoomDialog({ open, room, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateRoomPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(room ? { name: room.name, capacity: room.capacity } : EMPTY);
      setError(null);
    }
  }, [open, room]);

  const set = (field: keyof CreateRoomPayload, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (room) {
        await roomsService.update(room.id, form);
      } else {
        await roomsService.create(form);
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
          <DialogTitle>{room ? 'Ruimte bewerken' : 'Nieuwe ruimte'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Annuleren
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            {room ? 'Opslaan' : 'Aanmaken'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
