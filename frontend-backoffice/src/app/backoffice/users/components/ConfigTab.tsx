'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { moduleConfigService, type ModuleConfigEntry } from '@/services/module-config.service';

const USER_PERMISSIONS = [
  {
    key: 'users.read',
    label: 'Lezen',
    description: 'Gebruikers bekijken — GET /users en GET /users/:id',
    color: 'text-blue-700 dark:text-blue-400',
  },
  {
    key: 'users.create',
    label: 'Aanmaken',
    description: 'Nieuwe gebruikers aanmaken — POST /users',
    color: 'text-green-700 dark:text-green-400',
  },
  {
    key: 'users.update',
    label: 'Bewerken',
    description: 'Gebruikers bewerken — PATCH /users/:id',
    color: 'text-yellow-700 dark:text-yellow-400',
  },
  {
    key: 'users.delete',
    label: 'Verwijderen',
    description: 'Gebruikers verwijderen — DELETE /users/:id en bulk',
    color: 'text-red-700 dark:text-red-400',
  },
  {
    key: 'permissions.manage',
    label: 'Rechten beheren',
    description: 'Permissies toewijzen en intrekken — GET/PATCH /module-config',
    color: 'text-purple-700 dark:text-purple-400',
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
          {USER_PERMISSIONS.map(({ key, label, description, color }) => {
            const required = isRequired(key);
            return (
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
                    checked={required}
                    onCheckedChange={(v) => handleToggle(key, v as boolean)}
                    disabled={toggling === key}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
