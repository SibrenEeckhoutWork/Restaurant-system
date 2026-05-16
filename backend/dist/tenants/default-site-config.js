"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SITE_CONFIG = void 0;
exports.DEFAULT_SITE_CONFIG = {
    colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#b5451b',
        background: '#faf8f5',
        text: '#1a1612',
        muted: '#6b5e52',
    },
    fonts: { heading: 'instrument-serif', body: 'geist' },
    nav: {
        items: {
            home: { active: true, label: 'Thuis', order: 0 },
            kaart: { active: true, label: 'Kaart', order: 1 },
            bestellen: { active: true, label: 'Ontbijtbox', order: 2 },
            reserveren: { active: true, label: 'Reserveren', order: 3 },
            galerij: { active: true, label: 'Galerij', order: 4 },
            contact: { active: true, label: 'Contact', order: 5 },
        },
    },
    pages: {
        home: {
            active: true,
            slots: [
                { parent: 'hero', child: 'default' },
                { parent: 'story', child: 'default' },
                { parent: 'serve-grid', child: 'default' },
                { parent: 'reservation-cta', child: 'default' },
            ],
        },
        reserveren: { active: true, slots: [{ parent: 'reservation-wizard', child: 'default' }] },
        bestellen: {
            active: true,
            slots: [
                { parent: 'box-order-hero', child: 'default' },
                { parent: 'box-order', child: 'default' },
                { parent: 'box-order-steps', child: 'default' },
                { parent: 'box-order-faq', child: 'default' },
            ],
        },
        kaart: { active: true, slots: [{ parent: 'menu', child: 'default' }] },
        contact: { active: true, slots: [{ parent: 'contact', child: 'default' }] },
        galerij: { active: true, slots: [{ parent: 'gallery', child: 'default' }] },
    },
};
//# sourceMappingURL=default-site-config.js.map