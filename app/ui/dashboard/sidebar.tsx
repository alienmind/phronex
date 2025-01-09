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
        <Link href="/dashboard">
          <img src="/logo.png" alt="logo" className="h-10 w-10 mr-2 rounded-xl" />
          <span className="text-left text-xl font-bold">Phronex</span>
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
            <SidebarMenuButton asChild>
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/about">About</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Sign out {userEmail}</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}