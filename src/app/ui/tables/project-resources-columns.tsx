"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type ProjectResource } from "@/app/lib/dataschemas"

/*
 * This is the project resources columns definition
 * It is required by the tanstack table library to keep reusable the data-table componet
 */
export const columns: ColumnDef<ProjectResource>[] = [
  {
    accessorKey: "person_name",
    header: "Person name",
  },
  {
    accessorKey: "role_description",
    header: "Role description",
  }
]
