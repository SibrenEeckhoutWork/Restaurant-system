'use client';

import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { type ContactMessage } from '@/services/messages.service';

interface Props {
  messages: ContactMessage[];
  loading: boolean;
  selected: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOpen: (message: ContactMessage) => void;
  onDelete: (message: ContactMessage) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function MessagesTable({ messages, loading, selected, onSelect, onSelectAll, onOpen, onDelete }: Props) {
  const allSelected = messages.length > 0 && messages.every((m) => selected.has(m.id));
  const someSelected = messages.some((m) => selected.has(m.id)) && !allSelected;

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(v) => onSelectAll(!!v)}
                aria-label="Alles selecteren"
              />
            </TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Onderwerp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="size-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                <TableCell />
              </TableRow>
            ))
          ) : messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10 text-sm">
                Nog geen berichten ontvangen.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow key={msg.id} className="cursor-pointer" onClick={() => onOpen(msg)}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(msg.id)}
                    onCheckedChange={(v) => onSelect(msg.id, !!v)}
                    aria-label={`Selecteer bericht van ${msg.naam}`}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {formatDate(msg.createdAt)}
                </TableCell>
                <TableCell className={msg.isRead ? '' : 'font-semibold'}>{msg.naam}</TableCell>
                <TableCell className="text-muted-foreground">{msg.email}</TableCell>
                <TableCell>{msg.onderwerp}</TableCell>
                <TableCell>
                  {!msg.isRead && <Badge variant="default">Nieuw</Badge>}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(msg)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
