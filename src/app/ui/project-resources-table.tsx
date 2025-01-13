'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ProjectResourceTableView } from "@/app/lib/dataschemas"
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
  const [roles, setRoles] = useState<{role_id: string, role_description: string}[]>([]);

  useEffect(() => {
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

const columns: ColumnDef<ProjectResourceTableView>[] = [
  {
    accessorKey: "person_name",
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
  },
  {
    accessorKey: "role_description",
    header: "Role",
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
      const resource = row.original
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
            <DropdownMenuItem>Remove from project</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Change role</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export { RoleFilter };

export default function ProjectResourcesTable({ 
  resources,
  projectId 
}: { 
  resources: ProjectResourceTableView[],
  projectId: string
}) {
  const [currentResources, setCurrentResources] = useState(resources);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <RoleFilter 
            projectId={projectId}
            onResourcesChange={setCurrentResources}
          />
        </div>
      </div>
      <DataTable columns={columns} data={currentResources} />
    </div>
  )
}
