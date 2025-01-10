import { ProjectCardListSkeleton } from '@/app/ui/skeletons';
import { ProjectCardList } from '@/app/ui/project-card-list';

import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth, signOut } from "@/auth" // adding { auth }

export const metadata: Metadata = {
  title: 'Dashboard',
}; 

/*
export default async function Page() {
  const session = await auth() ;
  return (
    <>
    <main>
      Dashboard for {session?.user?.email}
    </main>
    </>
  );
}
*/

export default async function Page() {
  return (
    <main>
    <div className="flex flex-1 gap-4 p-4 pt-0">
    <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
    <Suspense fallback={<ProjectCardListSkeleton />}>
    <ProjectCardList/>
    </Suspense>
    </div>
    </div>
    </main>
  );
}
