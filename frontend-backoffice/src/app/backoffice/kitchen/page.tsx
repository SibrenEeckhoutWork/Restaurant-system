'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { ordersService, type Order, type OrderItem, type ItemStatus, type OrderStatus } from '@/services/orders.service';
import type { Category } from '@/services/products.service';
import { webSocketService } from '@/services/websocket.service';
import { tokenService } from '@/lib/auth/tokenService';
import { cn } from '@/lib/utils';

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered'];

type ColumnStatus = ItemStatus;

const COLUMNS: { status: ColumnStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Nieuw', color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' },
  { status: 'preparing', label: 'Bezig', color: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' },
  { status: 'ready', label: 'Klaar', color: 'border-green-400 bg-green-50 dark:bg-green-950/20' },
  { status: 'delivered', label: 'Afgerond', color: 'border-gray-400 bg-gray-50 dark:bg-gray-950/20' },
];

const STATUS_RANK: Record<ItemStatus, number> = { pending: 0, preparing: 1, ready: 2, delivered: 3 };

const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  pending: 'Wacht',
  preparing: 'Bezig',
  ready: 'Klaar',
  delivered: 'Geleverd',
};

const COLUMN_STATUS_LABELS: Record<ColumnStatus, string> = {
  pending: 'Wacht',
  preparing: 'Bezig',
  ready: 'Klaar',
  delivered: 'Geleverd',
};

const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-gray-100 text-gray-500 dark:bg-gray-900/30 dark:text-gray-400',
};

const ORDER_STATUS_COLOR: Record<ColumnStatus, string> = {
  pending: 'bg-yellow-400',
  preparing: 'bg-blue-400',
  ready: 'bg-green-400',
  delivered: 'bg-gray-400',
};

const NEXT_ITEM_STATUS: Record<ItemStatus, ItemStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null,
};

const NEXT_ORDER_STATUS: Record<ColumnStatus, ColumnStatus | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
  delivered: null,
};

function getDeliveredLabel(deliveryType: 'delivery' | 'pickup' | null): string {
  if (deliveryType === 'pickup') return 'Opgehaald';
  if (deliveryType === 'delivery') return 'Afgeleverd';
  return 'Aan tafel gezet';
}

function getOrderLocation(order: Order): string {
  if (order.deliveryType === 'pickup') return order.customerName ?? 'Ophalen';
  if (order.deliveryType === 'delivery') return order.address ?? order.customerName ?? 'Online';
  return order.table?.name ?? 'Inhouse';
}

function getEffectiveStatus(order: Order): ColumnStatus {
  if (order.status === 'delivered') return 'delivered';
  const statuses = order.items.map((i) => i.itemStatus);
  if (!statuses.length) return 'pending';
  return statuses.reduce((min, s) => (STATUS_RANK[s] < STATUS_RANK[min] ? s : min));
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
}

// ── No-filter: full order card ────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onDragStart: (orderId: string) => void;
  onItemAdvance: (orderId: string, itemId: string, status: ItemStatus) => void;
  onOrderAdvance: (orderId: string, status: ColumnStatus) => void;
}

