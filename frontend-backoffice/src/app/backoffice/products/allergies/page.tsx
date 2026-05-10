'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllergiesTab } from '../components/AllergiesTab';
import { PermissionsConfig } from '../components/PermissionsConfig';

const PERMISSIONS = [
  { key: 'allergies.get', label: 'Bekijken', description: 'Allergenen oplijsten — GET /allergies', color: 'text-blue-700 dark:text-blue-400' },
  { key: 'allergies.create', label: 'Aanmaken', description: 'Nieuw allergeen aanmaken — POST /allergies', color: 'text-green-700 dark:text-green-400' },
  { key: 'allergies.update', label: 'Bewerken', description: 'Allergeen bewerken — PATCH /allergies/:id', color: 'text-yellow-700 dark:text-yellow-400' },
  { key: 'allergies.delete', label: 'Verwijderen', description: 'Allergeen verwijderen — DELETE /allergies/:id', color: 'text-red-700 dark:text-red-400' },
];

export default function AllergiesPage() {
  return (
    <Tabs defaultValue="allergies" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="allergies">Allergenen</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="allergies" className="p-6">
          <AllergiesTab />
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
