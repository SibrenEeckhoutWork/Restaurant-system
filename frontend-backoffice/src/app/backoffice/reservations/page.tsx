'use client';

import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Reservation } from '@/services/reservations.service';
import { ReservationsAgenda } from './components/ReservationsAgenda';
import { ReservationsList } from './components/ReservationsList';
import { TimeslotsTab } from './components/TimeslotsTab';
import { ReservationPanel } from './components/ReservationPanel';
import { ConfigTab } from './components/ConfigTab';

export default function ReservationsPage() {
  const [panel, setPanel] = useState<{
    mode: 'create' | 'view';
    reservation: Reservation | null;
    defaultDate?: string;
  } | null>(null);
  const [listKey, setListKey] = useState(0);

  const openCreate = (date?: string) =>
    setPanel({ mode: 'create', reservation: null, defaultDate: date });
  const openView = (r: Reservation) => setPanel({ mode: 'view', reservation: r });
  const closePanel = () => setPanel(null);

  const handleSaved = () => {
    setPanel(null);
    setListKey((k) => k + 1);
  };

  return (
    <Tabs defaultValue="agenda" className="flex flex-col h-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border" />
        <TabsList variant="line">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="lijst">Lijst</TabsTrigger>
          <TabsTrigger value="tijdslots">Tijdslots</TabsTrigger>
          <TabsTrigger value="config">Configuratie</TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto">
        <TabsContent value="agenda" className="p-6">
          <ReservationsAgenda
            onSelectReservation={openView}
            onCreateReservation={(date) => openCreate(date)}
          />
        </TabsContent>

        <TabsContent value="lijst" className="p-6">
          <ReservationsList
            key={listKey}
            onSelect={openView}
            onCreate={() => openCreate()}
          />
        </TabsContent>

        <TabsContent value="tijdslots" className="p-6">
          <TimeslotsTab />
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Configuratie</h1>
            <p className="text-sm text-muted-foreground">Permissievereisten per actie</p>
          </div>
          <ConfigTab />
        </TabsContent>
      </div>

      <ReservationPanel
        mode={panel?.mode ?? null}
        reservation={panel?.reservation ?? null}
        defaultDate={panel?.defaultDate}
        onClose={closePanel}
        onSaved={handleSaved}
      />
    </Tabs>
  );
}
