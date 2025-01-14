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
import { ProjectChart } from '@/app/ui/project-chart'
import { ProjectBudgetControls } from "@/app/ui/project-budget-control";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <div className="flex flex-col space-y-6">
      {/* Top section - Project Details and Chart */}
      <div className="p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Details Form - Takes 1/3 of space */}
            <div className="lg:col-span-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Project Details</h2>
              <ProjectDetailsForm project={project} />
            </div>
            
            {/* Chart Section - Takes 2/3 of space */}
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Budget Overview</h2>
              <ProjectChart projectId={searchParams.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - Tables */}
      <div className="p-4 sm:p-6 md:col-span-2">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expenses section */}
            <div className="md:col-span-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Project Expenses</h2>
              <div className="overflow-x-auto">
                {expenses && <ProjectExpensesTable expenses={expenses} projectId={searchParams.id} projectName={project.project_name} /> || <p>No expenses found</p>}
              </div>
            </div>
            {/* Resources section */}
            <div className="md:col-span-1">
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