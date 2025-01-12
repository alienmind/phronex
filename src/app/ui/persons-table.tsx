'use client';

import { columns } from "@/app/ui/tables/persons-columns"
import { DataTable } from "@/app/ui/data-table"

export default function PersonsTable({ 
  persons 
}: { 
  persons: any[]
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={persons} />
    </div>
  )
} 