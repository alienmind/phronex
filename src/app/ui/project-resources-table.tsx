import { ProjectResource } from "@/app/lib/definitions"
import { columns } from "./tables/project-resources-columns"
import { DataTable } from "@/app/ui/data-table"

export default async function ProjectResourcesTable({ resources }: { resources: ProjectResource[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={resources} />
    </div>
  )
}
