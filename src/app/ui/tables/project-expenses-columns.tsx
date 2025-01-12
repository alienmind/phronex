"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type ProjectExpensesCategoryBudget } from "@/app/lib/dataschemas"
import { formatDateToLocal } from "@/app/lib/miscutils"
/*
 * This is the project expenses columns definition
 * It is required by the tanstack table library to keep reusable the data-table componet
 */
export const columns: ColumnDef<ProjectExpensesCategoryBudget>[] = [
  {
    accessorKey: "expense_date",
    header: "Expense date",
    cell: ({ row }) => {
      const expenseDate = row.getValue("expense_date");
      return <span className="text-left">{expenseDate ? formatDateToLocal(expenseDate as string) : "Unknown"}</span>;
    },
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
    accessorKey: "category_name",
    header: "Expense category",
    cell: ({ row }) => {
      const categoryName = row.getValue("category_name");
      return <span>{categoryName ? String(categoryName) : "Unknown"}</span>
    },
  },
  {
    accessorKey: "project_category_budget",
    header: "Estimated budget",
  },
]