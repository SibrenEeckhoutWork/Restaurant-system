'use client';

import { useCallback, useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { customersService, type Customer } from '@/services/customers.service';
import { CustomersTable } from './components/CustomersTable';
import { CustomerPanel } from './components/CustomerPanel';
import { BulkDeleteBar } from './components/BulkDeleteBar';
import { ConfigTab } from './components/ConfigTab';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; customer: Customer | null } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customersService.getAll();
      setCustomers(data);
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
    setSelected(checked ? new Set(customers.map((c) => c.id)) : new Set());
  };

  const handleEdit = (customer: Customer) => setPanel({ mode: 'edit', customer });

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`${customer.name} verwijderen?`)) return;
    await customersService.remove(customer.id);
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(customer.id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} klant(en) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await customersService.bulkRemove([...selected]);
      setCustomers((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleSaved = (saved: Customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    setPanel(null);
  };

  return (
    <Tabs defaultValue="customers" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="customers">Klanten</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="customers" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Klanten</h1>
              <p className="text-sm text-muted-foreground">Beheer klantaccounts</p>
            </div>
            <Button size="sm" onClick={() => setPanel({ mode: 'create', customer: null })}>
              <UserPlus className="size-4 mr-2" />
              Nieuwe klant
            </Button>
          </div>

          <CustomersTable
            customers={customers}
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

      <CustomerPanel
        mode={panel?.mode ?? null}
        customer={panel?.customer ?? null}
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
