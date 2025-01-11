import { fetchProjectById } from '@/app/lib/data';
import { ProjectDetailsForm } from '@/app/ui/project-details-form';
import { notFound } from 'next/navigation';



type Params = Promise<{ id: string }>

export default async function Page( {params}: { params: Params } ) {
  const searchParams = await params;
  const project = await fetchProjectById(searchParams.id);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top half - Project Details Form */}
      <div className="w-full h-[50vh] min-h-[400px] p-6 bg-gray-50 dark:bg-gray-900 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Project Details</h1>
          <ProjectDetailsForm project={project} />
        </div>
      </div>
      
      {/* Bottom half - Reserved for future content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Future content will go here */}
        </div>
      </div>
    </div>
  );
} 