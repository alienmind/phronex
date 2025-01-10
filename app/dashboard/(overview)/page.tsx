import { ProjectCardListSkeleton } from '@/app/ui/skeletons';
import { ProjectCardList, ProjectCard } from '@/app/ui/project-cards';

import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
}; 

export default async function Page() {
  return (
    <>
    <main>
      Dashboard
    </main>
    </>
  );
}

/*
export default async function Page() {
  return (
    <main>
    <div className="float-left flex flex-1 gap-4 p-4 pt-0">
    <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
    <Suspense fallback={<ProjectCardListSkeleton />}>
    <ProjectCardList/>
    </Suspense>
    </div>
    </div>
    </main>
  );
}
*/