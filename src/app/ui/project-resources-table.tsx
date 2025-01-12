import { ProjectResource } from "@/app/lib/dataschemas"
import { columns } from "@/app/ui/tables/project-resources-columns"
import { DataTable } from "@/app/ui/data-table"


/*
 * This is the project resources table (client) component
 * It is based in tanstack table library and reuses the generic DataTable component
 * customized for this particular view
 */
export default async function ProjectResourcesTable({ resources }: { resources: ProjectResource[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={resources} />
    </div>
  )
}
