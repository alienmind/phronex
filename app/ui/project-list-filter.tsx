'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProjectListFilter({ 
  defaultValue = 6,
  onLimitChange
}: { 
  defaultValue?: number,
  onLimitChange?: (limit: number | undefined) => void 
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams);
    const newLimit = value === 'all' ? undefined : parseInt(value);
    
    if (value === 'all') {
      params.delete('limit');
    } else {
      params.set('limit', value);
    }
    replace(`${pathname}?${params.toString()}`);
    
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Show:</label>
      <Select
        defaultValue={defaultValue.toString()}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3">3 Projects</SelectItem>
          <SelectItem value="6">6 Projects</SelectItem>
          <SelectItem value="9">9 Projects</SelectItem>
          <SelectItem value="12">12 Projects</SelectItem>
          <SelectItem value="all">All Projects</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 