/*
 * This is the expense list filter component (client)
 * It is used to filter the expense list by date range
 * It presents two DatePickers and holds a state with the DateRange
 * 
 * When any of the dates changes, the path will be revalidated
 */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DateRangePicker } from './date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

interface ExpenseListFilterProps {
  projectId: string;
  onExpensesChange: (expenses: any[]) => void;
}

export function ExpenseListFilter({ projectId, onExpensesChange }: ExpenseListFilterProps) {
  const defaultSelected: DateRange = {
    from: addDays(new Date(), -180),
    to: new Date(),
  };

  async function handleDateRangeChange(range: DateRange | undefined) {
    const startDate = range?.from?.toISOString().substring(0, 10);
    const endDate = range?.to?.toISOString().substring(0, 10);
    
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    
    const response = await fetch(`/api/projects/${projectId}/expenses?${params.toString()}`);
    const expenses = await response.json();
    onExpensesChange(expenses);
  }

  return (
    <DateRangePicker 
      onDateRangeChange={handleDateRangeChange}
      defaultDate={defaultSelected}
    />
  );
} 