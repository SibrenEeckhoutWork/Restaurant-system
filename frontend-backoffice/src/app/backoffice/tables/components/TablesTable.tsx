'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Table as TableType } from '@/services/tables.service';

interface Props {
  tables: TableType[];
  loading: boolean;
  selected: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (table: TableType) => void;
  onDelete: (table: TableType) => void;
}

export function TablesTable({ tables, loading, selected, onSelect, onSelectAll, onEdit, onDelete }: Props) {
  const allSelected = tables.length > 0 && tables.every((t) => selected.has(t.id));
  const someSelected = tables.some((t) => selected.has(t.id)) && !allSelected;

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
            <TableHead>Naam</TableHead>
            <TableHead>Capaciteit</TableHead>
            <TableHead>Ruimte</TableHead>
            <TableHead className="w-24 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="size-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell />
              </TableRow>
            ))
          ) : tables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                Geen tafels gevonden.
              </TableCell>
            </TableRow>
          ) : (
            tables.map((table) => (
              <TableRow key={table.id} className="cursor-pointer" onClick={() => onEdit(table)}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(table.id)}
                    onCheckedChange={(v) => onSelect(table.id, !!v)}
                    aria-label={`Selecteer ${table.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell className="text-muted-foreground">{table.capacity}</TableCell>
                <TableCell>
                  {table.room ? (
                    <Badge variant="secondary">{table.room.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm italic">—</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(table)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(table)}
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
