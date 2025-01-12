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

export function ExpenseListFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Default to last 6 months if no dates are set
  const defaultSelected: DateRange = {
    from: addDays(new Date(), -180),
    to: new Date(),
  };

  function handleDateRangeChange(range: DateRange | undefined) {
    const params = new URLSearchParams(searchParams);
    
    if (range?.from) {
      params.set('expense_start_date', range.from.toISOString());
    } else {
      params.delete('expense_start_date');
    }
    
    if (range?.to) {
      params.set('expense_end_date', range.to.toISOString());
    } else {
      params.delete('expense_end_date');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <DateRangePicker 
      onDateRangeChange={handleDateRangeChange}
      defaultDate={defaultSelected}
    />
  );
} 