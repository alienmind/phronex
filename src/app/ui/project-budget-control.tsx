"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchProjectBudgetAction } from "@/app/lib/actions";

interface CategoryBudget {
  category_id: string;
  category_name: string;
  budget: number;
}

export function ProjectBudgetControls({ projectId }: { projectId: string }) {
  const [categories, setCategories] = useState<CategoryBudget[]>([]);

  useEffect(() => {
    async function loadBudgetData() {
      const result = await fetchProjectBudgetAction(projectId);
      if (result?.success && result?.data) {
        setCategories(result.data);
      }
    }
    loadBudgetData();
  }, [projectId]);

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
          <div className="col-span-3">
            <Slider
              defaultValue={[category.budget]}
              max={1000000}
              step={1000}
              value={[category.budget]}
              className={cn("w-full")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
