/*
 * This is the root layout (server) component
 * It is the main layout for the application
 * It defines the basic structure of the application page
 * It includes the theme provider and the global styles in a single place
 */
import { ThemeProvider } from "@/app/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import '@/app/global.css';
import { roboto } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Phronex Project Manager',
  description: 'A modern web project management tool',
  metadataBase: new URL('https://github.com/alienmind'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}