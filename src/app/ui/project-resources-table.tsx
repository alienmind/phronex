'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { VProjectResource } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { updateProjectResourceAction, createProjectResourceAction, deleteProjectResourceAction } from '@/app/lib/actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const columns: ColumnDef<VProjectResource>[] = [
  {
    accessorKey: "person_name_surname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Person
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      editable: false,
      selectableOptions: {
        fetchOptions: async () => {
          const persons = await fetch('/api/persons').then(res => res.json());
          return persons.map((person: any) => ({
            id: person.person_id,
            label: person.person_name_surname,
            value: person.person_name_surname,
            hiddenValue: {
              field: 'person_id',
              value: person.person_id,
            }
          }));
        }
      }
    }
  },
  {
    accessorKey: "role_description",
    header: "Role",
    meta: {
      editable: false,
      selectableOptions: {
        fetchOptions: async () => {
          const roles = await fetch('/api/roles').then(res => res.json());
          return roles.map((role: any) => ({
            id: role.role_description,
            label: role.role_description,
            hiddenValue: role.role_id
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
    accessorKey: "composite_id",
    header: "",
    cell: ({ row }) => {
      return <input type="hidden" value={row.original.composite_id} />;
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
              Unassign resource
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },

  }
];

export default function ProjectResourcesTable({
  resources,
  projectId
}: {
  resources: VProjectResource[],
  projectId: string
}) {
  const [currentResources, setCurrentResources] = useState(resources);

  const handleResourceUpdate = async (rowId: string, data: Partial<VProjectResource>) => {
    const [projectId, personId] = rowId.split('_');
    console.log("**** Im going to update resources for: ", projectId, personId, JSON.stringify(data));
    const result = await updateProjectResourceAction(projectId, personId, data);

    if (!result.success) {
      throw new Error('Failed to update resource');
    }

    setCurrentResources(prev =>
      prev.map(resource =>
        resource.person_id === personId && resource.project_id === projectId
          ? { ...resource, ...result.resource }
          : resource
      )
    );
  };

  const handleResourceCreate = async (data: Partial<VProjectResource>) => {
    console.log("**** Im going to create resource for: ", projectId, JSON.stringify(data));
    const result = await createProjectResourceAction({
      ...data,
      project_id: projectId
    });

    if (!result.success) {
      console.error("Failed to create resource", JSON.stringify(result));
      throw new Error('Failed to create resource');
    }

    setCurrentResources(prev => [...prev, result.resource as VProjectResource]);
  };

  const handleResourceDelete = async (rowId: string) => {
    const [projectId, personId] = rowId.split('_');
    const result = await deleteProjectResourceAction(projectId, personId);

    if (!result.success) {
      console.error("Failed to unassign resource", JSON.stringify(result));
      throw new Error('Failed to unassign resource');
    }

    setCurrentResources(prev =>
      prev.filter(resource =>
        !(resource.person_id === personId && resource.project_id === projectId)
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={currentResources}
        onRowUpdate={handleResourceUpdate}
        onRowCreate={handleResourceCreate}
        onRowDelete={handleResourceDelete}
        idField="composite_id"
        showNewButton={false}
      />
    </div>
  );
}
