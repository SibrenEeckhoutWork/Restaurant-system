'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessoriesTab } from '../components/AccessoriesTab';
import { PermissionsConfig } from '../components/PermissionsConfig';

const PERMISSIONS = [
  { key: 'accessories.get', label: 'Bekijken', description: "Extra's oplijsten — GET /accessories", color: 'text-blue-700 dark:text-blue-400' },
  { key: 'accessories.create', label: 'Aanmaken', description: "Nieuw extra aanmaken — POST /accessories", color: 'text-green-700 dark:text-green-400' },
  { key: 'accessories.update', label: 'Bewerken', description: "Extra bewerken — PATCH /accessories/:id", color: 'text-yellow-700 dark:text-yellow-400' },
  { key: 'accessories.delete', label: 'Verwijderen', description: "Extra verwijderen — DELETE /accessories/:id", color: 'text-red-700 dark:text-red-400' },
];

export default function AccessoriesPage() {
  return (
    <Tabs defaultValue="accessories" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="accessories">Extra&apos;s</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="accessories" className="p-6">
          <AccessoriesTab />
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
