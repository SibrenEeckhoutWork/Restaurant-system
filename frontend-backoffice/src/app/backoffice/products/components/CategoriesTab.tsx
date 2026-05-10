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
import { categoriesService, type Category } from '@/services/products.service';

const EMPTY = { name: '', sortOrder: 0 };

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; item: Category | null } | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await categoriesService.getAll()); }
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
    setSelected(checked ? new Set(categories.map((c) => c.id)) : new Set());
  };

  const openCreate = () => { setForm(EMPTY); setError(null); setPanel({ mode: 'create', item: null }); };
  const openEdit = (item: Category) => { setForm({ name: item.name, sortOrder: item.sortOrder }); setError(null); setPanel({ mode: 'edit', item }); };
  const closePanel = () => setPanel(null);

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try {
      if (panel?.mode === 'create') await categoriesService.create(form);
      else await categoriesService.update(panel!.item!.id, form);
      closePanel(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Fout'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item: Category) => {
    if (!confirm(`Categorie "${item.name}" verwijderen?`)) return;
    setDeleting(item.id);
    try {
      await categoriesService.remove(item.id);
      setCategories((prev) => prev.filter((c) => c.id !== item.id));
      setSelected((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
    } finally { setDeleting(null); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} categorie(ën) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await categoriesService.bulkRemove([...selected]);
      setCategories((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
    } finally { setBulkDeleting(false); }
  };

  const allSelected = categories.length > 0 && categories.every((c) => selected.has(c.id));
  const someSelected = categories.some((c) => selected.has(c.id)) && !allSelected;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Categorieën</h2>
            <p className="text-sm text-muted-foreground">Productcategorieën beheren</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4 mr-2" />Nieuwe categorie
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
                <TableHead>Volgorde</TableHead>
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
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                    Geen categorieën gevonden.
                  </TableCell>
                </TableRow>
              ) : categories.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => openEdit(c)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(c.id)}
                      onCheckedChange={(v) => handleSelect(c.id, !!v)}
                      aria-label={`Selecteer ${c.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.sortOrder}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(c)}
                        disabled={deleting === c.id}
                      >
                        {deleting === c.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
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
                {panel.mode === 'create' ? 'Nieuwe categorie' : 'Categorie bewerken'}
              </h2>
              <Button variant="ghost" size="icon-sm" onClick={closePanel}><X className="size-4" /></Button>
            </div>
            <div className="flex-1 px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Naam</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Starters" />
              </div>
              <div className="space-y-1.5">
                <Label>Volgorde</Label>
                <Input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))} />
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
            {selected.size} categorie{selected.size !== 1 ? 'ën' : ''} geselecteerd
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
