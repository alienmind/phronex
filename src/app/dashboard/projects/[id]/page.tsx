/*
 * This is the page for the project details
 * It will display the project details, the expenses and the resources assigned to the project
 * 
 * Can also be used to update the project details
 * 
 * FIXME - still missing functionality to add additional expenses or resources
 */
import { fetchProjectExpensesAndBudget, fetchProjectById, fetchResourcesForProjectId } from '@/app/lib/dataaccess';
import { ProjectDetailsForm } from '@/app/ui/project-details-form';
import { notFound } from 'next/navigation';
import ProjectCostsTable from '@/app/ui/project-costs-table';
import ProjectResourcesTable from '@/app/ui/project-resources-table';

type Params = Promise<{ id: string }>

export default async function Page( {params}: { params: Params } ) {
  const searchParams = await params;

  console.log('Fetching project details for:', searchParams.id);
  const project = await fetchProjectById(searchParams.id);
  const resources = await fetchResourcesForProjectId(searchParams.id);
  const expenses = await fetchProjectExpensesAndBudget(searchParams.id);

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
        {expenses && <ProjectCostsTable costs={expenses} /> || <p>No expenses found</p>}
        {resources && <ProjectResourcesTable resources={resources} /> || <p>No resources found</p>}
        </div>
      </div>
    </div>
  );
} 