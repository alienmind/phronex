"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExpensesChart } from "./expenses-chart"
import { VProjectExpensesWithCategoryBudget } from "../lib/dataschemas"

interface ExpensesChartModalProps {
  isOpen: boolean
  onClose: () => void
  expenses: VProjectExpensesWithCategoryBudget[]
  projectName: string
}

export function ExpensesChartModal({
  isOpen,
  onClose,
  expenses,
  projectName
}: ExpensesChartModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Expenses Over Time - {projectName}</DialogTitle>
        </DialogHeader>
        <ExpensesChart expenses={expenses} />
      </DialogContent>
    </Dialog>
  )
} 