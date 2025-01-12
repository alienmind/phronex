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
import { revalidatePath } from 'next/cache';

export function ExpenseListFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Default to last 6 months if no dates are set
  const defaultSelected: DateRange = {
    from: addDays(new Date(), -180),
    to: new Date(),
  };

  function handleDateRangeChange(range: DateRange | undefined) {
    const params = new URLSearchParams(searchParams);
    
    if (range?.from) {
      params.set('expenses_start_date', range.from.toISOString().substring(0, 10));
    } else {
      params.delete('expenses _start_date');
    }
    
    if (range?.to) {
      params.set('expenses_end_date', range.to.toISOString().substring(0, 10));
    } else {
      params.delete('expenses_end_date');
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <DateRangePicker 
      onDateRangeChange={handleDateRangeChange}
      defaultDate={defaultSelected}
    />
  );
} 