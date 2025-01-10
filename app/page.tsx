import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function LandingNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800">
      <div className="flex items-center">
            <Image width={1024} height={1024} src="/logo.png" alt="Phronex logo" className="h-8 w-8 mr-2 rounded-2xl" />
        <span className="text-white text-xl font-bold">Phronex</span>
      </div>
      <div className="flex gap-4 mt-4">
        <Button asChild>
          <Link href="/about">About</Link>
        </Button>
      </div>
    </nav>
  );
};

function LandingPage() {
  return (
    <main>
      <LandingNavbar/>
      <div className="flex relative px-6 md:px-24 flex-col items-center md:items-start justify-center min-h-[80dvh] h-full">
        <div className="flex flex-col items-center md:items-start justify-center gap-4">
          <h1 className="text-4xl font-bold text-left max-w-lg">
            Project management made right.
          </h1>
          <p className="text-lg text-center md:text-left max-w-2xl">
            Phronex is a modern project management tool powered by AI that helps you keep track of your budget.
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
export default LandingPage;