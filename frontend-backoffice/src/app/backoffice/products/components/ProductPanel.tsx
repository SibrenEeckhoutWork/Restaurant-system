'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  productsService,
  categoriesService,
  allergiesService,
  type Product,
  type Category,
  type Allergy,
} from '@/services/products.service';

interface Props {
  mode: 'create' | 'edit' | null;
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: 0,
  isAvailable: true,
  categoryId: '',
  allergyIds: [] as string[],
  accessoryIds: [] as string[],
};

function CheckGroup<T extends { id: string; name: string }>({
  label,
  items,
  selected,
  onToggle,
  renderLabel,
}: {
  label: string;
  items: T[];
  selected: string[];
  onToggle: (id: string) => void;
  renderLabel?: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="rounded-lg border divide-y">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="size-4 accent-primary"
            />
            <span className="text-sm">{renderLabel ? renderLabel(item) : item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AccessoriesMultiSelect({
  allProducts,
  currentProductId,
  selected,
  onChange,
}: {
  allProducts: Product[];
  currentProductId: string | null;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const selectable = allProducts.filter((p) => p.id !== currentProductId);

  const grouped = selectable.reduce((acc, p) => {
    const key = p.categoryId ?? '__none__';
    if (!acc[key]) acc[key] = { name: p.category?.name ?? 'Geen categorie', products: [] };
    acc[key].products.push(p);
    return acc;
  }, {} as Record<string, { name: string; products: Product[] }>);

  const categories = Object.entries(grouped).sort(([, a], [, b]) => a.name.localeCompare(b.name));
  const selectedProducts = allProducts.filter((p) => selected.includes(p.id));

  return (
    <Popover>
      <PopoverTrigger className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm min-h-9 hover:bg-accent/30 transition-colors">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 text-left">
          {selectedProducts.length === 0 ? (
            <span className="text-muted-foreground">Selecteer producten...</span>
          ) : (
            <>
              {selectedProducts.slice(0, 3).map((p) => (
                <Badge key={p.id} variant="secondary" className="text-xs font-normal">
                  {p.name}
                </Badge>
              ))}
              {selectedProducts.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedProducts.length - 3}
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-1" side="bottom" align="start">
        <div className="max-h-64 overflow-y-auto">
          {selectable.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground text-center">Geen andere producten.</p>
          ) : (
            categories.map(([catId, { name, products }]) => (
              <div key={catId}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {name}
                </div>
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors text-left"
                  >
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onCheckedChange={() => toggle(p.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="flex-1">{p.name}</span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      €{Number(p.price).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProductPanel({ mode, product, onClose, onSaved }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      categoriesService.getAll(),
      allergiesService.getAll(),
      productsService.getAll(),
    ]).then(([cats, algs, prods]) => {
      setCategories(cats);
      setAllergies(algs);
      setAllProducts(prods);
    });
  }, []);

  useEffect(() => {
    setError(null);
    if (mode === 'edit' && product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        isAvailable: product.isAvailable,
        categoryId: product.categoryId,
        allergyIds: product.allergies.map((a) => a.id),
        accessoryIds: product.accessories.map((a) => a.id),
      });
    } else if (mode === 'create') {
      setForm({ ...EMPTY_FORM });
    }
  }, [mode, product]);

  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: (typeof EMPTY_FORM)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleId = (field: 'allergyIds', id: string) =>
    setForm((f) => {
      const arr = f[field];
      return { ...f, [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        price: form.price,
        isAvailable: form.isAvailable,
        categoryId: form.categoryId,
        allergyIds: form.allergyIds,
        accessoryIds: form.accessoryIds,
      };
      if (mode === 'create') await productsService.create(payload);
      else await productsService.update(product!.id, payload);
      onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Fout'); }
    finally { setSaving(false); }
  };

  if (!mode) return null;

  const canSubmit = !!form.name && !!form.categoryId && form.price >= 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-[460px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base">
            {mode === 'create' ? 'Nieuw product' : 'Product bewerken'}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Naam</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Margherita" />
          </div>

          <div className="space-y-1.5">
            <Label>Beschrijving (optioneel)</Label>
            <Input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Tomaat, mozzarella, basilicum..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Prijs (€)</Label>
              <Input
                type="number" min={0} step={0.01}
                value={form.price}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Beschikbaar</Label>
              <div className="flex items-center h-8">
                <Switch checked={form.isAvailable} onCheckedChange={(v) => set('isAvailable', v as boolean)} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categorie</Label>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Geen categorieën — maak er eerst een aan.</p>
            ) : (
              <select
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Selecteer categorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <CheckGroup
            label="Allergenen"
            items={allergies}
            selected={form.allergyIds}
            onToggle={(id) => toggleId('allergyIds', id)}
            renderLabel={(a) => <span>{a.icon ? `${a.icon} ` : ''}{a.name}</span>}
          />

          <div className="space-y-1.5">
            <Label>Extra&apos;s (andere producten)</Label>
            <AccessoriesMultiSelect
              allProducts={allProducts}
              currentProductId={product?.id ?? null}
              selected={form.accessoryIds}
              onChange={(ids) => set('accessoryIds', ids)}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t space-y-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Annuleren</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={saving || !canSubmit}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Aanmaken' : 'Opslaan'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
