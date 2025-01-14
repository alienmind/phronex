import { ProjectCardListSkeleton } from '@/app/ui/skeletons';
import { ProjectCardList } from '@/app/ui/project-card-list';
import { fetchTopProjects } from '@/app/lib/dataaccess';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
}; 

type Params = Promise<{ limit: string }>

export default async function Page( {params}: { params: Params } ) {

  const searchParams = await params;
  const limit : number | undefined = ( searchParams.limit === 'all' ? undefined : parseInt(searchParams.limit) );
  const initialProjects = await fetchTopProjects(limit);

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
