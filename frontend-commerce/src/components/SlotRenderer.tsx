'use client';

import { useTenant, type SiteConfig, type SlotEntry } from '@/context/TenantContext';
import HeroSectionDefault          from '@/components/slots/home/hero/Default';
import HeroSectionCentered         from '@/components/slots/home/hero/Centered';
import HeroSectionZoeteWever       from '@/components/slots/home/hero/ZoeteWever';
import StorySectionDefault         from '@/components/slots/home/story/Default';
import StorySectionZoeteWever      from '@/components/slots/home/story/ZoeteWever';
import ServeGridDefault            from '@/components/slots/home/serve-grid/Default';
import ServeGridZoeteWever         from '@/components/slots/home/serve-grid/ZoeteWever';
import HeritageSectionDefault      from '@/components/slots/home/heritage/Default';
import HeritageSectionZoeteWever   from '@/components/slots/home/heritage/ZoeteWever';
import ReservationCTADefault       from '@/components/slots/home/reservation-cta/Default';
import ReservationCTAZoeteWever    from '@/components/slots/home/reservation-cta/ZoeteWever';
import VisitSectionDefault         from '@/components/slots/home/visit/Default';
import VisitSectionZoeteWever      from '@/components/slots/home/visit/ZoeteWever';
import MenuSectionDefault          from '@/components/slots/kaart/menu/Default';
import MenuSectionZoeteWever       from '@/components/slots/kaart/menu/ZoeteWever';
import ReservationWizardDefault    from '@/components/slots/reserveren/reservation-wizard/Default';
import ReservationWizardZoeteWever from '@/components/slots/reserveren/reservation-wizard/ZoeteWever';
import BoxOrderHeroDefault         from '@/components/slots/bestellen/box-order-hero/Default';
import BoxOrderHeroZoeteWever      from '@/components/slots/bestellen/box-order-hero/ZoeteWever';
import BoxOrderDefault             from '@/components/slots/bestellen/box-order/Default';
import BoxOrderZoeteWever          from '@/components/slots/bestellen/box-order/ZoeteWever';
import BoxOrderStepsDefault        from '@/components/slots/bestellen/box-order-steps/Default';
import BoxOrderStepsZoeteWever     from '@/components/slots/bestellen/box-order-steps/ZoeteWever';
import BoxOrderFaqDefault          from '@/components/slots/bestellen/box-order-faq/Default';
import BoxOrderFaqZoeteWever       from '@/components/slots/bestellen/box-order-faq/ZoeteWever';
import ContactSectionDefault       from '@/components/slots/contact/contact/Default';
import ContactSectionZoeteWever    from '@/components/slots/contact/contact/ZoeteWever';
import GallerySectionDefault       from '@/components/slots/galerij/gallery/Default';
import GallerySectionZoeteWever    from '@/components/slots/galerij/gallery/ZoeteWever';

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
  'visit':              { default: VisitSectionDefault, 'zoete-wever': VisitSectionZoeteWever },
};

function resolveSlot(raw: SlotEntry | string): SlotEntry {
  if (typeof raw === 'string') return { parent: raw, child: 'default' };
  // compat: old shape had type/variant
  const entry = raw as unknown as Record<string, string>;
  if ('type' in entry) return { parent: entry['type'], child: entry['variant'] ?? 'default' };
  return raw;
}

type PageKey = keyof NonNullable<SiteConfig['pages']>;

export default function SlotRenderer({ pageKey }: { pageKey: PageKey }) {
  const { siteConfig } = useTenant();
  const raw = siteConfig.pages?.[pageKey];
  if (!raw) return null;

  // compat: old DB data has page as SlotEntry[] instead of PageConfig
  const page = Array.isArray(raw)
    ? { active: true, slots: raw as unknown as SlotEntry[] }
    : raw;

  if (page.active === false) return null;

  return (
    <>
      {(page.slots ?? []).map((s, i) => {
        const { parent, child } = resolveSlot(s);
        const Component = SLOT_REGISTRY[parent]?.[child] ?? SLOT_REGISTRY[parent]?.['default'];
        return Component ? <Component key={`${parent}-${child}-${i}`} /> : null;
      })}
    </>
  );
}
