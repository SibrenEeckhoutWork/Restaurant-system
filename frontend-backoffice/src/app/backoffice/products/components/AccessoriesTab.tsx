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
import { accessoriesService, type Accessory } from '@/services/products.service';

const EMPTY = { name: '', price: 0 };

export function AccessoriesTab() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; item: Accessory | null } | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setAccessories(await accessoriesService.getAll()); }
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
    setSelected(checked ? new Set(accessories.map((a) => a.id)) : new Set());
  };

  const openCreate = () => { setForm(EMPTY); setError(null); setPanel({ mode: 'create', item: null }); };
  const openEdit = (item: Accessory) => { setForm({ name: item.name, price: item.price }); setError(null); setPanel({ mode: 'edit', item }); };
  const closePanel = () => setPanel(null);

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try {
      if (panel?.mode === 'create') await accessoriesService.create(form);
      else await accessoriesService.update(panel!.item!.id, form);
      closePanel(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Fout'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item: Accessory) => {
    if (!confirm(`Extra "${item.name}" verwijderen?`)) return;
    setDeleting(item.id);
    try {
      await accessoriesService.remove(item.id);
      setAccessories((prev) => prev.filter((a) => a.id !== item.id));
      setSelected((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
    } finally { setDeleting(null); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} extra('s) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await accessoriesService.bulkRemove([...selected]);
      setAccessories((prev) => prev.filter((a) => !selected.has(a.id)));
      setSelected(new Set());
    } finally { setBulkDeleting(false); }
  };

  const allSelected = accessories.length > 0 && accessories.every((a) => selected.has(a.id));
  const someSelected = accessories.some((a) => selected.has(a.id)) && !allSelected;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Extra&apos;s</h2>
            <p className="text-sm text-muted-foreground">Bijkomende opties beheren</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4 mr-2" />Nieuw extra
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
                <TableHead>Naam</TableHead>
                <TableHead>Prijs</TableHead>
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
              ) : accessories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                    {"Geen extra's gevonden."}
                  </TableCell>
                </TableRow>
              ) : accessories.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => openEdit(a)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(a.id)}
                      onCheckedChange={(v) => handleSelect(a.id, !!v)}
                      aria-label={`Selecteer ${a.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">€{Number(a.price).toFixed(2)}</TableCell>
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
                {panel.mode === 'create' ? "Nieuw extra" : "Extra bewerken"}
              </h2>
              <Button variant="ghost" size="icon-sm" onClick={closePanel}><X className="size-4" /></Button>
            </div>
            <div className="flex-1 px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Naam</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Extra saus" />
              </div>
              <div className="space-y-1.5">
                <Label>Prijs (€)</Label>
                <Input
                  type="number" min={0} step={0.01}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                />
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
            {selected.size} extra{selected.size !== 1 ? "'s" : ''} geselecteerd
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
