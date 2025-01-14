'use client';

/*
 * This is the project list filter (client) component
 * It allows to limit the number of projects displayed in the project list
 * 
 * FIXME - some times the last option is not selected. Needs fixing.
 */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProjectListFilter({ 
  onLimitChange
}: { 
  onLimitChange?: (limit: number | undefined) => void 
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentValue = searchParams.get('limit') || '0';

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams);
    const newLimit = parseInt(value);
    
    if (value === '0') {
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
        value={currentValue.toString()}
        onValueChange={handleFilterChange}
        defaultValue="0"
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All Projects</SelectItem>
          <SelectItem value="3">3 Projects</SelectItem>
          <SelectItem value="6">6 Projects</SelectItem>
          <SelectItem value="9">9 Projects</SelectItem>
          <SelectItem value="12">12 Projects</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 