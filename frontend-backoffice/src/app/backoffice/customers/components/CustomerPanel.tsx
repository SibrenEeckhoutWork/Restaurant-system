'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { customersService, type Customer, type CreateCustomerPayload, type UpdateCustomerPayload } from '@/services/customers.service';

interface Props {
  customer: Customer | null;
  mode: 'create' | 'edit' | null;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
}

const EMPTY: CreateCustomerPayload = { name: '', email: '', password: '', isActive: true };

export function CustomerPanel({ customer, mode, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateCustomerPayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setForm({ name: customer.name, email: customer.email, password: '', isActive: customer.isActive });
    } else if (mode === 'create') {
      setForm(EMPTY);
    }
    setError(null);
  }, [mode, customer]);

  const set = (field: keyof CreateCustomerPayload, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      let saved: Customer;
      if (mode === 'create') {
        saved = await customersService.create(form);
      } else {
        const payload: UpdateCustomerPayload = { ...form };
        if (!payload.password) delete payload.password;
        saved = await customersService.update(customer!.id, payload);
      }
      onSaved(saved);
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
            {mode === 'create' ? 'Nieuwe klant' : 'Klant bewerken'}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Naam</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jan Peeters" />
          </div>

          <div className="space-y-1.5">
            <Label>E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jan@example.be" />
          </div>

          <div className="space-y-1.5">
            <Label>{mode === 'edit' ? 'Nieuw wachtwoord (leeg = niet wijzigen)' : 'Wachtwoord'}</Label>
            <Input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label>Actief</Label>
            <Switch checked={form.isActive} onCheckedChange={(v) => set('isActive', v)} />
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
