'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductsTab } from './components/ProductsTab';
import { PermissionsConfig } from './components/PermissionsConfig';

const PRODUCTS_PERMISSIONS = [
  { key: 'products.get', label: 'Bekijken', description: 'Producten oplijsten en ophalen — GET /products', color: 'text-blue-700 dark:text-blue-400' },
  { key: 'products.create', label: 'Aanmaken', description: 'Nieuw product aanmaken — POST /products', color: 'text-green-700 dark:text-green-400' },
  { key: 'products.update', label: 'Bewerken', description: 'Product bewerken — PATCH /products/:id', color: 'text-yellow-700 dark:text-yellow-400' },
  { key: 'products.delete', label: 'Verwijderen', description: 'Product verwijderen — DELETE /products/:id', color: 'text-red-700 dark:text-red-400' },
];

export default function ProductsPage() {
  return (
    <Tabs defaultValue="products" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="products">Producten</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="products" className="p-6">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Configuratie</h1>
            <p className="text-sm text-muted-foreground">Permissievereisten per actie</p>
          </div>
          <PermissionsConfig permissions={PRODUCTS_PERMISSIONS} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
