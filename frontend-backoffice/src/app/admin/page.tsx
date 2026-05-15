'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tenantsAdminService, type Tenant } from '@/services/admin/tenants.service';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tenantsAdminService
      .getAll()
      .then(setTenants)
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overzicht van je SaaS platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Totaal tenants</CardTitle>
            <Building2 className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoading ? '—' : tenants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Actieve tenants</CardTitle>
            <Building2 className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? '—' : tenants.filter((t) => t.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactieve tenants</CardTitle>
            <Building2 className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? '—' : tenants.filter((t) => !t.isActive).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recente tenants</h2>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/tenants">Alle tenants</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laden...</p>
      ) : tenants.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nog geen tenants aangemaakt.</p>
      ) : (
        <div className="space-y-2">
          {tenants.slice(0, 5).map((t) => (
            <Link
              key={t.id}
              href={`/admin/tenants/${t.id}`}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.slug}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {t.isActive ? 'Actief' : 'Inactief'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
