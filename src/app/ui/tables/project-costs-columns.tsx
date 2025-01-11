"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type ProjectCost } from "@/app/lib/definitions"

export const columns: ColumnDef<ProjectCost>[] = [
  {
    accessorKey: "cost_name",
    header: "Cost name",
  },
  {
    accessorKey: "category_name",
    header: "Category name",
  },
  {
    accessorKey: "estimate",
    header: "Estimated cost",
  },
  {
    accessorKey: "real",
    header: "Real cost",
  },
  {
    accessorKey: "period_start",
    header: "Period start",
  },
  {
    accessorKey: "period_end",
    header: "Period end",
  }
]