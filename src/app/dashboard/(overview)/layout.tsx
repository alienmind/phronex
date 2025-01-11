//export const experimental_ppr = true;
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Projects dashboard',
    default: 'Projects dashboard',
  },
  description: 'Projects dashboard',
  metadataBase: new URL('https://github.com/alienmind/phronex'),
};
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
      {children}
      </div>
  );
}