'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, DoorOpen, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { roomsService, type Room } from '@/services/rooms.service';
import { RoomPanel } from './components/RoomPanel';
import { BulkDeleteBar } from './components/BulkDeleteBar';
import { ConfigTab } from './components/ConfigTab';
import { cn } from '@/lib/utils';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRooms, setOpenRooms] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<{ mode: 'create' | 'edit'; room: Room | null } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomsService.getAll();
      setRooms(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRoom = (id: string) =>
    setOpenRooms((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(rooms.map((r) => r.id)) : new Set());
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!confirm(`Ruimte "${room.name}" verwijderen? Alle tafels worden ook verwijderd.`)) return;
    await roomsService.remove(room.id);
    setRooms((prev) => prev.filter((r) => r.id !== room.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(room.id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} ruimte(s) verwijderen? Alle bijhorende tafels worden ook verwijderd.`)) return;
    setBulkDeleting(true);
    try {
      await roomsService.bulkRemove([...selected]);
      setRooms((prev) => prev.filter((r) => !selected.has(r.id)));
      setSelected(new Set());
    } finally {
      setBulkDeleting(false);
    }
  };

  const allSelected = rooms.length > 0 && rooms.every((r) => selected.has(r.id));
  const someSelected = rooms.some((r) => selected.has(r.id)) && !allSelected;

  return (
    <Tabs defaultValue="rooms" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="rooms">Ruimtes</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="rooms" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Ruimtes</h1>
              <p className="text-sm text-muted-foreground">Beheer zalen en hun capaciteit</p>
            </div>
            <Button size="sm" onClick={() => setPanel({ mode: 'create', room: null })}>
              <DoorOpen className="size-4 mr-2" />
              Nieuwe ruimte
            </Button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
              Geen ruimtes gevonden.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-1">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={(v) => handleSelectAll(!!v)}
                  aria-label="Alles selecteren"
                />
                <span className="text-xs text-muted-foreground">Alles selecteren</span>
              </div>
              <div className="space-y-2">
                {rooms.map((room) => {
                  const isOpen = openRooms.has(room.id);
                  return (
                    <Collapsible key={room.id} open={isOpen} onOpenChange={() => toggleRoom(room.id)}>
                      <div className="rounded-lg border overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selected.has(room.id)}
                              onCheckedChange={(v) => handleSelect(room.id, !!v)}
                              aria-label={`Selecteer ${room.name}`}
                            />
                          </div>
                          <CollapsibleTrigger className="flex items-center gap-3 flex-1 text-left">
                            <ChevronRight
                              className={cn(
                                'size-4 text-muted-foreground transition-transform duration-200 shrink-0',
                                isOpen && 'rotate-90',
                              )}
                            />
                            <span className="font-medium">{room.name}</span>
                            <Badge variant="secondary">{room.capacity} plaatsen</Badge>
                            <Badge variant="outline">
                              {room.tables.length} tafel{room.tables.length !== 1 ? 's' : ''}
                            </Badge>
                          </CollapsibleTrigger>

                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setPanel({ mode: 'edit', room })}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteRoom(room)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="border-t px-4 py-3 text-sm text-muted-foreground bg-muted/20">
                            {room.tables.length === 0 ? (
                              <span>Geen tafels in deze ruimte.</span>
                            ) : (
                              <ul className="space-y-1">
                                {room.tables.map((t) => (
                                  <li key={t.id} className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{t.name}</span>
                                    <span>— {t.capacity} personen</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </>
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

      <RoomPanel
        mode={panel?.mode ?? null}
        room={panel?.room ?? null}
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
