import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu, 
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { community, events } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { HardDriveDownload, CookingPot, Calendar, Hand } from 'lucide-react';
import AppLogo from './app-logo-small';

const mainNavItems: NavItem[] = [
    {
        title: 'Community',
        href: community(),
        icon: Hand,
    },
    {
        title: 'Events',
        href: events(),
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Recipes',
        href: '/recipes',
        icon: CookingPot
    },
    {
        title: 'Downloads',
        href: '/downloads',
        icon: HardDriveDownload,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={community()} prefetch>
                                <AppLogo /> 
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
