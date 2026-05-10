'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { moduleConfigService } from '@/services/module-config.service';

const TABLE_PERMISSIONS = [
  {
    key: 'tables.get',
    label: 'Bekijken',
    description: 'Tafels bekijken — GET /tables en GET /tables/:id',
    color: 'text-blue-700 dark:text-blue-400',
  },
  {
    key: 'tables.create',
    label: 'Aanmaken',
    description: 'Nieuwe tafel aanmaken — POST /tables',
    color: 'text-green-700 dark:text-green-400',
  },
  {
    key: 'tables.update',
    label: 'Bewerken',
    description: 'Tafel bewerken — PATCH /tables/:id',
    color: 'text-yellow-700 dark:text-yellow-400',
  },
  {
    key: 'tables.delete',
    label: 'Verwijderen',
    description: 'Tafel verwijderen — DELETE /tables/:id',
    color: 'text-red-700 dark:text-red-400',
  },
];

export function ConfigTab() {
  const [config, setConfig] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    moduleConfigService.getAll().then((entries) => {
      const map: Record<string, boolean> = {};
      entries.forEach((e) => { map[e.permission] = e.required; });
      setConfig(map);
    }).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (permission: string, required: boolean) => {
    setToggling(permission);
    try {
      await moduleConfigService.setRequired(permission, required);
      setConfig((prev) => ({ ...prev, [permission]: required }));
    } finally {
      setToggling(null);
    }
  };

  const isRequired = (key: string) => config[key] !== false;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Shield className="size-4" />
        <span>Schakel permissies uit om acties open te stellen voor alle ingelogde gebruikers.</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="size-4 animate-spin" />
          Laden...
        </div>
      ) : (
        <div className="space-y-2">
          {TABLE_PERMISSIONS.map(({ key, label, description, color }) => (
            <div key={key} className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{key}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {toggling === key && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
                <Switch
                  checked={isRequired(key)}
                  onCheckedChange={(v) => handleToggle(key, v as boolean)}
                  disabled={toggling === key}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
