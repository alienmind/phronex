'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ProjectExpensesCategoryBudgetTableView } from "../lib/dataschemas";
import { formatDateToLocal } from "@/app/lib/miscutils"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { ExpenseListFilter } from "@/app/ui/expense-list-filter";
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

const columns: ColumnDef<ProjectExpensesCategoryBudgetTableView>[] = [
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
    meta: {
      editable: true,
    },
  },
  {
    accessorKey: "expense_value",
    header: "Value",
    meta: {
      editable: true,
    },
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
];

export default function ProjectExpensesTable({ 
  expenses,
  projectId 
}: { 
  expenses: ProjectExpensesCategoryBudgetTableView[],
  projectId: string 
}) {
  const [currentExpenses, setCurrentExpenses] = useState(expenses);

  const handleExpenseUpdate = async (rowId: string, data: Partial<ProjectExpensesCategoryBudgetTableView>) => {
    const response = await fetch(`/api/expenses/${rowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    // Refresh the expenses list
    const updatedExpense = await response.json();
    setCurrentExpenses(prev => 
      prev.map(expense => 
        expense.expense_id === rowId ? { ...expense, ...updatedExpense.expense } : expense
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <ExpenseListFilter 
            projectId={projectId}
            onExpensesChange={setCurrentExpenses}
          />
        </div>
      </div>
      <DataTable
        columns={columns} 
        data={currentExpenses} 
        onRowUpdate={handleExpenseUpdate}
        idField="expense_id"
      />
    </div>
  )
}
