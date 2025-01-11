"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { Home, Search, Settings } from 'lucide-react'
import { unauthenticate } from '@/app/lib/actions'
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  UserGroupIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { ModeToggle } from "@/app/ui/modetoggle";

export function AppSidebar() {
  const pathname = usePathname();

  // Menu items with their respective icons and URLs
  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderIcon,
    },
    {
      title: "People",
      url: "/dashboard/people",
      icon: UsersIcon,
    },
    {
      title: "Roles",
      url: "/dashboard/roles",
      icon: UserGroupIcon,
    },
    {
      title: "Cost Categories",
      url: "/dashboard/costs",
      icon: BanknotesIcon,
    },
  ];

  return (
    <Sidebar className="align-center">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-bold">Phronex</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={clsx(
                      "hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20 w-full",
                      {
                        'bg-emerald-800/10 dark:bg-emerald-800/30': pathname === item.url,
                      }
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2 p-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <div className="flex items-center gap-2 px-2">
            <SidebarMenuItem className="flex-none">
              <SidebarMenuButton asChild className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
                <ModeToggle />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex-none">
              <SidebarMenuButton asChild className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
                <Link href="/about">About</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex-none">
                <form action={unauthenticate}>
                <SidebarMenuButton className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
                  Sign out
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}