import { ThemeProvider } from "@/app/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import '@/app/ui/global.css';
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