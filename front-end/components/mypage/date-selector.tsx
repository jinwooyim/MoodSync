"use client"

import { useState } from "react"
import { format, isAfter } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">날짜 선택</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && !isAfter(date, new Date())) {
                onDateChange(date)
                setOpen(false)
              }
            }}
            disabled={(date) => isAfter(date, new Date())}
            initialFocus
            locale={ko}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
