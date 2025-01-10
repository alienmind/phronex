import Link from "next/link";

import { Home, Search, Settings } from "lucide-react"

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

import { ModeToggle } from "@/app/ui/dashboard/modetoggle";
const userEmail = ""; // FIXME - implement get user name

async function handleSignOut() {
  // FIXME - implement sign out
  console.log("FIXME - implement get user name");
  console.log("FIXME - implement sign out...");
  await new Promise(resolve => setTimeout(resolve, 1000));
}

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

export function AppSidebar() {

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
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
              <Link href="/about">About</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-emerald-800/20 dark:hover:bg-emerald-800/20">
              Sign out {userEmail}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}