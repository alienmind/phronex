"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { Person, ProjectResourceTableView } from "@/app/lib/dataschemas"
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

async function deleteResource(personId: string) {
  // TODO: Implement delete functionality
  console.log('Removing resource:', personId);
}

/*
 * This is the project resources columns definition
 * It is required by the tanstack table library to keep reusable the data-table componet
 */
export const columns: ColumnDef<ProjectResourceTableView>[] = [
  {
    accessorKey: "person_name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Person name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const personName = row.getValue("person_name") as string;
      return <span className="text-left">{personName}</span>;
    },
  },
  {
    accessorKey: "role_description",
    header: "Role description",
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
      const resource : ProjectResourceTableView = row.original
 
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
              onClick={() => deleteResource(resource.person_id)}
            >
              Remove resource
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View person details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
