'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  tenantsAdminService,
  type Tenant,
  type ModuleConfig,
  type SiteConfig,
  type SlotEntry,
  type PageConfig,
  type ColorConfig,
  type FontConfig,
  type PageKey,
} from '@/services/admin/tenants.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ChevronDown, ChevronUp, Trash2, X, Plus } from 'lucide-react';
import Link from 'next/link';

/* ── Slot definitions (mirrors commerce SLOT_REGISTRY) ─────────────────── */

const SLOT_DEFINITIONS = [
  { type: 'hero',               label: 'Hero',                 variants: [{ key: 'default', label: 'Standaard' }, { key: 'centered', label: 'Gecentreerd (zonder foto)' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'story',              label: 'Verhaal',              variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'serve-grid',         label: 'Menu highlight',       variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'heritage',           label: 'Erfgoed',              variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'reservation-cta',    label: 'Reservatie banner',    variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'menu',               label: 'Volledige menukaart',  variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'reservation-wizard', label: 'Reservatie wizard',    variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'box-order-hero',     label: 'Bestellen hero',       variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'box-order',          label: 'Box selectie',         variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'box-order-steps',    label: 'Hoe werkt het',        variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'box-order-faq',      label: 'FAQ',                  variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'contact',            label: 'Contact',              variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'gallery',            label: 'Galerij',              variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
  { type: 'visit',              label: 'Bezoek & locatie',     variants: [{ key: 'default', label: 'Standaard' }, { key: 'zoete-wever', label: 'De Zoete Wever' }] },
] as const;

const COLOR_FIELDS: { key: keyof ColorConfig; label: string }[] = [
  { key: 'primary',    label: 'Primaire kleur' },
  { key: 'secondary',  label: 'Secundaire kleur' },
  { key: 'accent',     label: 'Accent kleur' },
  { key: 'background', label: 'Achtergrondkleur' },
  { key: 'text',       label: 'Tekstkleur' },
  { key: 'muted',      label: 'Subtiele tekstkleur' },
];

const HEADING_FONTS = [
  { key: 'instrument-serif', label: 'Instrument Serif' },
  { key: 'playfair',         label: 'Playfair Display' },
  { key: 'cormorant',        label: 'Cormorant Garamond' },
];

const BODY_FONTS = [
  { key: 'geist',    label: 'Geist' },
  { key: 'nunito',   label: 'Nunito' },
  { key: 'raleway',  label: 'Raleway' },
];

const PAGE_KEYS: { key: PageKey; label: string; defaultLabel: string }[] = [
  { key: 'home',       label: 'Homepagina',  defaultLabel: 'Thuis' },
  { key: 'reserveren', label: 'Reserveren',  defaultLabel: 'Reserveren' },
  { key: 'bestellen',  label: 'Bestellen',   defaultLabel: 'Ontbijtbox' },
  { key: 'kaart',      label: 'Menukaart',   defaultLabel: 'Kaart' },
  { key: 'contact',    label: 'Contact',     defaultLabel: 'Contact' },
  { key: 'galerij',    label: 'Galerij',     defaultLabel: 'Galerij' },
];

const MODULE_GROUPS: { label: string; permissions: string[] }[] = [
  { label: 'Gebruikers',    permissions: ['users.read', 'users.create', 'users.update', 'users.delete'] },
  { label: 'Zalen & Tafels', permissions: ['rooms.get', 'rooms.create', 'rooms.update', 'rooms.delete', 'tables.get', 'tables.create', 'tables.update', 'tables.delete'] },
  { label: 'Bestellingen',  permissions: ['orders.read', 'orders.create', 'orders.update', 'orders.delete'] },
  { label: 'Reservaties',   permissions: ['reservations.get', 'reservations.create', 'reservations.update', 'reservations.delete'] },
  { label: 'Menu',          permissions: ['menu.read', 'menu.create', 'menu.update', 'menu.delete'] },
  { label: 'Klanten',       permissions: ['customers.read', 'customers.create', 'customers.update', 'customers.delete'] },
  { label: 'Producten',     permissions: ['products.get', 'products.create', 'products.update', 'products.delete'] },
  { label: 'Categorieën',   permissions: ['categories.get', 'categories.create', 'categories.update', 'categories.delete'] },
  { label: 'Allergenen',    permissions: ['allergies.get', 'allergies.create', 'allergies.update', 'allergies.delete'] },
  { label: 'Permissies',    permissions: ['permissions.manage'] },
];

interface AddState {
  parent: string;
  child: string;
}

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [siteConfigSaving, setSiteConfigSaving] = useState(false);

  // Per-page "add slot" UI state
  const [addState, setAddState] = useState<Partial<Record<PageKey, AddState>>>({});

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
      tenantsAdminService.getSiteConfig(id),
    ])
      .then(([t, m, sc]) => {
        setTenant(t);
        setModules(m);
        setSiteConfig(sc);
        setName(t.name);
        setSlug(t.slug);
        setIsActive(t.isActive);
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, [id]);

  /* ── Module helpers ─────────────────────────────────────────────────── */

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

  /* ── Tenant info save ───────────────────────────────────────────────── */

  async function handleSave(e: { preventDefault(): void }) {
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

  /* ── Color / font helpers ───────────────────────────────────────────── */

  function setColor(key: keyof ColorConfig, value: string) {
    setSiteConfig((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  }

  function setFont(key: keyof FontConfig, value: string) {
    setSiteConfig((prev) => ({ ...prev, fonts: { ...prev.fonts, [key]: value } }));
  }

  /* ── Page helpers ───────────────────────────────────────────────────── */

  function getPage(pageKey: PageKey): PageConfig {
    return siteConfig.pages?.[pageKey] ?? { active: true, slots: [] };
  }

  function setPage(pageKey: PageKey, page: PageConfig) {
    setSiteConfig((prev) => ({ ...prev, pages: { ...prev.pages, [pageKey]: page } }));
  }

  function togglePageActive(pageKey: PageKey) {
    const page = getPage(pageKey);
    setPage(pageKey, { ...page, active: !page.active });
  }

  function getPageSlots(pageKey: PageKey): SlotEntry[] {
    return getPage(pageKey).slots;
  }

  function setPageSlots(pageKey: PageKey, slots: SlotEntry[]) {
    const page = getPage(pageKey);
    setPage(pageKey, { ...page, slots });
  }

  function updateSlotChild(pageKey: PageKey, index: number, child: string) {
    const slots = getPageSlots(pageKey);
    setPageSlots(pageKey, slots.map((s, i) => (i === index ? { ...s, child } : s)));
  }

  function removeSlot(pageKey: PageKey, index: number) {
    setPageSlots(pageKey, getPageSlots(pageKey).filter((_, i) => i !== index));
  }

  function moveSlot(pageKey: PageKey, index: number, dir: -1 | 1) {
    const slots = getPageSlots(pageKey);
    const swap = index + dir;
    if (swap < 0 || swap >= slots.length) return;
    const next = [...slots];
    [next[index], next[swap]] = [next[swap], next[index]];
    setPageSlots(pageKey, next);
  }

  function addSlot(pageKey: PageKey) {
    const state = addState[pageKey];
    if (!state?.parent || !state?.child) return;
    setPageSlots(pageKey, [...getPageSlots(pageKey), { parent: state.parent, child: state.child }]);
    setAddState((prev) => ({ ...prev, [pageKey]: undefined }));
  }

  function setAddParent(pageKey: PageKey, parent: string) {
    const def = SLOT_DEFINITIONS.find((d) => d.type === parent);
    const firstChild = def?.variants[0]?.key ?? 'default';
    setAddState((prev) => ({ ...prev, [pageKey]: { parent, child: firstChild } }));
  }

  function setAddChild(pageKey: PageKey, child: string) {
    setAddState((prev) => ({
      ...prev,
      [pageKey]: { ...(prev[pageKey] ?? { parent: '', child: '' }), child },
    }));
  }

  /* ── Nav helpers ────────────────────────────────────────────────────── */

  function getNavItem(pageKey: PageKey) {
    return siteConfig.nav?.items?.[pageKey] ?? { active: true };
  }

  function setNavItem(pageKey: PageKey, patch: Partial<{ active: boolean; label: string }>) {
    const current = getNavItem(pageKey);
    setSiteConfig((prev) => ({
      ...prev,
      nav: {
        ...prev.nav,
        items: { ...prev.nav?.items, [pageKey]: { ...current, ...patch } },
      },
    }));
  }

  /* ── Site config save ───────────────────────────────────────────────── */

  async function handleSiteConfigSave() {
    setSiteConfigSaving(true);
    try {
      const updated = await tenantsAdminService.updateSiteConfig(id, siteConfig);
      setSiteConfig(updated);
    } finally {
      setSiteConfigSaving(false);
    }
  }

  /* ── Delete ─────────────────────────────────────────────────────────── */

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

      {/* ── Tenant info ── */}
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
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
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

      {/* ── Module config ── */}
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

      {/* ── Commerce configuratie ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commerce configuratie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Colors */}
          <div>
            <p className="text-sm font-medium mb-3">Kleuren</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors?.[key] ?? '#000000'}
                      onChange={(e) => setColor(key, e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors?.[key] ?? '#000000'}
                      maxLength={7}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(key, v);
                      }}
                      className="w-[7ch] text-xs font-mono border rounded px-1 py-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div>
            <p className="text-sm font-medium mb-3">Lettertype</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Titels</Label>
                <select
                  className="w-full text-sm border rounded px-2 py-1 bg-background"
                  value={siteConfig.fonts?.heading ?? 'instrument-serif'}
                  onChange={(e) => setFont('heading', e.target.value)}
                >
                  {HEADING_FONTS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Broodtekst</Label>
                <select
                  className="w-full text-sm border rounded px-2 py-1 bg-background"
                  value={siteConfig.fonts?.body ?? 'geist'}
                  onChange={(e) => setFont('body', e.target.value)}
                >
                  {BODY_FONTS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigatie */}
          <div>
            <p className="text-sm font-medium mb-3">Navigatie</p>
            <div className="space-y-2">
              {[...PAGE_KEYS]
                .sort((a, b) => (getNavItem(a.key).order ?? 99) - (getNavItem(b.key).order ?? 99))
                .map(({ key: pageKey, label: pageLabel, defaultLabel }, idx, sorted) => {
                  const navItem = getNavItem(pageKey);
                  return (
                    <div key={pageKey} className="flex items-center gap-2 border rounded-lg px-3 py-2">
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const prev = sorted[idx - 1];
                            const curOrder = navItem.order ?? idx;
                            const prevOrder = (getNavItem(prev.key).order ?? idx - 1);
                            setNavItem(pageKey, { order: prevOrder });
                            setNavItem(prev.key, { order: curOrder });
                          }}
                          className="p-0.5 disabled:opacity-30 text-muted-foreground hover:text-foreground"
                        ><ChevronUp size={12} /></button>
                        <button
                          type="button"
                          disabled={idx === sorted.length - 1}
                          onClick={() => {
                            const next = sorted[idx + 1];
                            const curOrder = navItem.order ?? idx;
                            const nextOrder = (getNavItem(next.key).order ?? idx + 1);
                            setNavItem(pageKey, { order: nextOrder });
                            setNavItem(next.key, { order: curOrder });
                          }}
                          className="p-0.5 disabled:opacity-30 text-muted-foreground hover:text-foreground"
                        ><ChevronDown size={12} /></button>
                      </div>
                      <Switch
                        checked={navItem.active}
                        onCheckedChange={(checked) => setNavItem(pageKey, { active: checked })}
                      />
                      <span className="text-xs w-20 text-muted-foreground shrink-0">{pageLabel}</span>
                      <input
                        type="text"
                        placeholder={defaultLabel}
                        value={navItem.label ?? ''}
                        onChange={(e) => setNavItem(pageKey, { label: e.target.value || undefined })}
                        className="flex-1 text-sm border rounded px-2 py-1"
                        title="Label in navigatie"
                      />
                      <input
                        type="text"
                        placeholder={pageKey}
                        value={navItem.path ?? ''}
                        onChange={(e) => setNavItem(pageKey, { path: e.target.value || undefined })}
                        className="w-24 text-sm border rounded px-2 py-1 font-mono"
                        title="URL pad (bv. fotos)"
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Pagina secties */}
          <div>
            <p className="text-sm font-medium mb-3">Pagina secties</p>
            <div className="space-y-4">
              {PAGE_KEYS.map(({ key: pageKey, label: pageLabel }) => {
                const page = getPage(pageKey);
                const activeSlots = page.slots;
                const pageAddState = addState[pageKey];
                const selectedTypeDef = SLOT_DEFINITIONS.find((d) => d.type === pageAddState?.parent);

                return (
                  <div key={pageKey} className={`border rounded-lg p-3 space-y-3 ${!page.active ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={page.active}
                        onCheckedChange={() => togglePageActive(pageKey)}
                      />
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {pageLabel}
                      </p>
                    </div>

                    {/* Active slots */}
                    {activeSlots.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">Geen secties</p>
                    )}
                    <div className="space-y-2">
                      {activeSlots.map((slot, idx) => {
                        const typeDef = SLOT_DEFINITIONS.find((d) => d.type === slot.parent);
                        return (
                          <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded px-2 py-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground leading-tight">{typeDef?.label ?? slot.parent}</p>
                              <select
                                className="text-sm font-medium bg-transparent border-0 p-0 focus:outline-none w-full"
                                value={slot.child}
                                onChange={(e) => updateSlotChild(pageKey, idx, e.target.value)}
                              >
                                {(typeDef?.variants ?? [{ key: slot.child, label: slot.child }]).map((v) => (
                                  <option key={v.key} value={v.key}>{v.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSlot(pageKey, idx, -1)}
                                className="p-0.5 disabled:opacity-30 hover:text-foreground text-muted-foreground"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === activeSlots.length - 1}
                                onClick={() => moveSlot(pageKey, idx, 1)}
                                className="p-0.5 disabled:opacity-30 hover:text-foreground text-muted-foreground"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSlot(pageKey, idx)}
                                className="p-0.5 text-muted-foreground hover:text-destructive"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add slot */}
                    <div className="flex items-end gap-2 pt-1">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Sectie</Label>
                        <select
                          className="w-full text-sm border rounded px-2 py-1 bg-background"
                          value={pageAddState?.parent ?? ''}
                          onChange={(e) => setAddParent(pageKey, e.target.value)}
                        >
                          <option value="">— kies type —</option>
                          {SLOT_DEFINITIONS.map((def) => (
                            <option key={def.type} value={def.type}>{def.label}</option>
                          ))}
                        </select>
                      </div>

                      {selectedTypeDef && (
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs">Weergave</Label>
                          <select
                            className="w-full text-sm border rounded px-2 py-1 bg-background"
                            value={pageAddState?.child ?? ''}
                            onChange={(e) => setAddChild(pageKey, e.target.value)}
                          >
                            {selectedTypeDef.variants.map((v) => (
                              <option key={v.key} value={v.key}>{v.label}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!pageAddState?.parent}
                        onClick={() => addSlot(pageKey)}
                        className="shrink-0"
                      >
                        <Plus size={14} className="mr-1" />
                        Toevoegen
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button size="sm" disabled={siteConfigSaving} onClick={handleSiteConfigSave}>
            {siteConfigSaving ? 'Opslaan...' : 'Commerce opslaan'}
          </Button>
        </CardContent>
      </Card>

      {/* ── Danger zone ── */}
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
