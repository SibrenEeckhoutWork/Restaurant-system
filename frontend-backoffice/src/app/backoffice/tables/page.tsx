'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tablesService, type Table as TableType } from '@/services/tables.service';
import { roomsService, type Room } from '@/services/rooms.service';
import { TablesTable } from './components/TablesTable';
import { TablePanel } from './components/TablePanel';
import { BulkDeleteBar } from './components/BulkDeleteBar';
import { ConfigTab } from './components/ConfigTab';

export default function TablesPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; table: TableType | null } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tablesData, roomsData] = await Promise.all([
        tablesService.getAll(),
        roomsService.getAll(),
      ]);
      setTables(tablesData);
      setRooms(roomsData);
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
    setSelected(checked ? new Set(tables.map((t) => t.id)) : new Set());
  };

  const handleEdit = (table: TableType) => setPanel({ mode: 'edit', table });

  const handleDelete = async (table: TableType) => {
    if (!confirm(`Tafel "${table.name}" verwijderen?`)) return;
    await tablesService.remove(table.id);
    setTables((prev) => prev.filter((t) => t.id !== table.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(table.id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} tafel(s) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await tablesService.bulkRemove([...selected]);
      setTables((prev) => prev.filter((t) => !selected.has(t.id)));
      setSelected(new Set());
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <Tabs defaultValue="tables" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="tables">Tafels</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="tables" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Tafels</h1>
              <p className="text-sm text-muted-foreground">Beheer tafels per ruimte</p>
            </div>
            <Button
              size="sm"
              onClick={() => setPanel({ mode: 'create', table: null })}
              disabled={rooms.length === 0}
            >
              <Plus className="size-4 mr-2" />
              Nieuwe tafel
            </Button>
          </div>

          <TablesTable
            tables={tables}
            loading={loading}
            selected={selected}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {rooms.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground text-center">
              Maak eerst een ruimte aan via{' '}
              <a href="/backoffice/rooms" className="underline">Ruimtes</a>.
            </p>
          )}
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Configuratie</h1>
            <p className="text-sm text-muted-foreground">Permissievereisten per actie</p>
          </div>
          <ConfigTab />
        </TabsContent>
      </div>

      <TablePanel
        mode={panel?.mode ?? null}
        table={panel?.table ?? null}
        rooms={rooms}
        onClose={() => setPanel(null)}
        onSaved={async () => {
          setPanel(null);
          await load();
        }}
      />

      {selected.size > 0 && (
        <BulkDeleteBar
          count={selected.size}
          loading={bulkDeleting}
          onConfirm={handleBulkDelete}
          onCancel={() => setSelected(new Set())}
        />
      )}
    </Tabs>
  );
}
