'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ChefHat, LogOut, User } from 'lucide-react';

const NAV_LINKS = [
  { href: '/backoffice', label: 'Dashboard' },
  { href: '/backoffice/tables', label: 'Tafels' },
  { href: '/backoffice/orders', label: 'Bestellingen' },
  { href: '/backoffice/reservations', label: 'Reservaties' },
  { href: '/backoffice/menu', label: 'Menu' },
  { href: '/backoffice/customers', label: 'Klanten' },
  { href: '/backoffice/users', label: 'Gebruikers' },
];

export function Navbar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-6 px-6">
        {/* Logo */}
        <Link href="/backoffice" className="flex items-center gap-2 font-semibold">
          <ChefHat className="h-5 w-5" />
          <span>Backoffice</span>
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors">
            <User className="h-4 w-4" />
            <span className="max-w-[160px] truncate">{user?.email}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
