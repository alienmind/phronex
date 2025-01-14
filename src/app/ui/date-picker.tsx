/*
 * This is a date picker (client) component
 * Allows to pick a date range
 * It is based on the shadcn/ui library
 * 
 * Useful for configuring projects or search queries
 */
'use client';

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * 
 */
export function DatePicker(field: any) {
  return (
    <>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    { /* Hidden input to store the date value - otherwise server action won't pick it */ }
    <input type="hidden" name={field.name} value={field.value?.toISOString()} />
    </>
  );
};