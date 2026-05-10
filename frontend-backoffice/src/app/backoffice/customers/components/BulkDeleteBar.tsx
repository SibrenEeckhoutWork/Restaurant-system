'use client';

import { Loader2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  count: number;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkDeleteBar({ count, loading, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-t bg-background px-6 py-3 shadow-lg md:left-[var(--sidebar-width)]">
      <span className="text-sm font-medium">
        {count} klant{count !== 1 ? 'en' : ''} geselecteerd
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          <X className="size-4 mr-1" />
          Deselecteren
        </Button>
        <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
          {loading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Trash2 className="size-4 mr-1" />}
          Verwijderen
        </Button>
      </div>
    </div>
  );
}
