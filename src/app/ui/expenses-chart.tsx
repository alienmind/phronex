"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { VProjectExpensesWithCategoryBudget } from "../lib/dataschemas"
import { formatCurrency, formatDateToLocal } from "../lib/miscutils"

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">Date:</span>
          <span>{formatDateToLocal(label)}</span>
          <span className="font-medium">Amount:</span>
          <span>{formatCurrency(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function ExpensesChart({ expenses }: { expenses: VProjectExpensesWithCategoryBudget[] }) {
  const [chartData, setChartData] = useState<any[]>([])
  const [maxDomain, setMaxDomain] = useState<number>(0)

  useEffect(() => {
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime()
    )

    // Transform data for the chart
    const data = sortedExpenses.map(expense => ({
      date: expense.expense_date,
      amount: expense.expense_value
    }))

    // Find max value for domain
    const max = Math.max(...data.map(item => item.amount))
    const roundedMax = Math.ceil(max / 1000) * 1000
    
    setMaxDomain(roundedMax)
    setChartData(data)
  }, [expenses])

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatDateToLocal(value)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            domain={[0, maxDomain]}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={CustomTooltip} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={`hsl(var(--chart-1))`}
            strokeWidth={2}
            dot={{ fill: `hsl(var(--chart-1))`, r: 4 }}
            activeDot={{ r: 6, fill: `hsl(var(--chart-1))` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
} 