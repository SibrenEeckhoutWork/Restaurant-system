'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCheck, Loader2, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ordersService, type Order, type OrderStatus } from '@/services/orders.service';
import { NewOrderPanel } from './NewOrderPanel';
import { OrderDetailPanel } from './OrderDetailPanel';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'In afwachting',
  preparing: 'In voorbereiding',
  ready: 'Klaar',
  delivered: 'Geleverd',
  cancelled: 'Geannuleerd',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-muted text-muted-foreground',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newOpen, setNewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [delivering, setDelivering] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } finally {
      setLoading(false);
    }
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
    setSelected(checked ? new Set(orders.map((o) => o.id)) : new Set());
  };

  const handleUpdated = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  };

  const handleDeleted = () => {
    setOrders((prev) => prev.filter((o) => o.id !== selectedOrder?.id));
    if (selectedOrder) {
      setSelected((prev) => { const n = new Set(prev); n.delete(selectedOrder.id); return n; });
    }
    setSelectedOrder(null);
  };

  const handleSaved = () => {
    setNewOpen(false);
    load();
  };

  const handleDeliver = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setDelivering((prev) => new Set(prev).add(order.id));
    try {
      const updated = await ordersService.updateStatus(order.id, 'delivered');
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder?.id === updated.id) setSelectedOrder(updated);
    } finally {
      setDelivering((prev) => { const n = new Set(prev); n.delete(order.id); return n; });
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} bestelling(en) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await ordersService.bulkRemove([...selected]);
      setOrders((prev) => prev.filter((o) => !selected.has(o.id)));
      setSelected(new Set());
    } finally { setBulkDeleting(false); }
  };

  const allSelected = orders.length > 0 && orders.every((o) => selected.has(o.id));
  const someSelected = orders.some((o) => selected.has(o.id)) && !allSelected;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Bestellingen</h1>
          <p className="text-sm text-muted-foreground">Actieve en afgeronde bestellingen</p>
        </div>
        <Button size="sm" onClick={() => setNewOpen(true)}>
          <Plus className="size-4 mr-1" />
          Nieuwe order
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
              <TableHead>Tafel</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tijdstip</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="size-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <span>Geen bestellingen gevonden</span>
                    <Button size="sm" onClick={() => setNewOpen(true)}>
                      <Plus className="size-4 mr-1" /> Nieuwe order
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(order.id)}
                        onCheckedChange={(v) => handleSelect(order.id, !!v)}
                        aria-label={`Selecteer bestelling ${order.table?.name ?? order.customerName ?? 'Online'}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.table?.name ?? order.customerName ?? 'Online'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {totalQty} item{totalQty !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString('nl-BE', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {(order.status === 'ready' || order.status === 'pending' || order.status === 'preparing') && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                          title="Markeer als geleverd"
                          disabled={delivering.has(order.id)}
                          onClick={(e) => handleDeliver(e, order)}
                        >
                          {delivering.has(order.id)
                            ? <Loader2 className="size-4 animate-spin" />
                            : <CheckCheck className="size-4" />}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <NewOrderPanel
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onSaved={handleSaved}
      />

      <OrderDetailPanel
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t bg-background px-6 py-3 shadow-lg md:left-[var(--sidebar-width)]">
          <span className="text-sm font-medium">
            {selected.size} bestelling{selected.size !== 1 ? 'en' : ''} geselecteerd
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
