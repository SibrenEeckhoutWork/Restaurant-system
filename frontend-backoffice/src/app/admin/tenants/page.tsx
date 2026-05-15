'use client';

import { useEffect, useState, FormEvent } from 'react';
import { tenantsAdminService, type Tenant } from '@/services/admin/tenants.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = () => {
    setIsLoading(true);
    tenantsAdminService
      .getAll()
      .then(setTenants)
      .catch(() => null)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await tenantsAdminService.create({ name, slug });
      setName('');
      setSlug('');
      setShowCreate(false);
      load();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Fout bij aanmaken');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="text-muted-foreground text-sm">Beheer alle restaurants op jouw platform</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={16} className="mr-1" />
          Nieuwe tenant
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nieuwe tenant aanmaken</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4 max-w-sm">
              <div className="space-y-1">
                <Label htmlFor="name">Naam</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Restaurant De Wever"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="restaurant-de-wever"
                />
                <p className="text-xs text-muted-foreground">Alleen kleine letters, cijfers en koppeltekens.</p>
              </div>
              {createError && <p className="text-sm text-destructive">{createError}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} size="sm">
                  {creating ? 'Aanmaken...' : 'Aanmaken'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreate(false)}>
                  Annuleren
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laden...</p>
      ) : tenants.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nog geen tenants aangemaakt.</p>
      ) : (
        <div className="space-y-2">
          {tenants.map((t) => (
            <Link
              key={t.id}
              href={`/admin/tenants/${t.id}`}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t.isActive ? 'Actief' : 'Inactief'}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
