import { ProjectCost } from "../lib/definitions";
import { columns } from "./tables/project-costs-columns"
import { DataTable } from "@/app/ui/data-table"

export default async function ProjectCostsTable({ costs }: { costs: ProjectCost[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={costs} />
    </div>
  )
}