import { ProjectCardListSkeleton } from '@/app/ui/skeletons';
import { ProjectCardList } from '@/app/ui/project-card-list';
import { fetchMostRecentProjects } from '@/app/lib/data';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
}; 

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    limit?: string;
  };
}) {
  const searchParamsLimit = await searchParams?.limit;

  const limit = searchParamsLimit ? 
    searchParamsLimit === 'all' ? undefined : parseInt(searchParamsLimit) 
    : 6;

  const initialProjects = await fetchMostRecentProjects(limit);

  return (
    <main>
      <div className="flex flex-1 gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
          <Suspense fallback={<ProjectCardListSkeleton />}>
            <ProjectCardList initialProjects={initialProjects} limit={limit} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
