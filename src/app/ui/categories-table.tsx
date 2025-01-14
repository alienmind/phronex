'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { VCategory } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { updateCategoryAction, createCategoryAction, deleteCategoryAction } from '@/app/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const columns: ColumnDef<VCategory>[] = [
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      editable: true,
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
      const category = row.original;
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
              Delete category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];

export default function CategoriesTable({ categories }: { categories: VCategory[] }) {
  const [currentCategories, setCurrentCategories] = useState(categories);

  const handleCategoryUpdate = async (rowId: string, data: Partial<VCategory>) => {
    const result = await updateCategoryAction(rowId, data);
    
    if (!result.success) {
      throw new Error('Failed to update category');
    }

    setCurrentCategories(prev => 
      prev.map(category => 
        category.category_id === rowId
          ? { ...category, ...result.category }
          : category
      )
    );
  };

  const handleCategoryCreate = async (data: Partial<VCategory>) => {
    const result = await createCategoryAction(data);

    if (!result.success) {
      throw new Error('Failed to create category');
    }

    setCurrentCategories(prev => [...prev, result.category]);
  };

  const handleCategoryDelete = async (rowId: string) => {
    const result = await deleteCategoryAction(rowId);
    
    if (!result.success) {
      throw new Error('Failed to delete category');
    }

    setCurrentCategories(prev => 
      prev.filter(category => category.category_id !== rowId)
    );
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={currentCategories}
        onRowUpdate={handleCategoryUpdate}
        onRowCreate={handleCategoryCreate}
        onRowDelete={handleCategoryDelete}
        idField="category_id"
      />
    </div>
  );
} 