"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ProjectResourceTableView } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const RoleFilter = ({ projectId, onResourcesChange }: { 
  projectId: string;
  onResourcesChange: (resources: any[]) => void;
}) => {
  const [roles, setRoles] = React.useState<{role_id: string, role_description: string}[]>([]);

  React.useEffect(() => {
    async function loadRoles() {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    }
    loadRoles();
  }, []);

  async function handleRoleChange(role: string) {
    const params = new URLSearchParams();
    if (role !== 'all') params.set('role', role);
    
    const response = await fetch(`/api/projects/${projectId}/resources?${params.toString()}`);
    const resources = await response.json();
    onResourcesChange(resources);
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="w-[70%]">
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role.role_id} value={role.role_description}>
                {role.role_description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        variant="outline" 
        className="w-[30%]"
        onClick={() => handleRoleChange('all')}
      >
        Reset filter
      </Button>
    </div>
  )
}

export { RoleFilter }

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
