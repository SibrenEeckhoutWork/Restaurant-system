'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productsService, type Product } from '@/services/products.service';
import { tablesService, type Table } from '@/services/tables.service';
import { ordersService, type CreateOrderItemPayload, type OrderItemAccessoryPayload } from '@/services/orders.service';

interface AccessoryRow {
  accessoryId: string;
  quantity: number;
}

interface ItemRow {
  productId: string;
  quantity: number;
  notes: string;
  accessories: AccessoryRow[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function NewOrderPanel({ open, onClose, onSaved }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tableId, setTableId] = useState('');
  const [items, setItems] = useState<ItemRow[]>([{ productId: '', quantity: 1, notes: '', accessories: [] }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    Promise.all([tablesService.getAll(), productsService.getAll()]).then(([t, p]) => {
      setTables(t);
      setProducts(p.filter((pr) => pr.isAvailable));
    });
    setTableId('');
    setItems([{ productId: '', quantity: 1, notes: '', accessories: [] }]);
    setError(null);
  }, [open]);

  const productMap = new Map(products.map((p) => [p.id, p]));

  const setItem = (idx: number, patch: Partial<ItemRow>) =>
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const selectProduct = (idx: number, productId: string) => {
    const product = productMap.get(productId);
    setItem(idx, {
      productId,
      accessories: product?.accessories.map((a) => ({ accessoryId: a.id, quantity: 0 })) ?? [],
    });
  };

  const setAccQty = (itemIdx: number, accId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== itemIdx) return row;
        return {
          ...row,
          accessories: row.accessories.map((a) =>
            a.accessoryId === accId ? { ...a, quantity: Math.max(0, quantity) } : a,
          ),
        };
      }),
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { productId: '', quantity: 1, notes: '', accessories: [] }]);

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const canSubmit =
    tableId &&
    items.length > 0 &&
    items.every((r) => r.productId && r.quantity >= 1);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      const payload: CreateOrderItemPayload[] = items.map((r) => {
        const selectedAcc: OrderItemAccessoryPayload[] = r.accessories
          .filter((a) => a.quantity > 0)
          .map((a) => ({ accessoryId: a.accessoryId, quantity: a.quantity }));
        return {
          productId: r.productId,
          quantity: r.quantity,
          notes: r.notes || null,
          accessories: selectedAcc,
        };
      });
      await ordersService.create({ tableId, items: payload });
      onSaved();
    } catch {
      setError('Opslaan mislukt');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-[480px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="font-semibold text-base">Nieuwe bestelling</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4 space-y-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Tafel</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">Selecteer tafel...</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.room ? `(${t.room.name})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Producten</label>
              <Button variant="ghost" size="sm" onClick={addItem}>
                <Plus className="size-4 mr-1" /> Toevoegen
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((row, idx) => {
                const product = productMap.get(row.productId);
                return (
                  <div key={idx} className="border rounded-lg p-3 space-y-3">
                    <div className="flex gap-2">
                      <select
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                        value={row.productId}
                        onChange={(e) => selectProduct(idx, e.target.value)}
                      >
                        <option value="">Product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (€{Number(p.price).toFixed(2)})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        className="w-16 rounded-md border bg-background px-3 py-2 text-sm text-center"
                        value={row.quantity}
                        onChange={(e) =>
                          setItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })
                        }
                      />
                      {items.length > 1 && (
                        <Button variant="ghost" size="icon-sm" onClick={() => removeItem(idx)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    {product && product.accessories.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Extra&apos;s</p>
                        <div className="space-y-1.5">
                          {row.accessories.map((accRow) => {
                            const acc = product.accessories.find((a) => a.id === accRow.accessoryId);
                            if (!acc) return null;
                            return (
                              <div key={acc.id} className="flex items-center gap-2">
                                <span className="flex-1 text-sm">{acc.name}</span>
                                <span className="text-xs text-muted-foreground">+€{Number(acc.price).toFixed(2)}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    className="size-6 rounded border text-sm flex items-center justify-center hover:bg-muted"
                                    onClick={() => setAccQty(idx, acc.id, accRow.quantity - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="w-6 text-center text-sm">{accRow.quantity}</span>
                                  <button
                                    type="button"
                                    className="size-6 rounded border text-sm flex items-center justify-center hover:bg-muted"
                                    onClick={() => setAccQty(idx, acc.id, accRow.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Notities..."
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={row.notes}
                      onChange={(e) => setItem(idx, { notes: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="shrink-0 border-t px-5 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Annuleer</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || saving}>
            {saving ? 'Opslaan...' : 'Bestelling plaatsen'}
          </Button>
        </div>
      </div>
    </>
  );
}
