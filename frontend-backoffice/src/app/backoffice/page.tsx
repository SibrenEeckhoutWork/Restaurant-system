'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ordersService, type Order, type OrderStatus } from '@/services/orders.service';
import { reservationsService, type Reservation } from '@/services/reservations.service';
import { cn } from '@/lib/utils';
import { Banknote, CalendarDays, ClipboardList, Truck } from 'lucide-react';

const TODAY = new Date().toISOString().split('T')[0];

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Nieuw',
  preparing: 'Bezig',
  ready: 'Klaar',
  delivered: 'Geleverd',
  cancelled: 'Geannuleerd',
};

const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  delivered: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
};

const RESERVATION_STATUS_LABEL: Record<string, string> = {
  pending: 'Wacht',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
};

const RESERVATION_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-destructive/10 text-destructive',
};

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
}

function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
}

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

function StatCard({ title, value, sub, icon: Icon, iconColor = 'text-muted-foreground' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('size-4', iconColor)} />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function BackofficePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      ordersService.getAll(),
      reservationsService.getAll({ date: TODAY }),
    ]).then(([ordersRes, resvRes]) => {
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value);
      if (resvRes.status === 'fulfilled') setReservations(resvRes.value);
      setLoading(false);
    });
  }, []);

  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const deliveredToday = orders.filter(
    (o) => o.status === 'delivered' && o.createdAt.startsWith(TODAY),
  );
  const revenueToday = deliveredToday.reduce((sum, o) => sum + orderTotal(o), 0);
  const todayReservations = reservations.filter((r) => r.status !== 'cancelled');

  const liveOrders = [...activeOrders, ...readyOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <span className="font-semibold text-sm">Dashboard</span>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Actieve bestellingen"
            value={loading ? '—' : activeOrders.length}
            sub={activeOrders.length ? `${activeOrders.filter(o => o.status === 'pending').length} nieuw · ${activeOrders.filter(o => o.status === 'preparing').length} bezig` : undefined}
            icon={ClipboardList}
            iconColor="text-blue-500"
          />
          <StatCard
            title="Te leveren"
            value={loading ? '—' : readyOrders.length}
            sub={readyOrders.length ? `${readyOrders.map(o => o.table.name).join(', ')}` : 'Niets klaar'}
            icon={Truck}
            iconColor={readyOrders.length ? 'text-green-500' : 'text-muted-foreground'}
          />
          <StatCard
            title="Omzet vandaag"
            value={loading ? '—' : formatEuro(revenueToday)}
            sub={`${deliveredToday.length} geleverd`}
            icon={Banknote}
            iconColor="text-emerald-500"
          />
          <StatCard
            title="Reservaties vandaag"
            value={loading ? '—' : todayReservations.length}
            sub={todayReservations.length ? `${todayReservations.reduce((s, r) => s + r.partySize, 0)} personen` : undefined}
            icon={CalendarDays}
            iconColor="text-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Live bestellingen</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="px-6 pb-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 rounded bg-muted animate-pulse" />
                  ))}
                </div>
              ) : liveOrders.length === 0 ? (
                <p className="px-6 pb-4 text-sm text-muted-foreground">Geen actieve bestellingen.</p>
              ) : (
                <div className="divide-y">
                  {liveOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="text-sm font-medium">{order.table?.name ?? order.customerName ?? 'Online bestelling'}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatEuro(orderTotal(order))}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ORDER_STATUS_COLOR[order.status])}>
                          {ORDER_STATUS_LABEL[order.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's reservations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Reservaties vandaag</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="px-6 pb-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 rounded bg-muted animate-pulse" />
                  ))}
                </div>
              ) : reservations.length === 0 ? (
                <p className="px-6 pb-4 text-sm text-muted-foreground">Geen reservaties vandaag.</p>
              ) : (
                <div className="divide-y">
                  {reservations.map((r) => (
                    <div key={r.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="text-sm font-medium">{r.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.table.name} · {r.partySize} pers. · {r.slot.startTime.slice(0, 5)}
                        </p>
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', RESERVATION_STATUS_COLOR[r.status])}>
                        {RESERVATION_STATUS_LABEL[r.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
