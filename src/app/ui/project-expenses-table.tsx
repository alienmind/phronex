'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, LineChart } from "lucide-react"
import { ProjectExpense, VProjectExpensesWithCategoryBudget } from "../lib/dataschemas";
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
import { updateExpenseAction, createExpenseAction, deleteExpenseAction } from '@/app/lib/actions';
import { ExpensesChartModal } from "./expenses-chart-modal"

const columns: ColumnDef<VProjectExpensesWithCategoryBudget>[] = [
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
      return <span>{categoryName ? String(categoryName) : "Unknown"}</span>;
    },
    meta: {
      editable: true,
      selectableOptions: {
        fetchOptions: async () => {
          const categories = await fetch('/api/categories').then(res => res.json());
          return categories.map((cat: any) => ({
            id: cat.category_name,
            label: cat.category_name,
            hiddenValue: cat.category_id
          }));
        }
      }
    }
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
    cell: ({ row, table }) => {
      const expense = row.original;
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
              onClick={() => (table.options.meta as any).deleteRow(row.id)}
            >
              Delete expense
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export default function ProjectExpensesTable({ 
  expenses,
  projectId,
  projectName
}: { 
  expenses: VProjectExpensesWithCategoryBudget[],
  projectId: string,
  projectName: string
}) {
  const [currentExpenses, setCurrentExpenses] = useState(expenses);
  const [isChartOpen, setIsChartOpen] = useState(false)

  const handleExpenseUpdate = async (rowId: string, data: Partial<VProjectExpensesWithCategoryBudget>) => {
    const result = await updateExpenseAction(rowId, data);
    
    if (!result.success) {
      throw new Error('Failed to update expense');
    }

    setCurrentExpenses(prev => 
      prev.map(expense => 
        expense.expense_id === rowId 
          ? { ...expense, ...result.expense }
          : expense
      )
    );

    // Dispatch an event to trigger the chart update
    window.dispatchEvent(new Event('amount-or-budget-changed'));
  };

  const handleExpenseCreate = async (data: Partial<ProjectExpense>) => {
    const result = await createExpenseAction({
      ...data,
      project_id: projectId
    });

    if (!result.success) {
      throw new Error('Failed to create expense');
    }

    setCurrentExpenses(prev => [...prev, result.expense]);
  };

  const handleExpenseDelete = async (rowId: string) => {
    const result = await deleteExpenseAction(rowId);
    
    if (!result.success) {
      throw new Error('Failed to delete expense');
    }

    setCurrentExpenses(prev => prev.filter(expense => expense.expense_id !== rowId));
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsChartOpen(true)}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Show Graph
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns} 
        data={currentExpenses} 
        onRowUpdate={handleExpenseUpdate}
        onRowCreate={handleExpenseCreate}
        onRowDelete={handleExpenseDelete}
        idField="expense_id"
      />
      <ExpensesChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        expenses={currentExpenses}
        projectName={projectName}
      />
    </div>
  )
}
