'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { moduleConfigService } from '@/services/module-config.service';

const GROUPS = [
  {
    label: 'Producten',
    permissions: [
      { key: 'products.get', label: 'Bekijken', description: 'Producten oplijsten en ophalen — GET /products', color: 'text-blue-700 dark:text-blue-400' },
      { key: 'products.create', label: 'Aanmaken', description: 'Nieuw product aanmaken — POST /products', color: 'text-green-700 dark:text-green-400' },
      { key: 'products.update', label: 'Bewerken', description: 'Product bewerken — PATCH /products/:id', color: 'text-yellow-700 dark:text-yellow-400' },
      { key: 'products.delete', label: 'Verwijderen', description: 'Product verwijderen — DELETE /products/:id', color: 'text-red-700 dark:text-red-400' },
    ],
  },
  {
    label: 'Categorieën',
    permissions: [
      { key: 'categories.get', label: 'Bekijken', description: 'Categorieën oplijsten — GET /categories', color: 'text-blue-700 dark:text-blue-400' },
      { key: 'categories.create', label: 'Aanmaken', description: 'Nieuwe categorie — POST /categories', color: 'text-green-700 dark:text-green-400' },
      { key: 'categories.update', label: 'Bewerken', description: 'Categorie bewerken — PATCH /categories/:id', color: 'text-yellow-700 dark:text-yellow-400' },
      { key: 'categories.delete', label: 'Verwijderen', description: 'Categorie verwijderen — DELETE /categories/:id', color: 'text-red-700 dark:text-red-400' },
    ],
  },
  {
    label: 'Allergenen',
    permissions: [
      { key: 'allergies.get', label: 'Bekijken', description: 'Allergenen oplijsten — GET /allergies', color: 'text-blue-700 dark:text-blue-400' },
      { key: 'allergies.create', label: 'Aanmaken', description: 'Nieuw allergeen — POST /allergies', color: 'text-green-700 dark:text-green-400' },
      { key: 'allergies.update', label: 'Bewerken', description: 'Allergeen bewerken — PATCH /allergies/:id', color: 'text-yellow-700 dark:text-yellow-400' },
      { key: 'allergies.delete', label: 'Verwijderen', description: 'Allergeen verwijderen — DELETE /allergies/:id', color: 'text-red-700 dark:text-red-400' },
    ],
  },
  {
    label: "Extra's",
    permissions: [
      { key: 'accessories.get', label: 'Bekijken', description: "Extra's oplijsten — GET /accessories", color: 'text-blue-700 dark:text-blue-400' },
      { key: 'accessories.create', label: 'Aanmaken', description: "Nieuw extra — POST /accessories", color: 'text-green-700 dark:text-green-400' },
      { key: 'accessories.update', label: 'Bewerken', description: "Extra bewerken — PATCH /accessories/:id", color: 'text-yellow-700 dark:text-yellow-400' },
      { key: 'accessories.delete', label: 'Verwijderen', description: "Extra verwijderen — DELETE /accessories/:id", color: 'text-red-700 dark:text-red-400' },
    ],
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="size-4 animate-spin" />
        Laden...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Shield className="size-4" />
        <span>Schakel permissies uit om acties open te stellen voor alle ingelogde gebruikers.</span>
      </div>

      {GROUPS.map((group) => (
        <div key={group.label} className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
          {group.permissions.map(({ key, label, description, color }) => (
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
      ))}
    </div>
  );
}
