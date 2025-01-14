"use client"
/*
 * This component displays a chart of the project budget and spent
 * It is used in the project details page
 */

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { VProjectBudgetReport } from "../lib/dataschemas"
import { fetchProjectBudgetAction } from "../lib/actions"
import { formatCurrency } from "../lib/miscutils"

// Create a global event bus for expense changes
export const expenseChangeEventName = 'expense-amount-changed'
export const expenseChangeEvent = new Event(expenseChangeEventName)

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

// Helper function to determine spend color based on percentage of budget
function getSpentColor(spent: number, budget: number): string {
  const ratio = spent / budget
  if (ratio <= 0.7) return "hsl(142 60% 65%)"  // Pastel green for low spend
  if (ratio <= 1.0) return "hsl(35 90% 75%)"   // Pastel orange for near budget
  return "hsl(0 90% 65%)"                       // Bright red for over budget
}

// Add a custom tooltip formatter
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg dark:bg-neutral-900 dark:border-neutral-800">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm">
            <span className="font-medium">{entry.name}: </span>
            {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProjectChart({ projectId }: { projectId: string }) {
  const [chartData, setChartData] = useState<VProjectBudgetReport[]>([])
  const [maxDomain, setMaxDomain] = useState<number>(0)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  useEffect(() => {
    // Add event listener for expense changes
    const handleExpenseChange = () => {
      setUpdateTrigger(prev => prev + 1)
    }

    window.addEventListener(expenseChangeEventName, handleExpenseChange)
    return () => {
      window.removeEventListener(expenseChangeEventName, handleExpenseChange)
    }
  }, [])

  useEffect(() => {
    async function loadBudgetData() {
      const result = await fetchProjectBudgetAction(projectId)
      if (result.success && result.data) {
        // Find the max value across all entries
        const max = Math.max(...result.data.map(item => 
          Math.max(item.budget || 0, item.spent || 0)
        ))
        
        // Round up to nearest 10K
        const roundedMax = Math.ceil(max / 10000) * 10000
        setMaxDomain(roundedMax)
        
        // Remove max_value before setting chart data
        setChartData(result.data.map(({ max_value, ...item }) => item))
      }
    }

    loadBudgetData()
  }, [projectId, updateTrigger]) // Add updateTrigger to dependencies

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
          domain={[0, maxDomain]}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip 
          content={CustomTooltip}
          cursor={{ fill: 'transparent' }}
        />
        <Bar 
          name="Budget"
          dataKey="budget" 
          fill={`hsl(var(--chart-1))`} 
          radius={4} 
        />
        <Bar 
          name="Spent"
          dataKey="spent" 
          radius={4}
          fillOpacity={0.8}
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getSpentColor(entry.spent, entry.budget)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}