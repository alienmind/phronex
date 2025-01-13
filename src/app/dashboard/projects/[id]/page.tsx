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
import ProjectResourcesTable from '@/app/ui/project-resources-table';
import ProjectExpensesTable from '@/app/ui/project-expenses-table';

type Params = Promise<{ id: string, expenses_start_date: string, expenses_end_date: string }>

export default async function Page( {params}: { params: Params } ) {
  const searchParams = await params;

  console.log('searchParams', JSON.stringify(searchParams));
  console.log('Fetching project details for:', searchParams.id, searchParams.expenses_start_date, searchParams.expenses_end_date);
  const project = await fetchProjectById(searchParams.id);
  const resources = await fetchResourcesForProjectId(searchParams.id);
  const expenses = await fetchProjectExpensesAndBudget(
    searchParams.id, 
    new Date('1900-01-01'), 
    new Date('2100-01-01')
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top section - Project Details Form */}
      <div className="w-full min-h-[400px] p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border-b overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Project Details</h1>
          <ProjectDetailsForm project={project} />
        </div>
      </div>
      
      {/* Bottom section - Tables */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Change to stack on mobile, side by side on larger screens */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            {/* Expenses section */}
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Project Expenses</h2>
              <div className="overflow-x-auto">
                {expenses && <ProjectExpensesTable expenses={expenses} projectId={searchParams.id} /> || <p>No expenses found</p>}
              </div>
            </div>
            {/* Resources section */}
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Project Resources</h2>
              <div className="overflow-x-auto">
                {resources && <ProjectResourcesTable resources={resources} projectId={searchParams.id} /> || <p>No resources found</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 