'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"
import { VProjectResources } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { updateProjectResourceAction, createProjectResourceAction, deleteProjectResourceAction } from '@/app/lib/actions';

const columns: ColumnDef<VProjectResources>[] = [
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
      editable: true,
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
              additionalFields: {
                person_name: person.person_name,
                person_surname: person.person_surname,
                person_name_surname: person.person_name_surname,
              }
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
      editable: true,
      selectableOptions: {
        fetchOptions: async () => {
          const roles = await fetch('/api/roles').then(res => res.json());
          return roles.map((role: any) => ({
            id: role.role_description,
            label: role.role_description,
            hiddenValue: {
              field: 'role_id',
              value: role.role_id
            }
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
  }
];

export default function ProjectResourcesTable({ 
  resources,
  projectId 
}: { 
  resources: VProjectResources[],
  projectId: string
}) {
  const [currentResources, setCurrentResources] = useState(resources);

  const handleResourceUpdate = async (rowId: string, data: Partial<VProjectResources>) => {
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

  const handleResourceCreate = async (data: Partial<VProjectResources>) => {
    const result = await createProjectResourceAction({
      ...data,
      project_id: projectId
    });

    if (!result.success) {
      throw new Error('Failed to create resource');
    }

    setCurrentResources(prev => [...prev, result.resource]);
  };

  const handleResourceDelete = async (rowId: string) => {
    const [projectId, personId] = rowId.split('_');
    const result = await deleteProjectResourceAction(projectId, personId);
    
    if (!result.success) {
      throw new Error('Failed to delete resource');
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
      />
    </div>
  );
}
