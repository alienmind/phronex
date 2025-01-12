import { ProjectResourceTableView } from "@/app/lib/dataschemas"
import { columns } from "@/app/ui/tables/project-resources-columns"
import { DataTable } from "@/app/ui/data-table"
import { RoleFilter } from "@/app/ui/tables/project-resources-columns"


/*
 * This is the project resources table (client) component
 * It is based in tanstack table library and reuses the generic DataTable component
 * customized for this particular view
 */
export default async function ProjectResourcesTable({ resources }: { resources: ProjectResourceTableView[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <RoleFilter />
        </div>
      </div>
      <DataTable columns={columns} data={resources} />
    </div>
  )
}
