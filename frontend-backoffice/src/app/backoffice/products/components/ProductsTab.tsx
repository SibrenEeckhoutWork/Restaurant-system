'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
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
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; product: Product | null } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const prods = await productsService.getAll();
      setProducts(prods);
      setOpenCategories(new Set(prods.map((p) => p.categoryId ?? '__none__')));
    } finally { setLoading(false); }
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

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = products.length > 0 && products.every((p) => selected.has(p.id));
  const someSelected = products.some((p) => selected.has(p.id)) && !allSelected;

  const grouped = products.reduce((acc, p) => {
    const key = p.categoryId ?? '__none__';
    if (!acc[key]) acc[key] = { id: key, name: p.category?.name ?? 'Geen categorie', products: [] };
    acc[key].products.push(p);
    return acc;
  }, {} as Record<string, { id: string; name: string; products: Product[] }>);

  const categories = Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));

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

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border px-4 py-10 text-center text-sm text-muted-foreground">
            Geen producten gevonden.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(v) => handleSelectAll(!!v)}
                aria-label="Alles selecteren"
              />
              <span className="text-xs text-muted-foreground">Alles selecteren</span>
            </div>

            {categories.map(({ id: catId, name: catName, products: catProducts }) => {
              const isOpen = openCategories.has(catId);
              const allCatSelected = catProducts.every((p) => selected.has(p.id));
              const someCatSelected = catProducts.some((p) => selected.has(p.id)) && !allCatSelected;

              return (
                <Collapsible key={catId} open={isOpen} onOpenChange={() => toggleCategory(catId)}>
                  <div className="rounded-lg border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/20">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={allCatSelected}
                          indeterminate={someCatSelected}
                          onCheckedChange={(v) => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              catProducts.forEach((p) => v ? next.add(p.id) : next.delete(p.id));
                              return next;
                            });
                          }}
                          aria-label={`Selecteer alle ${catName}`}
                        />
                      </div>
                      <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                        <ChevronRight
                          className={cn(
                            'size-4 text-muted-foreground transition-transform duration-200 shrink-0',
                            isOpen && 'rotate-90',
                          )}
                        />
                        <span className="font-medium text-sm">{catName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {catProducts.length}
                        </Badge>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                      <div className="divide-y">
                        {catProducts.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 cursor-pointer"
                            onClick={() => setPanel({ mode: 'edit', product: p })}
                          >
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selected.has(p.id)}
                                onCheckedChange={(v) => handleSelect(p.id, !!v)}
                                aria-label={`Selecteer ${p.name}`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{p.name}</span>
                                {p.description && (
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {p.description}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-medium text-foreground">
                                  €{Number(p.price).toFixed(2)}
                                </span>
                                {(p.allergies ?? []).length > 0 && (
                                  <span className="flex gap-0.5">
                                    {p.allergies.map((a) => (
                                      <span key={a.id} title={a.name} className="text-sm leading-none">
                                        {a.icon ?? a.name.charAt(0)}
                                      </span>
                                    ))}
                                  </span>
                                )}
                                {(p.accessories ?? []).length > 0 && (
                                  <div className="flex gap-1 flex-wrap">
                                    {p.accessories.slice(0, 3).map((a) => (
                                      <span key={a.id} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                        {a.name}
                                      </span>
                                    ))}
                                    {p.accessories.length > 3 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{p.accessories.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {toggling === p.id ? (
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              ) : (
                                <Switch
                                  checked={p.isAvailable}
                                  onCheckedChange={() => handleToggleAvailable(p)}
                                />
                              )}
                              <Button
                                variant="ghost" size="icon-sm"
                                onClick={() => setPanel({ mode: 'edit', product: p })}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost" size="icon-sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(p)}
                                disabled={deleting === p.id}
                              >
                                {deleting === p.id
                                  ? <Loader2 className="size-3.5 animate-spin" />
                                  : <Trash2 className="size-3.5" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}
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
