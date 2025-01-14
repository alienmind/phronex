"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { getInitials } from "../lib/miscutils"

const chartData = [
  { 
    category_name: "Hardware", 
    category_id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    project_id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    budget: 50000, 
    spent: 45000 
  },
  { 
    category_name: "Software", 
    category_id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
    project_id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    budget: 50000, 
    spent: 52000 
  },
  { 
    category_name: "Consulting", 
    category_id: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
    project_id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    budget: 100000, 
    spent: 85000 
  },
  { 
    category_name: "Training", 
    category_id: "8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e",
    project_id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    budget: 75000, 
    spent: 45000 
  },
  { 
    category_name: "Travel", 
    category_id: "9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
    project_id: "7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
    budget: 25000, 
    spent: 22000 
  }
]

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(142 71% 45%)",
  },
  spent: {
    label: "Spent",
    color: "hsl(142 60% 55%)",
  },
} satisfies ChartConfig

export function ProjectChart({ projectId }: { projectId: string }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category_name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
          dataKey="budget"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.toLocaleString('en-UK', { style: 'currency', currency: 'EUR' })}
        />
        <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
        <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}