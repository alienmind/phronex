'use client';

import { columns } from "@/app/ui/tables/roles-columns"
import { DataTable } from "@/app/ui/data-table"

export default function RolesTable({ 
  roles 
}: { 
  roles: any[]
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={roles} />
    </div>
  )
} 