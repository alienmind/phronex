'use client';

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"
import { VPerson } from "@/app/lib/dataschemas"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/ui/data-table"
import { updatePersonAction, createPersonAction, deletePersonAction } from '@/app/lib/actions';

const columns: ColumnDef<VPerson>[] = [
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
    meta: {
      editable: true,
    }
  },
  {
    accessorKey: "person_surname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Surname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      editable: true,
    }
  },
  {
    accessorKey: "person_email",
    header: "Email",
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
  }
];

export default function PersonsTable({ persons }: { persons: VPerson[] }) {
  const [currentPersons, setCurrentPersons] = useState(persons);

  const handlePersonUpdate = async (rowId: string, data: Partial<VPerson>) => {
    const result = await updatePersonAction(rowId, data);
    
    if (!result.success) {
      throw new Error('Failed to update person');
    }

    setCurrentPersons(prev => 
      prev.map(person => 
        person.person_id === rowId
          ? { ...person, ...result.person }
          : person
      )
    );
  };

  const handlePersonCreate = async (data: Partial<VPerson>) => {
    const result = await createPersonAction(data);

    if (!result.success) {
      throw new Error('Failed to create person');
    }

    setCurrentPersons(prev => [...prev, result.person]);
  };

  const handlePersonDelete = async (rowId: string) => {
    const result = await deletePersonAction(rowId);
    
    if (!result.success) {
      throw new Error('Failed to delete person');
    }

    setCurrentPersons(prev => 
      prev.filter(person => person.person_id !== rowId)
    );
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={currentPersons}
        onRowUpdate={handlePersonUpdate}
        onRowCreate={handlePersonCreate}
        onRowDelete={handlePersonDelete}
        idField="person_id"
      />
    </div>
  );
} 