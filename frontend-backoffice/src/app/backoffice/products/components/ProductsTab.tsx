'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { productsService, type Product } from '@/services/products.service';
import { ProductPanel } from './ProductPanel';

interface BulkBarProps {
  count: number;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function BulkDeleteBar({ count, loading, onConfirm, onCancel }: BulkBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t bg-background px-6 py-3 shadow-lg md:left-[var(--sidebar-width)]">
      <span className="text-sm font-medium">
        {count} product{count !== 1 ? 'en' : ''} geselecteerd
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          <X className="size-4 mr-1" />
          Deselecteren
        </Button>
        <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
          {loading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Trash2 className="size-4 mr-1" />}
          Verwijderen
        </Button>
      </div>
    </div>
  );
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; product: Product | null } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProducts(await productsService.getAll()); }
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
    setSelected(checked ? new Set(products.map((p) => p.id)) : new Set());
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Product "${p.name}" verwijderen?`)) return;
    setDeleting(p.id);
    try {
      await productsService.remove(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      setSelected((prev) => { const n = new Set(prev); n.delete(p.id); return n; });
    } finally { setDeleting(null); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} product(en) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await productsService.bulkRemove([...selected]);
      setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
    } finally { setBulkDeleting(false); }
  };

  const handleToggleAvailable = async (p: Product) => {
    setToggling(p.id);
    try {
      await productsService.update(p.id, { isAvailable: !p.isAvailable });
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, isAvailable: !x.isAvailable } : x));
    } finally { setToggling(null); }
  };

  const handleSaved = async () => {
    setPanel(null);
    await load();
  };

  const allSelected = products.length > 0 && products.every((p) => selected.has(p.id));
  const someSelected = products.some((p) => selected.has(p.id)) && !allSelected;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Producten</h2>
            <p className="text-sm text-muted-foreground">Beheer het productaanbod</p>
          </div>
          <Button size="sm" onClick={() => setPanel({ mode: 'create', product: null })}>
            <Plus className="size-4 mr-2" />Nieuw product
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
                <TableHead>Categorie</TableHead>
                <TableHead>Prijs</TableHead>
                <TableHead>Allergenen</TableHead>
                <TableHead>Extra&apos;s</TableHead>
                <TableHead>Beschikbaar</TableHead>
                <TableHead className="w-20 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {[1,2,3,4,5,6,7,8].map((j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10 text-sm">
                    Geen producten gevonden.
                  </TableCell>
                </TableRow>
              ) : products.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setPanel({ mode: 'edit', product: p })}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(p.id)}
                      onCheckedChange={(v) => handleSelect(p.id, !!v)}
                      aria-label={`Selecteer ${p.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{p.name}</span>
                      {p.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.category?.name ?? '—'}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">€{Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5 flex-wrap max-w-[180px]">
                      {(p.allergies ?? []).length === 0 ? (
                        <span className="text-muted-foreground text-sm">—</span>
                      ) : (
                        (p.allergies ?? []).map((a) => (
                          <span key={a.id} title={a.name} className="text-lg leading-none">
                            {a.icon ?? a.name.charAt(0)}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(p.accessories ?? []).length === 0 ? (
                        <span className="text-muted-foreground text-sm">—</span>
                      ) : (
                        (p.accessories ?? []).map((a) => (
                          <span key={a.id} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                            {a.name}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {toggling === p.id ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Switch checked={p.isAvailable} onCheckedChange={() => handleToggleAvailable(p)} />
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setPanel({ mode: 'edit', product: p })}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductPanel
        mode={panel?.mode ?? null}
        product={panel?.product ?? null}
        onClose={() => setPanel(null)}
        onSaved={handleSaved}
      />

      {selected.size > 0 && (
        <BulkDeleteBar
          count={selected.size}
          loading={bulkDeleting}
          onConfirm={handleBulkDelete}
          onCancel={() => setSelected(new Set())}
        />
      )}
    </>
  );
}
