/*
 * This is the layout for the dashboard
 * It provides the sidebar and the navbar
 */
//export const experimental_ppr = true;
import AuthWrapper from '@/app/auth_wrapper';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppNavbar } from '@/app/ui/navbar';
import { ThemeProvider } from "@/app/ui/theme-provider"
import { Separator } from "@/components/ui/separator"
import { Metadata } from 'next';
import { CreateProjectModal } from "../ui/create-project-modal";

// Page metadata - will be included as the metadata in the HTML
// Can also be used for rendering titles in subsequent pages
export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Phronex',
  },
  description: 'Phronex',
  metadataBase: new URL('https://github.com/alienmind/phronex'),
};
 
// Page layout - as required by Next
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {/*       disableTransitionOnChange */}
      <SidebarProvider>
        <AppNavbar />
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
    </ThemeProvider>
    </AuthWrapper>
  );
}