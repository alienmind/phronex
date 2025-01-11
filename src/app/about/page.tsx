import Link from "next/link";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"

export default function Component() {
  return (
    <>
    <AboutNavbar/>
    <AboutPage/>
    </>
  );
}

function AboutNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800">
      <div className="flex items-center">
        <Link href="/">
            <img src="/logo.png" alt="logo" className="h-8 w-8 mr-2 rounded-2xl" />
        </Link>
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

function AboutPage() {
  return (
    <main>
      <div className="flex relative px-6 md:px-24 flex-col items-center md:items-start justify-center min-h-[80dvh] h-full">
        <div className="flex flex-col items-center md:items-start justify-center gap-4">

          <p className="text-lg text-center md:text-left max-w-2xl">
           This app has been done for learning purposes.
          </p>
          <p className="text-lg text-center md:text-left max-w-2xl">
          <Button><Link href="https://github.com/alienmind/phronex">Visit github</Link></Button><br/>
          </p>
          <p className="text-lg text-center md:text-left max-w-2xl">
          The following actions are dangerous, use with care!
          </p>
          <div className="flex gap-8 items-center">
            <Button variant="destructive" asChild>
              <Link href="/seed">Seed data</Link>
            </Button>
            <Dialog>
              <DialogTrigger>
                  Don&apos;t click here
              </DialogTrigger>
              <DialogContent className="min-w-[400px] max-w-[33vw]">
                <DialogHeader>
                  <DialogTitle>OK whatever...</DialogTitle>
                </DialogHeader>
                <iframe src="https://silentspacemarine.com/" width={800} height={600} scrolling="no"/>
              </DialogContent>
            </Dialog>
            <Button asChild>
              <Link href="/login">Back</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}