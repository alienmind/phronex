'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { VRole } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { updateRoleAction, createRoleAction, deleteRoleAction } from '@/app/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const columns: ColumnDef<VRole>[] = [
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
              Delete role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];

export default function RolesTable({ roles }: { roles: VRole[] }) {
  const [currentRoles, setCurrentRoles] = useState(roles);

  const handleRoleUpdate = async (rowId: string, data: Partial<VRole>) => {
    const result = await updateRoleAction(rowId, data);
    
    if (!result.success) {
      throw new Error('Failed to update role');
    }

    console.log("ROLES=", JSON.stringify(roles));

    setCurrentRoles(prev => 
      prev.map(role => 
        role.role_id === rowId
          ? { ...role, ...result.role }
          : role
      )
    );
  };

  const handleRoleCreate = async (data: Partial<VRole>) => {
    const result = await createRoleAction(data);

    if (!result.success) {
      throw new Error('Failed to create role');
    }

    setCurrentRoles(prev => [...prev, result.role!]);
  };

  const handleRoleDelete = async (rowId: string) => {
    const result = await deleteRoleAction(rowId);
    
    if (!result.success) {
      throw new Error('Failed to delete role');
    }

    setCurrentRoles(prev => 
      prev.filter(role => role.role_id !== rowId)
    );
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={currentRoles}
        onRowUpdate={handleRoleUpdate}
        onRowCreate={handleRoleCreate}
        onRowDelete={handleRoleDelete}
        idField="role_id"
      />
    </div>
  );
} 