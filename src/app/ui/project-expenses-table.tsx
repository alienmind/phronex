import { ProjectExpensesCategoryBudgetTableView } from "../lib/dataschemas";
import { columns } from "@/app/ui/tables/project-expenses-columns"
import { DataTable } from "@/app/ui/data-table"
import { ExpenseListFilter } from "@/app/ui/expense-list-filter";

/*
 * This is the project expenses table (client) component
 * It is based in tanstack table library and reuses the generic DataTable component
 * customized for this particular view
 */

export default async function ProjectExpensesTable({ expenses }: { expenses: ProjectExpensesCategoryBudgetTableView[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <ExpenseListFilter />
        </div>
      </div>
      <DataTable columns={columns} data={expenses} />
    </div>
  )
}
