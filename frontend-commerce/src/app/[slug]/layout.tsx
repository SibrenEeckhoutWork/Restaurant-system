import { notFound } from 'next/navigation';
import { TenantProvider, type TenantData } from '@/context/TenantContext';
import SiteNav from '@/components/marketing/SiteNav';
import SiteFooter from '@/components/marketing/SiteFooter';

const API = process.env.NEXT_PUBLIC_API_URL!;

const HEADING_FONT_MAP: Record<string, string> = {
  'instrument-serif': 'var(--font-instrument-serif)',
  'playfair':         'var(--font-playfair)',
  'cormorant':        'var(--font-cormorant)',
};

const BODY_FONT_MAP: Record<string, string> = {
  'geist':    'var(--font-geist)',
  'nunito':   'var(--font-nunito)',
  'raleway':  'var(--font-raleway)',
};

async function getTenant(slug: string): Promise<TenantData | null> {
  try {
    const res = await fetch(`${API}/tenants/public/by-slug/${slug}/site-config`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<TenantData>;
  } catch {
    return null;
  }
}

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenant(slug);
  if (!tenant) notFound();

  const c = tenant.siteConfig.colors ?? {};
  const f = tenant.siteConfig.fonts ?? {};
  const headingFamily = HEADING_FONT_MAP[f.heading ?? 'instrument-serif'];
  const bodyFamily    = BODY_FONT_MAP[f.body ?? 'geist'];

  return (
    <TenantProvider tenant={tenant}>
      <div
        style={{
          '--font-serif': headingFamily,
          '--font-sans':  bodyFamily,
          fontFamily:     bodyFamily,
          '--cream':    c.background,
          '--espresso': c.text,
          '--jam':      c.accent,
          '--cocoa':    c.muted,
        } as React.CSSProperties}
      >
        <SiteNav />
        <main style={{ flex: 1 }}>{children}</main>
        <SiteFooter />
      </div>
    </TenantProvider>
  );
}
