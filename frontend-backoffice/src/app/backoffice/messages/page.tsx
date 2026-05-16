'use client';

import { useCallback, useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { messagesService, type ContactMessage } from '@/services/messages.service';
import { MessagesTable } from './components/MessagesTable';
import { MessagePanel } from './components/MessagePanel';
import { BulkDeleteBar } from './components/BulkDeleteBar';
import { ConfigTab } from './components/ConfigTab';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<ContactMessage | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await messagesService.getAll();
      setMessages(data);
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
    setSelected(checked ? new Set(messages.map((m) => m.id)) : new Set());
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm(`Bericht van ${msg.naam} verwijderen?`)) return;
    await messagesService.remove(msg.id);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(msg.id); return n; });
    if (panel?.id === msg.id) setPanel(null);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} bericht(en) verwijderen?`)) return;
    setBulkDeleting(true);
    try {
      await messagesService.bulkRemove([...selected]);
      setMessages((prev) => prev.filter((m) => !selected.has(m.id)));
      if (panel && selected.has(panel.id)) setPanel(null);
      setSelected(new Set());
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleRead = (updated: ContactMessage) => {
    setMessages((prev) => prev.map((m) => m.id === updated.id ? updated : m));
    setPanel(updated);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <Tabs defaultValue="messages" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="messages">Berichten</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="messages" className="p-6 space-y-3">
          <div>
            <h1 className="text-xl font-semibold">Berichten</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} ongelezen` : 'Alle berichten gelezen'}
            </p>
          </div>

          <MessagesTable
            messages={messages}
            loading={loading}
            selected={selected}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onOpen={setPanel}
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

      <MessagePanel
        message={panel}
        onClose={() => setPanel(null)}
        onRead={handleRead}
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
