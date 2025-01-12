/**
 * Date Range Picker
 * 
 * This component is used to select a date range.
 */
"use client"
 
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  onDateRangeChange?: (range: DateRange | undefined) => void;
  defaultDate?: DateRange;
  className?: string;
}
 
export function DateRangePicker({
  onDateRangeChange,
  defaultDate,
  className
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(defaultDate);
 
  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  const handleReset = () => {
    setDateRange(defaultDate);
    onDateRangeChange?.(defaultDate);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date < new Date("1900-01-01")}
          />
        </PopoverContent>
      </Popover>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleReset}
        className="w-[200px]"
      >
        Reset date range
      </Button>
    </div>
  )
}