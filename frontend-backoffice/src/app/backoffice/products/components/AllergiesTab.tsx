'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { allergiesService, type Allergy } from '@/services/products.service';

const EMPTY = { name: '', icon: '' };

export function AllergiesTab() {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; item: Allergy | null } | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setAllergies(await allergiesService.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(allergies.map((a) => a.id)) : new Set());
  };

  const openCreate = () => { setForm(EMPTY); setError(null); setPanel({ mode: 'create', item: null }); };
  const openEdit = (item: Allergy) => { setForm({ name: item.name, icon: item.icon ?? '' }); setError(null); setPanel({ mode: 'edit', item }); };
  const closePanel = () => setPanel(null);

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try {
      const payload = { name: form.name, icon: form.icon || undefined };
      if (panel?.mode === 'create') await allergiesService.create(payload);
      else await allergiesService.update(panel!.item!.id, payload);
      closePanel(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Fout'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item: Allergy) => {
    if (!confirm(`Allergeen "${item.name}" verwijderen?`)) return;
    setDeleting(item.id);
    try {
      await allergiesService.remove(item.id);
      setAllergies((prev) => prev.filter((a) => a.id !== item.id));
      setSelected((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
    } finally { setDeleting(null); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} allergeen/allergenen verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await allergiesService.bulkRemove([...selected]);
      setAllergies((prev) => prev.filter((a) => !selected.has(a.id)));
      setSelected(new Set());
    } finally { setBulkDeleting(false); }
  };

  const allSelected = allergies.length > 0 && allergies.every((a) => selected.has(a.id));
  const someSelected = allergies.some((a) => selected.has(a.id)) && !allSelected;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Allergenen</h2>
            <p className="text-sm text-muted-foreground">Allergeenlabels beheren</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4 mr-2" />Nieuw allergeen
          </Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(v) => handleSelectAll(!!v)}
                    aria-label="Alles selecteren"
                  />
                </TableHead>
                <TableHead>Icoon</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead className="w-20 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {[1,2,3,4].map((j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}
                  </TableRow>
                ))
              ) : allergies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                    Geen allergenen gevonden.
                  </TableCell>
                </TableRow>
              ) : allergies.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => openEdit(a)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(a.id)}
                      onCheckedChange={(v) => handleSelect(a.id, !!v)}
                      aria-label={`Selecteer ${a.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-xl">{a.icon ?? '—'}</TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(a)}
                        disabled={deleting === a.id}
                      >
                        {deleting === a.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {panel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={closePanel} />
          <aside className="fixed right-0 top-0 z-50 h-full w-[380px] bg-background border-l shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-base">
                {panel.mode === 'create' ? 'Nieuw allergeen' : 'Allergeen bewerken'}
              </h2>
              <Button variant="ghost" size="icon-sm" onClick={closePanel}><X className="size-4" /></Button>
            </div>
            <div className="flex-1 px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Naam</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Gluten" />
              </div>
              <div className="space-y-1.5">
                <Label>Icoon (emoji, optioneel)</Label>
                <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="🌾" />
                {form.icon && <div className="text-4xl">{form.icon}</div>}
              </div>
            </div>
            <div className="px-6 py-4 border-t space-y-2">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={closePanel} disabled={saving}>Annuleren</Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={saving || !form.name}>
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  {panel.mode === 'create' ? 'Aanmaken' : 'Opslaan'}
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t bg-background px-6 py-3 shadow-lg md:left-[var(--sidebar-width)]">
          <span className="text-sm font-medium">
            {selected.size} allergeen{selected.size !== 1 ? '/allergenen' : ''} geselecteerd
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())} disabled={bulkDeleting}>
              <X className="size-4 mr-1" />
              Deselecteren
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkDeleting}>
              {bulkDeleting ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Trash2 className="size-4 mr-1" />}
              Verwijderen
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
