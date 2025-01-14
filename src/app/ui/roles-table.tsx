'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Role = {
  role_id: string;
  role_description: string;
}

async function deleteRole(roleId: string) {
  // TODO: Implement delete functionality
  console.log('Deleting role:', roleId);
}

const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "role_description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "all_columns",
    header: "",
    cell: ({ row }) => {
      // This table is super simple so the "all_columns" is just the role_description
      return <input type="hidden" value={row.original.role_description} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original
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
              onClick={() => deleteRole(role.role_id)}
            >
              Delete role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit role</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];

export default function RolesTable({ 
  roles 
}: { 
  roles: Role[]
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={roles} />
    </div>
  )
} 