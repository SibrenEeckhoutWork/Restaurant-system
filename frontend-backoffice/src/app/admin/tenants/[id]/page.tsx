'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tenantsAdminService, type Tenant, type ModuleConfig } from '@/services/admin/tenants.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

const MODULE_GROUPS: { label: string; permissions: string[] }[] = [
  { label: 'Gebruikers', permissions: ['users.read', 'users.create', 'users.update', 'users.delete'] },
  { label: 'Zalen & Tafels', permissions: ['rooms.get', 'rooms.create', 'rooms.update', 'rooms.delete', 'tables.get', 'tables.create', 'tables.update', 'tables.delete'] },
  { label: 'Bestellingen', permissions: ['orders.read', 'orders.create', 'orders.update', 'orders.delete'] },
  { label: 'Reservaties', permissions: ['reservations.read', 'reservations.create', 'reservations.update', 'reservations.delete'] },
  { label: 'Menu', permissions: ['menu.read', 'menu.create', 'menu.update', 'menu.delete'] },
  { label: 'Klanten', permissions: ['customers.read', 'customers.create', 'customers.update', 'customers.delete'] },
];

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    Promise.all([
      tenantsAdminService.getById(id),
      tenantsAdminService.getModules(id),
    ])
      .then(([t, m]) => {
        setTenant(t);
        setModules(m);
        setName(t.name);
        setSlug(t.slug);
        setIsActive(t.isActive);
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, [id]);

  function isEnabled(permission: string): boolean {
    const cfg = modules.find((m) => m.permission === permission);
    return cfg === undefined ? true : cfg.required;
  }

  async function toggleModule(permission: string, enabled: boolean) {
    const updated = await tenantsAdminService.setModule(id, permission, enabled);
    setModules((prev) => {
      const existing = prev.find((m) => m.permission === permission);
      if (existing) return prev.map((m) => (m.permission === permission ? updated : m));
      return [...prev, updated];
    });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const updated = await tenantsAdminService.update(id, { name, slug, isActive });
      setTenant(updated);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Tenant "${tenant?.name}" verwijderen? Dit kan niet ongedaan worden.`)) return;
    await tenantsAdminService.remove(id);
    router.push('/admin/tenants');
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Laden...</p>;
  if (!tenant) return <p className="text-sm text-destructive">Tenant niet gevonden.</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/tenants" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">{tenant.name}</h1>
          <p className="text-muted-foreground text-sm">{tenant.slug}</p>
        </div>
      </div>

      {/* Tenant info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tenant info</CardTitle>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Bewerken
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <Label>Naam</Label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="active">Actief</Label>
              </div>
              {saveError && <p className="text-sm text-destructive">{saveError}</p>}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? 'Opslaan...' : 'Opslaan'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                  Annuleren
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-2 text-sm">
              <div className="flex gap-4">
                <dt className="w-24 text-muted-foreground">Naam</dt>
                <dd>{tenant.name}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 text-muted-foreground">Slug</dt>
                <dd>{tenant.slug}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 text-muted-foreground">Status</dt>
                <dd>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${tenant.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {tenant.isActive ? 'Actief' : 'Inactief'}
                  </span>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 text-muted-foreground">Aangemaakt</dt>
                <dd>{new Date(tenant.createdAt).toLocaleDateString('nl-BE')}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      {/* Module config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {MODULE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-medium mb-2">{group.label}</p>
              <div className="space-y-2">
                {group.permissions.map((permission) => (
                  <div key={permission} className="flex items-center justify-between">
                    <Label className="text-sm font-normal text-muted-foreground">{permission}</Label>
                    <Switch
                      checked={isEnabled(permission)}
                      onCheckedChange={(checked) => toggleModule(permission, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Gevarenzone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={14} className="mr-1" />
            Tenant verwijderen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
