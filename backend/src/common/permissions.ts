export const ALL_PERMISSIONS = [
  'users.read', 'users.create', 'users.update', 'users.delete',
  'rooms.get', 'rooms.create', 'rooms.update', 'rooms.delete',
  'tables.get', 'tables.create', 'tables.update', 'tables.delete',
  'orders.read', 'orders.create', 'orders.update', 'orders.delete',
  'reservations.get', 'reservations.create', 'reservations.update', 'reservations.delete',
  'menu.read', 'menu.create', 'menu.update', 'menu.delete',
  'customers.read', 'customers.create', 'customers.update', 'customers.delete',
  'products.get', 'products.create', 'products.update', 'products.delete',
  'categories.get', 'categories.create', 'categories.update', 'categories.delete',
  'allergies.get', 'allergies.create', 'allergies.update', 'allergies.delete',
  'accessories.get', 'accessories.create', 'accessories.update', 'accessories.delete',
  'permissions.manage',
];

export const PERMISSION_META: Record<string, { label: string; description: string }> = {
  'users.read':    { label: 'Lezen',    description: 'Gebruikers bekijken en opzoeken' },
  'users.write':   { label: 'Schrijven', description: 'Gebruikers aanmaken en bewerken' },
  'users.delete':  { label: 'Verwijderen', description: 'Gebruikers verwijderen (incl. bulk)' },
  'permissions.manage': { label: 'Rechten beheren', description: 'Permissies toewijzen en intrekken' },
};
