"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { VProjectBudgetReport } from "../lib/dataschemas"
import { fetchProjectBudgetAction } from "../lib/actions"

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
  const [chartData, setChartData] = useState<VProjectBudgetReport[]>([])

  useEffect(() => {
    async function loadBudgetData() {
      const result = await fetchProjectBudgetAction(projectId)
      if (result.success && result.data) {
        setChartData(result.data as VProjectBudgetReport[])
      }
    }

    loadBudgetData()
  }, [projectId])

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