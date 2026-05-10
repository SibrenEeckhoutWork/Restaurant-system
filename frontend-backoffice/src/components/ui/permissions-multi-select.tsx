'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ALL_PERMISSIONS } from '@/lib/permissions';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function PermissionsMultiSelect({ value, onChange, placeholder = 'Selecteer permissies...' }: Props) {
  const toggle = (perm: string) => {
    onChange(value.includes(perm) ? value.filter((p) => p !== perm) : [...value, perm]);
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm min-h-9 hover:bg-accent/30 transition-colors">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 text-left">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {value.slice(0, 3).map((p) => (
                <Badge key={p} variant="secondary" className="text-xs font-normal">
                  {p}
                </Badge>
              ))}
              {value.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{value.length - 3}
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-1" side="bottom" align="start">
        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {ALL_PERMISSIONS.map((perm) => (
            <button
              key={perm}
              type="button"
              onClick={() => toggle(perm)}
              className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors text-left"
            >
              <Checkbox
                checked={value.includes(perm)}
                onCheckedChange={() => toggle(perm)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="flex-1">{perm}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
