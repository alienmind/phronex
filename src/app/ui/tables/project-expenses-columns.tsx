"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { type ProjectExpensesCategoryBudgetTableView } from "@/app/lib/dataschemas"
import { formatDateToLocal } from "@/app/lib/miscutils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function deleteExpense(expenseId: string) {
  // TODO: Implement delete functionality
  console.log('Deleting expense:', expenseId);
}

/*
 * This is the project expenses columns definition
 * It is required by the tanstack table library to keep reusable the data-table componet
 */
export const columns: ColumnDef<ProjectExpensesCategoryBudgetTableView>[] = [
  {
    accessorKey: "expense_date",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expense date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const expenseDate = row.getValue("expense_date");
      return <span className="text-left">{expenseDate ? formatDateToLocal(expenseDate as string) : "Unknown"}</span>;
    },
  },
  {
    accessorKey: "expense_name",
    header: "Name",
  },
  {
    accessorKey: "expense_value",
    header: "Value",
  },
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => {
      const categoryName = row.getValue("category_name");
      return <span>{categoryName ? String(categoryName) : "Unknown"}</span>
    },
  },
  {
    accessorKey: "project_category_budget",
    header: "Budget",
  },
  {
    accessorKey: "all_columns",
    header: "",
    cell: ({ row }) => {
      return <input type="hidden" value={row.original.all_columns} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => deleteExpense(expense.expense_id)}
            >
              Delete expense
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View expense details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]