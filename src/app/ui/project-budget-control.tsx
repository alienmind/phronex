"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Wand2 } from "lucide-react";
import { 
  fetchProjectBudgetAction, 
  updateBudgetAction,
  fetchCategoriesAction,
  fetchProjectReportAction,
  fetchProjectByIdAction,
} from "@/app/lib/actions";
import { 
  suggestBudgets
} from "@/app/lib/ai";
import { formatCurrency } from "@/app/lib/miscutils";
import { BudgetEditModal } from "./project-budget-modal";
import { useToast } from "@/hooks/use-toast";
import { VProjectBudgetReport } from "../lib/dataschemas";

interface CategoryBudget {
  category_id: string;
  category_name: string;
  budget: number;
}

export function ProjectBudgetControls({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [debouncedUpdates, setDebouncedUpdates] = useState<{[key: string]: NodeJS.Timeout}>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, name: string}>>([]);

  // Load available categories when opening modal
  useEffect(() => {
    async function loadCategories() {
      const result = await fetchCategoriesAction();
      if (result?.success && result?.data) {
        setAvailableCategories(result?.data.map(cat => ({ id: cat.category_id, name: cat.category_name })));
      }
    }
    loadCategories();
  }, [showAddModal, categories]);

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
    const result = await updateBudgetAction(
      projectId,
      categoryId,
      newValue
    );

    if (result.success) {
      window.dispatchEvent(new Event('amount-or-budget-changed'));
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

  const handleAddBudget = async (categoryId: string, amount: number) => {
    const result = await updateBudgetAction(
      projectId,
      categoryId,
      amount
    );

    if (result.success) {
      // Refresh the budget data
      const refreshResult = await fetchProjectBudgetAction(projectId);
      if (refreshResult?.success && refreshResult?.data) {
        setCategories(refreshResult.data);
      }
      window.dispatchEvent(new Event('amount-or-budget-changed'));
    }
  };

  const handleSuggestBudgets = async () => {
    try {
      // Fetch project details to get the scope
      const projectResult = await fetchProjectByIdAction(projectId);
      if (!projectResult) {
        throw new Error('Failed to fetch project details');
      }

      // Fetch all categories
      const categoriesResult = await fetchCategoriesAction();
      if (!categoriesResult?.success) {
        throw new Error('Failed to fetch categories');
      }

      const startDate = projectResult.data?.project_start_date ? new Date(projectResult.data.project_start_date) : new Date();
      const endDate = projectResult.data?.project_end_date ? new Date(projectResult.data.project_end_date) : new Date();

      // Get budget suggestions. We need to pass the categories, the scope and the duration in days
      const suggestions = await suggestBudgets(
        categoriesResult.data,
        projectResult.data?.project_scope || '',
        Math.ceil((endDate.getTime() - startDate.getTime()) / 
          (1000 * 60 * 60 * 24)).toString() + ' days'
      );

      // Update budgets for each suggestion
      for (const suggestion of suggestions) {
        const category = categoriesResult.data.find(
          cat => cat.category_name === suggestion.category_name
        );
        
        if (category) {
          await updateBudgetAction(
            projectId,
            category.category_id,
            suggestion.budget
          );
        }
      }

      // Refresh budgets display
      const refreshResult = await fetchProjectBudgetAction(projectId);
      if (refreshResult?.success && refreshResult?.data) {
        setCategories(refreshResult.data.map(item => ({
          category_id: item.category_id,
          category_name: item.category_name,
          budget: item.budget
        })));
      }

      // Notify success
      toast({
        title: "Budget Suggestions Applied",
        description: "AI-generated budgets have been set for the project categories.",
      });

      // Trigger chart update
      window.dispatchEvent(new Event('amount-or-budget-changed'));

    } catch (error) {
      console.error('Error suggesting budgets:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply budget suggestions.",
      });
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleSuggestBudgets}
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">No budget assigned yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleSuggestBudgets}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
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

      <BudgetEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBudget}
        categoryName=""
        currentAmount={0}
        availableCategories={availableCategories}
        showCategorySelect={true}
      />
    </div>
  );
}
