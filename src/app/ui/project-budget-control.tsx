"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchProjectBudgetAction, updateProjectReportAction } from "@/app/lib/actions";
import { formatCurrency } from "@/app/lib/miscutils";

interface CategoryBudget {
  category_id: string;
  category_name: string;
  budget: number;
}

export function ProjectBudgetControls({ projectId }: { projectId: string }) {
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [debouncedUpdates, setDebouncedUpdates] = useState<{[key: string]: NodeJS.Timeout}>({});

  useEffect(() => {
    async function loadBudgetData() {
      const result = await fetchProjectBudgetAction(projectId);
      if (result?.success && result?.data) {
        setCategories(result.data);
      }
    }
    loadBudgetData();

    // Cleanup timeouts on unmount
    return () => {
      Object.values(debouncedUpdates).forEach(timeout => clearTimeout(timeout));
    };
  }, [projectId]);

  const updateBudget = async (categoryId: string, newValue: number) => {
    const result = await updateProjectReportAction(
      projectId,
      categoryId,
      newValue
    );

    if (result.success) {
      window.dispatchEvent(new Event('expense-amount-changed'));
    }
  };

  const handleSliderChange = (categoryId: string, newValue: number[]) => {
    // Immediately update local state for smooth UI
    setCategories(prev => 
      prev.map(cat => 
        cat.category_id === categoryId 
          ? { ...cat, budget: newValue[0] }
          : cat
      )
    );

    // Clear existing timeout for this category if it exists
    if (debouncedUpdates[categoryId]) {
      clearTimeout(debouncedUpdates[categoryId]);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      updateBudget(categoryId, newValue[0]);
      // Clean up timeout reference
      setDebouncedUpdates(prev => {
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      });
    }, 500);

    // Store new timeout
    setDebouncedUpdates(prev => ({
      ...prev,
      [categoryId]: timeoutId
    }));
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">No budget assigned yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {categories.map((category) => (
        <div key={category.category_id} className="grid grid-cols-4 gap-4 items-center">
          <label className="text-sm font-medium">{category.category_name}</label>
          <div className="col-span-2">
            <Slider
              defaultValue={[category.budget]}
              max={1000000}
              step={1000}
              value={[category.budget]}
              onValueChange={(value) => handleSliderChange(category.category_id, value)}
              className={cn("w-full")}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(category.budget)}
          </div>
        </div>
      ))}
    </div>
  );
}
