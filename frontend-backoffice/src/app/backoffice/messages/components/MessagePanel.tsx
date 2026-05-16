'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { messagesService, type ContactMessage } from '@/services/messages.service';

interface Props {
  message: ContactMessage | null;
  onClose: () => void;
  onRead: (updated: ContactMessage) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagePanel({ message, onClose, onRead }: Props) {
  const [marking, setMarking] = useState(false);

  if (!message) return null;

  const handleMarkRead = async () => {
    setMarking(true);
    try {
      const updated = await messagesService.markRead(message.id);
      onRead(updated);
    } finally {
      setMarking(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-[480px] bg-background border-l shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-base">Bericht</h2>
            {!message.isRead && <Badge variant="default">Nieuw</Badge>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <dl className="text-sm space-y-2">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Datum</dt>
              <dd>{formatDate(message.createdAt)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Naam</dt>
              <dd>{message.naam}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">E-mail</dt>
              <dd>
                <a href={`mailto:${message.email}`} className="underline underline-offset-2">
                  {message.email}
                </a>
              </dd>
            </div>
            {message.telefoon && (
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Telefoon</dt>
                <dd>
                  <a href={`tel:${message.telefoon}`} className="underline underline-offset-2">
                    {message.telefoon}
                  </a>
                </dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-muted-foreground">Onderwerp</dt>
              <dd>{message.onderwerp}</dd>
            </div>
          </dl>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-1">Bericht</p>
            <p className="text-sm whitespace-pre-wrap">{message.bericht}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Sluiten
          </Button>
          {!message.isRead && (
            <Button className="flex-1" onClick={handleMarkRead} disabled={marking}>
              {marking && <Loader2 className="size-4 mr-2 animate-spin" />}
              Markeer als gelezen
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
