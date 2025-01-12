import { ProjectExpensesCategoryBudget } from "../lib/dataschemas";
import { columns } from "@/app/ui/tables/project-expenses-columns"
import { DataTable } from "@/app/ui/data-table"

/*
 * This is the project expenses table (client) component
 * It is based in tanstack table library and reuses the generic DataTable component
 * customized for this particular view
 */

export default async function ProjectExpensesTable({ costs }: { costs: ProjectExpensesCategoryBudget[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={costs} />
    </div>
  )
}