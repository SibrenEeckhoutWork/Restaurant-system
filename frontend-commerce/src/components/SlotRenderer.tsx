'use client';

import { useTenant, type SiteConfig, type SlotEntry } from '@/context/TenantContext';
import HeroSectionDefault         from '@/components/slots/HeroSectionDefault';
import HeroSectionCentered        from '@/components/slots/HeroSectionCentered';
import HeroSectionZoeteWever      from '@/components/slots/HeroSectionZoeteWever';
import StorySectionDefault        from '@/components/slots/StorySectionDefault';
import StorySectionZoeteWever     from '@/components/slots/StorySectionZoeteWever';
import ServeGridDefault           from '@/components/slots/ServeGridDefault';
import ServeGridZoeteWever        from '@/components/slots/ServeGridZoeteWever';
import HeritageSectionDefault     from '@/components/slots/HeritageSectionDefault';
import HeritageSectionZoeteWever  from '@/components/slots/HeritageSectionZoeteWever';
import ReservationCTADefault      from '@/components/slots/ReservationCTADefault';
import ReservationCTAZoeteWever   from '@/components/slots/ReservationCTAZoeteWever';
import MenuSectionDefault         from '@/components/slots/MenuSectionDefault';
import MenuSectionZoeteWever      from '@/components/slots/MenuSectionZoeteWever';
import ReservationWizardDefault   from '@/components/slots/ReservationWizardDefault';
import ReservationWizardZoeteWever from '@/components/slots/ReservationWizardZoeteWever';
import BoxOrderHeroDefault        from '@/components/slots/BoxOrderHeroDefault';
import BoxOrderHeroZoeteWever     from '@/components/slots/BoxOrderHeroZoeteWever';
import BoxOrderDefault            from '@/components/slots/BoxOrderDefault';
import BoxOrderZoeteWever         from '@/components/slots/BoxOrderZoeteWever';
import BoxOrderStepsDefault       from '@/components/slots/BoxOrderStepsDefault';
import BoxOrderStepsZoeteWever    from '@/components/slots/BoxOrderStepsZoeteWever';
import BoxOrderFaqDefault         from '@/components/slots/BoxOrderFaqDefault';
import BoxOrderFaqZoeteWever      from '@/components/slots/BoxOrderFaqZoeteWever';
import ContactSectionDefault      from '@/components/slots/ContactSectionDefault';
import ContactSectionZoeteWever   from '@/components/slots/ContactSectionZoeteWever';
import GallerySectionDefault      from '@/components/slots/GallerySectionDefault';
import GallerySectionZoeteWever   from '@/components/slots/GallerySectionZoeteWever';

const SLOT_REGISTRY: Record<string, Record<string, React.ComponentType>> = {
  'hero':               { default: HeroSectionDefault, centered: HeroSectionCentered, 'zoete-wever': HeroSectionZoeteWever },
  'story':              { default: StorySectionDefault, 'zoete-wever': StorySectionZoeteWever },
  'serve-grid':         { default: ServeGridDefault, 'zoete-wever': ServeGridZoeteWever },
  'heritage':           { default: HeritageSectionDefault, 'zoete-wever': HeritageSectionZoeteWever },
  'reservation-cta':    { default: ReservationCTADefault, 'zoete-wever': ReservationCTAZoeteWever },
  'menu':               { default: MenuSectionDefault, 'zoete-wever': MenuSectionZoeteWever },
  'reservation-wizard': { default: ReservationWizardDefault, 'zoete-wever': ReservationWizardZoeteWever },
  'box-order-hero':     { default: BoxOrderHeroDefault, 'zoete-wever': BoxOrderHeroZoeteWever },
  'box-order':          { default: BoxOrderDefault, 'zoete-wever': BoxOrderZoeteWever },
  'box-order-steps':    { default: BoxOrderStepsDefault, 'zoete-wever': BoxOrderStepsZoeteWever },
  'box-order-faq':      { default: BoxOrderFaqDefault, 'zoete-wever': BoxOrderFaqZoeteWever },
  'contact':            { default: ContactSectionDefault, 'zoete-wever': ContactSectionZoeteWever },
  'gallery':            { default: GallerySectionDefault, 'zoete-wever': GallerySectionZoeteWever },
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
