import type { SiteConfig } from './tenant.entity.js';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#b5451b',
    background: '#faf8f5',
    text: '#1a1612',
    muted: '#6b5e52',
  },
  fonts: { heading: 'instrument-serif', body: 'geist' },
  pages: {
    home: [
      { type: 'hero', variant: 'default' },
      { type: 'menu-preview', variant: 'default' },
      { type: 'reservation-cta', variant: 'default' },
    ],
    reserveren: [{ type: 'reservation-wizard', variant: 'default' }],
    bestellen:  [{ type: 'box-order', variant: 'default' }],
    kaart:      [{ type: 'menu', variant: 'default' }],
    contact:    [{ type: 'contact', variant: 'default' }],
  },
};
