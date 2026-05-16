'use client';

import { useParams } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import SlotRenderer from '@/components/SlotRenderer';
import type { PageKey } from '@/context/TenantContext';

export default function TenantDynamicPage() {
  const { pagepath } = useParams<{ pagepath: string }>();
  const { siteConfig } = useTenant();

  const navItems = siteConfig.nav?.items ?? {};
  // Find pageKey whose configured path (or fallback key) matches the URL segment
  const pageKey = (
    Object.entries(navItems).find(([key, item]) => (item.path ?? key) === pagepath)?.[0]
    ?? pagepath
  ) as PageKey;

  return (
    <div className="container">
      <SlotRenderer pageKey={pageKey} />
    </div>
  );
}
