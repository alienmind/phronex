'use client';

import { useState } from 'react';
import { columns } from "@/app/ui/tables/categories-columns"
import { DataTable } from "@/app/ui/data-table"

export default function CategoriesTable({ 
  categories 
}: { 
  categories: any[]
}) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={categories} />
    </div>
  )
} 