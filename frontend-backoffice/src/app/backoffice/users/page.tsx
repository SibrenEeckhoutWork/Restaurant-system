'use client';

import { useCallback, useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usersService, type User } from '@/services/users.service';
import { UsersTable } from './components/UsersTable';
import { UserPanel } from './components/UserPanel';
import { BulkDeleteBar } from './components/BulkDeleteBar';
import { ConfigTab } from './components/ConfigTab';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; user: User | null } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
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
    setSelected(checked ? new Set(users.map((u) => u.id)) : new Set());
  };

  const handleEdit = (user: User) => setPanel({ mode: 'edit', user });

  const handleDelete = async (user: User) => {
    if (!confirm(`${user.firstName} ${user.lastName} verwijderen?`)) return;
    await usersService.remove(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(user.id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} gebruiker(s) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await usersService.bulkRemove([...selected]);
      setUsers((prev) => prev.filter((u) => !selected.has(u.id)));
      setSelected(new Set());
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleSaved = (saved: User) => {
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setPanel(null);
  };

  return (
    <Tabs defaultValue="users" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="users">Gebruikers</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="users" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Gebruikers</h1>
              <p className="text-sm text-muted-foreground">Beheer accounts en permissies</p>
            </div>
            <Button size="sm" onClick={() => setPanel({ mode: 'create', user: null })}>
              <UserPlus className="size-4 mr-2" />
              Nieuwe gebruiker
            </Button>
          </div>

          <UsersTable
            users={users}
            loading={loading}
            selected={selected}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Configuratie</h1>
            <p className="text-sm text-muted-foreground">Permissievereisten per actie</p>
          </div>
          <ConfigTab />
        </TabsContent>
      </div>

      <UserPanel
        mode={panel?.mode ?? null}
        user={panel?.user ?? null}
        onClose={() => setPanel(null)}
        onSaved={handleSaved}
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