function OrderCard({ order, onDragStart, onItemAdvance, onOrderAdvance }: OrderCardProps) {
  const effectiveStatus = getEffectiveStatus(order);
  const nextOrderStatus = NEXT_ORDER_STATUS[effectiveStatus];
  return (
    <div
      className="bg-background rounded-lg border shadow-sm p-3 space-y-2 cursor-grab active:cursor-grabbing select-none"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(order.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0">
          <span className="font-semibold text-sm">{getOrderLocation(order)}</span>
          {order.deliveryType && (
            <span className="text-xs text-muted-foreground">
              {order.deliveryType === 'pickup' ? 'Ophalen' : 'Levering'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</span>
          {effectiveStatus === 'delivered' ? (
            <span className="text-xs text-muted-foreground font-medium">
              {getDeliveredLabel(order.deliveryType)}
            </span>
          ) : nextOrderStatus && (
            <button
              onClick={() => onOrderAdvance(order.id, nextOrderStatus)}
              className="text-xs px-2 py-0.5 rounded border hover:bg-muted transition-colors font-medium"
              title={`Order markeren als ${COLUMN_STATUS_LABELS[nextOrderStatus]}`}
            >
              →
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {order.items.map((item) => {
          const next = NEXT_ITEM_STATUS[item.itemStatus];
          return (
            <div key={item.id} className="border-t pt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex-1 text-sm font-medium">
                  {item.quantity}× {item.product.name}
                </span>
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', ITEM_STATUS_COLORS[item.itemStatus])}>
                  {ITEM_STATUS_LABELS[item.itemStatus]}
                </span>
                {next && (
                  <button
                    onClick={() => onItemAdvance(order.id, item.id, next)}
                    className="text-xs px-2 py-0.5 rounded border hover:bg-muted transition-colors"
                    title={`Markeer als ${ITEM_STATUS_LABELS[next]}`}
                  >
                    →
                  </button>
                )}
              </div>
              {item.accessories.filter((a) => a.quantity > 0).map((a) => (
                <div key={a.accessoryId} className="text-xs text-muted-foreground pl-4">
                  +{a.quantity}× {a.accessory.name}
                </div>
              ))}
              {item.notes && <p className="text-xs text-muted-foreground italic pl-1">{item.notes}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Filter mode: single item card ─────────────────────────────────────────────

interface ItemCardProps {
  order: Order;
  item: OrderItem;
  onDragStart: (orderId: string, itemId: string) => void;
  onAdvance: (orderId: string, itemId: string, status: ItemStatus) => void;
}

function ItemCard({ order, item, onDragStart, onAdvance }: ItemCardProps) {
  const next = NEXT_ITEM_STATUS[item.itemStatus];
  return (
    <div
      className="bg-background rounded-lg border shadow-sm p-3 space-y-1 cursor-grab active:cursor-grabbing select-none"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(order.id, item.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full shrink-0', ORDER_STATUS_COLOR[getEffectiveStatus(order)])} title={`Order: ${COLUMN_STATUS_LABELS[getEffectiveStatus(order)]}`} />
          <span className="text-xs text-muted-foreground font-medium">{getOrderLocation(order)}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm font-medium">
          {item.quantity}× {item.product.name}
        </span>
        {next && (
          <button
            onClick={() => onAdvance(order.id, item.id, next)}
            className="text-xs px-2 py-0.5 rounded border hover:bg-muted transition-colors"
            title={`Markeer als ${ITEM_STATUS_LABELS[next]}`}
          >
            →
          </button>
        )}
      </div>
      {item.accessories.filter((a) => a.quantity > 0).map((a) => (
        <div key={a.accessoryId} className="text-xs text-muted-foreground pl-2">
          +{a.quantity}× {a.accessory.name}
        </div>
      ))}
      {item.notes && <p className="text-xs text-muted-foreground italic">{item.notes}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [dragOrderId, setDragOrderId] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<{ orderId: string; itemId: string } | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ColumnStatus | null>(null);
  const [mobileColumn, setMobileColumn] = useState<ColumnStatus>('pending');
  const connectedOnceRef = useRef(false);

  const filterActive = selectedCategoryIds.size > 0;

  const categories = useMemo((): Category[] => {
    const seen = new Map<string, Category>();
    for (const order of orders) {
      for (const item of order.items) {
        if (item.product.category && !seen.has(item.product.categoryId)) {
          seen.set(item.product.categoryId, item.product.category);
        }
      }
    }
    return Array.from(seen.values());
  }, [orders]);

  const load = useCallback(async () => {
    const all = await ordersService.getAll();
    setOrders(all.filter((o) => ACTIVE_STATUSES.includes(o.status)));
  }, []);

  useEffect(() => {
    if (connectedOnceRef.current) return;
    connectedOnceRef.current = true;
    load();
    const token = tokenService.get();
    if (token) {
      webSocketService.connect(token);
      webSocketService.joinRoom('kitchen');
      setConnected(webSocketService.isConnected);
    }
  }, [load]);

  useEffect(() => {
    const handleNew = (order: Order) => {
      setOrders((prev) => (prev.some((o) => o.id === order.id) ? prev : [order, ...prev]));
    };
    const handleUpdated = (order: Order) => {
      if (!ACTIVE_STATUSES.includes(order.status)) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
      } else {
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === order.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = order;
            return next;
          }
          return [order, ...prev];
        });
      }
    };
    webSocketService.on<Order>('order:new', handleNew);
    webSocketService.on<Order>('order:updated', handleUpdated);
    const interval = setInterval(() => setConnected(webSocketService.isConnected), 2000);
    return () => {
      clearInterval(interval);
      webSocketService.off('order:new');
      webSocketService.off('order:updated');
    };
  }, []);

  const emitItemStatus = (orderId: string, itemId: string, status: ItemStatus) => {
    webSocketService.emit('item:status', { orderId, itemId, status });
  };

  const emitOrderStatus = (orderId: string, status: ColumnStatus) => {
    webSocketService.emit('order:status', { orderId, status });
  };

  const handleDrop = (targetStatus: ColumnStatus) => {
    setDragOverStatus(null);
    if (filterActive && dragItem) {
      const { orderId, itemId } = dragItem;
      setDragItem(null);
      if (targetStatus === 'delivered') {
        webSocketService.emit('order:status', { orderId, status: 'delivered' });
      } else {
        webSocketService.emit('item:status', { orderId, itemId, status: targetStatus as ItemStatus });
      }
    } else if (!filterActive && dragOrderId) {
      const id = dragOrderId;
      setDragOrderId(null);
      webSocketService.emit('order:status', { orderId: id, status: targetStatus });
    }
    setDragItem(null);
    setDragOrderId(null);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // No-filter: group orders by effective status
  const ordersByStatus = (status: ColumnStatus) =>
    orders.filter((o) => getEffectiveStatus(o) === status);

  // Filter mode: group items by their itemStatus directly
  const itemsByStatus = (status: ColumnStatus) => {
    const result: { order: Order; item: OrderItem }[] = [];
    for (const order of orders) {
      for (const item of order.items) {
        if (!selectedCategoryIds.has(item.product.categoryId)) continue;
        if (item.itemStatus === status) result.push({ order, item });
      }
    }
    return result;
  };

  const isDragging = filterActive ? dragItem !== null : dragOrderId !== null;

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <span className="font-semibold text-sm">Keuken Display</span>
        <div className="ml-auto flex items-center gap-2">
          <span className={cn('size-2 rounded-full', connected ? 'bg-green-500' : 'bg-muted-foreground')} />
          <span className="text-xs text-muted-foreground">{connected ? 'Live' : 'Offline'}</span>
        </div>
      </header>

      {categories.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b flex-wrap shrink-0">
          <span className="text-xs text-muted-foreground font-medium shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border transition-colors',
                selectedCategoryIds.has(cat.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-border',
              )}
            >
              {cat.name}
            </button>
          ))}
          {filterActive && (
            <button
              onClick={() => setSelectedCategoryIds(new Set())}
              className="text-xs px-2.5 py-1 rounded-full border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
            >
              Wis filter
            </button>
          )}
        </div>
      )}

      {/* Mobile: tab bar */}
      <div className="md:hidden flex shrink-0 border-b">
        {COLUMNS.map(({ status, label, color }) => {
          const orders_col = filterActive ? [] : ordersByStatus(status);
          const items_col = filterActive ? itemsByStatus(status) : [];
          const count = filterActive ? items_col.length : orders_col.length;
          const active = mobileColumn === status;
          return (
            <button
              key={status}
              onClick={() => setMobileColumn(status)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium border-b-2 transition-colors',
                active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground',
              )}
            >
              <span>{label}</span>
              <Badge variant={active ? 'default' : 'secondary'} className="text-xs h-4 px-1.5">{count}</Badge>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden md:flex md:gap-3 md:p-4">
        {COLUMNS.map(({ status, label, color }) => {
          const isDragTarget = dragOverStatus === status;
          const orders_col = filterActive ? [] : ordersByStatus(status);
          const items_col = filterActive ? itemsByStatus(status) : [];
          const count = filterActive ? items_col.length : orders_col.length;

          return (
            <div
              key={status}
              className={cn(
                'flex-col flex-1 min-w-0 rounded-lg border-2 transition-all',
                color,
                isDragTarget && 'ring-2 ring-primary ring-offset-1 scale-[1.01]',
                // mobile: show only selected column
                'hidden md:flex',
                mobileColumn === status && '!flex h-full',
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverStatus(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverStatus(null);
                }
              }}
              onDrop={() => handleDrop(status)}
            >
              <div className="hidden md:flex items-center justify-between px-3 py-2 border-b border-inherit">
                <span className="font-semibold text-sm">{label}</span>
                <Badge variant="secondary" className="text-xs">{count}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {isDragTarget && isDragging && (
                  <div className="border-2 border-dashed border-primary/40 rounded-lg h-12 flex items-center justify-center mb-1">
                    <span className="text-xs text-primary/60">Loslaten om te verplaatsen</span>
                  </div>
                )}
                {count === 0 && !isDragTarget && (
                  <p className="text-xs text-muted-foreground text-center pt-6">Niets hier</p>
                )}
                {filterActive
                  ? items_col.map(({ order, item }) => (
                      <ItemCard
                        key={item.id}
                        order={order}
                        item={item}
                        onDragStart={(orderId, itemId) => setDragItem({ orderId, itemId })}
                        onAdvance={emitItemStatus}
                      />
                    ))
                  : orders_col.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onDragStart={setDragOrderId}
                        onItemAdvance={emitItemStatus}
                        onOrderAdvance={emitOrderStatus}
                      />
                    ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
