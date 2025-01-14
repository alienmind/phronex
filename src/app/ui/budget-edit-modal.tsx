/*
 * This client component is used to edit the budget for a category when clicking the project chart
 */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BudgetEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (amount: number) => void
  categoryName: string
  currentAmount: number
}

export function BudgetEditModal({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  currentAmount
}: BudgetEditModalProps) {
  const [amount, setAmount] = useState(currentAmount)

  useEffect(() => {
    setAmount(currentAmount)
  }, [currentAmount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("NEW amount", amount)
    onSubmit(amount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget for {categoryName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 