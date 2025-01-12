'use client';

import { useState } from 'react';
import { ProjectResourceTableView } from "@/app/lib/dataschemas"
import { columns } from "@/app/ui/tables/project-resources-columns"
import { DataTable } from "@/app/ui/data-table"
import { RoleFilter } from "@/app/ui/tables/project-resources-columns"

export default function ProjectResourcesTable({ 
  resources,
  projectId 
}: { 
  resources: ProjectResourceTableView[],
  projectId: string
}) {
  const [currentResources, setCurrentResources] = useState(resources);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <RoleFilter 
            projectId={projectId}
            onResourcesChange={setCurrentResources}
          />
        </div>
      </div>
      <DataTable columns={columns} data={currentResources} />
    </div>
  )
}
