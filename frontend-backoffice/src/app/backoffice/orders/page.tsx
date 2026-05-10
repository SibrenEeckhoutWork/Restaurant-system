'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrdersTab } from './components/OrdersTab';
import { PermissionsConfig } from '../components/PermissionsConfig';

const PERMISSIONS = [
  { key: 'orders.read', label: 'Bekijken', description: 'Bestellingen bekijken — GET /orders', color: 'text-blue-700 dark:text-blue-400' },
  { key: 'orders.create', label: 'Aanmaken', description: 'Nieuwe bestelling aanmaken — POST /orders', color: 'text-green-700 dark:text-green-400' },
  { key: 'orders.update', label: 'Bewerken', description: 'Status en items bewerken — PATCH /orders/:id/status, PATCH /orders/:id/items', color: 'text-yellow-700 dark:text-yellow-400' },
  { key: 'orders.delete', label: 'Verwijderen', description: 'Bestelling verwijderen — DELETE /orders/:id', color: 'text-red-700 dark:text-red-400' },
];

export default function OrdersPage() {
  return (
    <Tabs defaultValue="orders" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="orders">Bestellingen</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="orders" className="p-6">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Configuratie</h1>
            <p className="text-sm text-muted-foreground">Permissievereisten per actie</p>
          </div>
          <PermissionsConfig permissions={PERMISSIONS} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
