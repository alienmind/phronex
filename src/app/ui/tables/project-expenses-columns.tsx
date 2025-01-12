"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type ProjectExpensesCategoryBudget } from "@/app/lib/dataschemas"

/*
 * This is the project expenses columns (client) component
 * It is required by the tanstack table library to keep reusable the data-table componet
 */
export const columns: ColumnDef<ProjectExpensesCategoryBudget>[] = [
  {
    accessorKey: "expense_date",
    header: "Expense date",
  },
  {
    accessorKey: "expense_name",
    header: "Expense name",
  },
  {
    accessorKey: "expense_value",
    header: "Expense value",
  },
  {
    accessorKey: "expense_category_name",
    header: "Expense category",
  },
  {
    accessorKey: "project_category_budget",
    header: "Estimated budget",
  },
]