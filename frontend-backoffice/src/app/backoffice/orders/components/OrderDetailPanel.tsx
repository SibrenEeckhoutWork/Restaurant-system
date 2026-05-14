'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ordersService,
  type Order,
  type OrderStatus,
  type CreateOrderItemPayload,
  type OrderItemAccessoryPayload,
} from '@/services/orders.service';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'In afwachting',
  preparing: 'In voorbereiding',
  ready: 'Klaar',
  delivered: 'Geleverd',
  cancelled: 'Geannuleerd',
};

function getStatusLabel(status: OrderStatus, deliveryType: 'delivery' | 'pickup' | null): string {
  if (status === 'delivered') {
    if (deliveryType === 'pickup') return 'Opgehaald';
    if (deliveryType === 'delivery') return 'Afgeleverd';
    return 'Aan tafel gezet';
  }
  return STATUS_LABELS[status];
}

function getDeliverButtonLabel(deliveryType: 'delivery' | 'pickup' | null): string {
  if (deliveryType === 'pickup') return 'Ophalen';
  if (deliveryType === 'delivery') return 'Afleveren';
  return 'Aan tafel zetten';
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-muted text-muted-foreground',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

interface AccessoryRow {
  accessoryId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ItemState {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  notes: string;
  accessories: AccessoryRow[];
}

function orderToItems(order: Order): ItemState[] {
  return order.items.map((item) => {
    const accMap = new Map(item.accessories.map((a) => [a.accessoryId, a.quantity]));
    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      notes: item.notes ?? '',
      accessories: item.product.accessories.map((a) => ({
        accessoryId: a.id,
        name: a.name,
        price: a.price,
        quantity: accMap.get(a.id) ?? 0,
      })),
    };
  });
}

interface Props {
  order: Order | null;
  onClose: () => void;
  onUpdated: (order: Order) => void;
  onDeleted: () => void;
}

export function OrderDetailPanel({ order, onClose, onUpdated, onDeleted }: Props) {
  const [items, setItems] = useState<ItemState[]>([]);
  const [itemsDirty, setItemsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setItems(orderToItems(order));
      setItemsDirty(false);
      setError(null);
    }
  }, [order?.id]);

  if (!order) return null;

  const isTerminal = order.status === 'delivered' || order.status === 'cancelled';

  const setItem = (idx: number, patch: Partial<ItemState>) => {
    setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    setItemsDirty(true);
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
    setItemsDirty(true);
  };

  const handleSaveItems = async () => {
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
      const updated = await ordersService.updateItems(order.id, payload);
      setItems(orderToItems(updated));
      setItemsDirty(false);
      onUpdated(updated);
    } catch {
      setError('Opslaan mislukt');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (status: OrderStatus) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await ordersService.updateStatus(order.id, status);
      onUpdated(updated);
    } catch {
      setError('Status update mislukt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bestelling verwijderen?')) return;
    setSaving(true);
    try {
      await ordersService.remove(order.id);
      onDeleted();
    } catch {
      setError('Verwijderen mislukt');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-[520px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base">{order.table?.name ?? order.customerName ?? 'Online bestelling'}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                {getStatusLabel(order.status, order.deliveryType)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleString('nl-BE', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          {order.deliveryType === 'delivery' && order.address && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Afleveradres: </span>{order.address}
              {order.phone && <span className="ml-3 text-muted-foreground">{order.phone}</span>}
            </div>
          )}
          {order.deliveryType === 'pickup' && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Ophalen — </span>{order.customerName ?? ''}
              {order.phone && <span className="ml-3 text-muted-foreground">{order.phone}</span>}
            </div>
          )}
          {!order.deliveryType && order.table && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Tafel: </span>{order.table.name}
            </div>
          )}
          {!isTerminal && (
            <div>
              <p className="text-sm font-medium mb-2">Status wijzigen</p>
              <div className="flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus('preparing')} disabled={saving}>
                    In voorbereiding
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus('ready')} disabled={saving}>
                    Klaar
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus('delivered')} disabled={saving}>
                    {getDeliverButtonLabel(order.deliveryType)}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleStatus('cancelled')}
                  disabled={saving}
                >
                  Annuleer
                </Button>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Items</p>
            <div className="space-y-3">
              {items.map((row, idx) => (
                <div key={row.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{row.productName}</span>
                    {!isTerminal ? (
                      <input
                        type="number"
                        min={1}
                        className="w-16 rounded-md border bg-background px-2 py-1 text-sm text-center"
                        value={row.quantity}
                        onChange={(e) =>
                          setItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })
                        }
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">×{row.quantity}</span>
                    )}
                  </div>

                  {row.accessories.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Extra&apos;s</p>
                      {row.accessories.map((acc) => {
                        if (isTerminal) {
                          return acc.quantity > 0 ? (
                            <div key={acc.accessoryId} className="flex items-center justify-between text-xs">
                              <span className="bg-muted px-2 py-0.5 rounded-full">{acc.name}</span>
                              <span className="text-muted-foreground">×{acc.quantity}</span>
                            </div>
                          ) : null;
                        }
                        return (
                          <div key={acc.accessoryId} className="flex items-center gap-2">
                            <span className="flex-1 text-sm">{acc.name}</span>
                            <span className="text-xs text-muted-foreground">+€{Number(acc.price).toFixed(2)}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="size-6 rounded border text-sm flex items-center justify-center hover:bg-muted"
                                onClick={() => setAccQty(idx, acc.accessoryId, acc.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm">{acc.quantity}</span>
                              <button
                                type="button"
                                className="size-6 rounded border text-sm flex items-center justify-center hover:bg-muted"
                                onClick={() => setAccQty(idx, acc.accessoryId, acc.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!isTerminal ? (
                    <input
                      type="text"
                      placeholder="Notities..."
                      className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                      value={row.notes}
                      onChange={(e) => setItem(idx, { notes: e.target.value })}
                    />
                  ) : (
                    row.notes && <p className="text-xs text-muted-foreground italic">{row.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="shrink-0 border-t px-5 py-4 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={saving}
          >
            Verwijderen
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Sluiten</Button>
            {!isTerminal && (
              <Button onClick={handleSaveItems} disabled={!itemsDirty || saving}>
                {saving ? 'Opslaan...' : 'Items opslaan'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
