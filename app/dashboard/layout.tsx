//export const experimental_ppr = true;
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from '@/app/ui/sidebar';
import { ThemeProvider } from "@/app/ui/theme-provider"
import { Separator } from "@/components/ui/separator"
import { Metadata } from 'next';
import { CreateProjectModal } from "../ui/create-project-modal";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Phronex',
  },
  description: 'Phronex',
  metadataBase: new URL('https://github.com/alienmind/phronex'),
};
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />                
              <CreateProjectModal />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}