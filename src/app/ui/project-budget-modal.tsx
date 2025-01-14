/*
 * This client component is used to edit the budget for a category when clicking the project chart
 */
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BudgetEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (categoryId: string, amount: number) => void
  categoryName: string
  currentAmount: number
  categoryId?: string
  availableCategories?: Array<{id: string, name: string}>
  showCategorySelect?: boolean
}

export function BudgetEditModal({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  currentAmount,
  categoryId = '',
  availableCategories = [],
  showCategorySelect = false
}: BudgetEditModalProps) {
  const [amount, setAmount] = useState(currentAmount)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  useEffect(() => {
    setAmount(currentAmount)
  }, [currentAmount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showCategorySelect && !selectedCategoryId) return
    onSubmit(showCategorySelect ? selectedCategoryId : categoryId, amount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showCategorySelect ? 'Add New Budget Category' : `Edit Budget for ${categoryName}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {showCategorySelect && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right">
                  Category
                </label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
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
            <Button 
              type="submit"
              disabled={showCategorySelect && !selectedCategoryId}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 