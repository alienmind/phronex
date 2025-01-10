"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { Home, Search, Settings } from 'lucide-react'
import { unauthenticate } from '@/app/lib/actions'

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

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
    },
    // FIXME - not implemented
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    // FIXME - not implemented
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="align-center">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-bold">Phronex</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        { /* Menu group */}
        <SidebarGroup>
          <SidebarGroupLabel>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
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