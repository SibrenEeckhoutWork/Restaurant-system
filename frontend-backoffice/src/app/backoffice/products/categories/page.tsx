'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTab } from '../components/CategoriesTab';
import { PermissionsConfig } from '../components/PermissionsConfig';

const PERMISSIONS = [
  { key: 'categories.get', label: 'Bekijken', description: 'Categorieën oplijsten — GET /categories', color: 'text-blue-700 dark:text-blue-400' },
  { key: 'categories.create', label: 'Aanmaken', description: 'Nieuwe categorie aanmaken — POST /categories', color: 'text-green-700 dark:text-green-400' },
  { key: 'categories.update', label: 'Bewerken', description: 'Categorie bewerken — PATCH /categories/:id', color: 'text-yellow-700 dark:text-yellow-400' },
  { key: 'categories.delete', label: 'Verwijderen', description: 'Categorie verwijderen — DELETE /categories/:id', color: 'text-red-700 dark:text-red-400' },
];

export default function CategoriesPage() {
  return (
    <Tabs defaultValue="categories" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="categories">Categorieën</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="categories" className="p-6">
          <CategoriesTab />
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
