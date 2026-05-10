'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  ChefHat,
  ChevronRight,
  ClipboardList,
  Columns3,
  LayoutDashboard,
  LogOut,
  TableProperties,
  Users2,
  UtensilsCrossed,
  LayoutPanelTop,
  ShoppingBag,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/backoffice', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/backoffice/reservations', label: 'Reservaties', icon: CalendarDays },
];

const ORDER_MANAGEMENT_LINKS = [
  { href: '/backoffice/orders', label: 'Bestellingen' },
  { href: '/backoffice/kitchen', label: 'Keuken Display' },
];

const SPACE_MANAGEMENT_LINKS = [
  { href: '/backoffice/rooms', label: 'Ruimtes' },
  { href: '/backoffice/tables', label: 'Tafels' },
];

const PRODUCT_MANAGEMENT_LINKS = [
  { href: '/backoffice/products', label: 'Producten' },
  { href: '/backoffice/products/categories', label: 'Categorieën' },
  { href: '/backoffice/products/allergies', label: 'Allergenen' },
  { href: '/backoffice/products/accessories', label: "Extra's" },
];

const USER_MANAGEMENT_LINKS = [
  { href: '/backoffice/users', label: 'Gebruikers' },
  { href: '/backoffice/customers', label: 'Klanten' },
];

export function AppSidebar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  const isOrderMgmtActive = pathname.startsWith('/backoffice/orders') || pathname.startsWith('/backoffice/kitchen');
  const [omOpen, setOmOpen] = useState(true);

  const isSpaceMgmtActive = pathname.startsWith('/backoffice/rooms') || pathname.startsWith('/backoffice/tables');
  const [smOpen, setSmOpen] = useState(true);

  const isProductMgmtActive = pathname.startsWith('/backoffice/products');
  const [pmOpen, setPmOpen] = useState(true);

  const isUserMgmtActive = pathname.startsWith('/backoffice/users');
  const [umOpen, setUmOpen] = useState(true);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/backoffice" />}
              tooltip="Backoffice"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ChefHat className="size-4" />
              </div>
              <span className="font-semibold">Backoffice</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={pathname === href}
                  tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <Collapsible open={omOpen} onOpenChange={setOmOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<CollapsibleTrigger />}
                  isActive={isOrderMgmtActive && !omOpen}
                  tooltip="Orderbeheer"
                >
                  <ClipboardList />
                  <span>Orderbeheer</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto size-4 transition-transform duration-200',
                      omOpen && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {ORDER_MANAGEMENT_LINKS.map(({ href, label }) => (
                      <SidebarMenuSubItem key={href}>
                        <SidebarMenuSubButton
                          render={<Link href={href} />}
                          isActive={pathname === href}
                        >
                          <span>{label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible open={smOpen} onOpenChange={setSmOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<CollapsibleTrigger />}
                  isActive={isSpaceMgmtActive && !smOpen}
                  tooltip="Ruimtebeheer"
                >
                  <LayoutPanelTop />
                  <span>Ruimtebeheer</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto size-4 transition-transform duration-200',
                      smOpen && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {SPACE_MANAGEMENT_LINKS.map(({ href, label }) => (
                      <SidebarMenuSubItem key={href}>
                        <SidebarMenuSubButton
                          render={<Link href={href} />}
                          isActive={pathname === href}
                        >
                          <span>{label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible open={pmOpen} onOpenChange={setPmOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<CollapsibleTrigger />}
                  isActive={isProductMgmtActive && !pmOpen}
                  tooltip="Productbeheer"
                >
                  <ShoppingBag />
                  <span>Productbeheer</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto size-4 transition-transform duration-200',
                      pmOpen && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {PRODUCT_MANAGEMENT_LINKS.map(({ href, label }) => (
                      <SidebarMenuSubItem key={href}>
                        <SidebarMenuSubButton
                          render={<Link href={href} />}
                          isActive={pathname === href}
                        >
                          <span>{label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible open={umOpen} onOpenChange={setUmOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<CollapsibleTrigger />}
                  isActive={isUserMgmtActive && !umOpen}
                  tooltip="Gebruikersbeheer"
                >
                  <Users2 />
                  <span>Gebruikersbeheer</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto size-4 transition-transform duration-200',
                      umOpen && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {USER_MANAGEMENT_LINKS.map(({ href, label }) => (
                      <SidebarMenuSubItem key={href}>
                        <SidebarMenuSubButton
                          render={<Link href={href} />}
                          isActive={pathname === href}
                        >
                          <span>{label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user?.email ?? ''}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold uppercase">
                {user?.email?.[0] ?? '?'}
              </div>
              <span className="flex-1 truncate text-sm">{user?.email}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Uitloggen"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Uitloggen</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
