"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type ProjectResource } from "@/app/lib/definitions"

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
