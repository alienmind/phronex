/*
 * This is the layout for the layout page
 */

//export const experimental_ppr = true;
import { Metadata } from 'next';
 
// Page metadata - will be included as the metadata in the HTML
// Can also be used for rendering titles in subsequent pages
export const metadata: Metadata = {
  title: {
    template: '%s | Projects dashboard',
    default: 'Projects dashboard',
  },
  description: 'Projects dashboard',
  metadataBase: new URL('https://github.com/alienmind/phronex'),
};
 
// Page layout - as required by Next
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
      {children}
      </div>
  );
}