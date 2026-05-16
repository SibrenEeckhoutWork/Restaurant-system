'use client';

import { useTenant, type SiteConfig, type SlotEntry } from '@/context/TenantContext';
import HeroSection from '@/components/slots/HeroSection';
import HeroSectionCentered from '@/components/slots/HeroSectionCentered';
import MenuPreviewSection from '@/components/slots/MenuPreviewSection';
import ReservationCTA from '@/components/slots/ReservationCTA';
import ReservationWizard from '@/components/slots/ReservationWizard';
import MenuSection from '@/components/slots/MenuSection';
import BoxOrderSlot from '@/components/slots/BoxOrderSlot';
import ContactSection from '@/components/slots/ContactSection';
import GallerySection from '@/components/slots/GallerySection';

const SLOT_REGISTRY: Record<string, Record<string, React.ComponentType>> = {
  'hero':               { default: HeroSection, centered: HeroSectionCentered },
  'menu-preview':       { default: MenuPreviewSection },
  'menu':               { default: MenuSection },
  'reservation-wizard': { default: ReservationWizard },
  'reservation-cta':    { default: ReservationCTA },
  'box-order':          { default: BoxOrderSlot },
  'contact':            { default: ContactSection },
  'gallery':            { default: GallerySection },
};

function resolveSlot(raw: SlotEntry | string): SlotEntry {
  return typeof raw === 'string' ? { type: raw, variant: 'default' } : raw;
}

type PageKey = keyof NonNullable<SiteConfig['pages']>;

export default function SlotRenderer({ pageKey }: { pageKey: PageKey }) {
  const { siteConfig } = useTenant();
  const rawSlots = siteConfig.pages?.[pageKey] ?? [];

  return (
    <>
      {rawSlots.map((raw, i) => {
        const { type, variant } = resolveSlot(raw as SlotEntry | string);
        const Component = SLOT_REGISTRY[type]?.[variant] ?? SLOT_REGISTRY[type]?.['default'];
        return Component ? <Component key={`${type}-${variant}-${i}`} /> : null;
      })}
    </>
  );
}
