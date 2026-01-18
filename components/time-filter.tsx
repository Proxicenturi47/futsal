"use client"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface TimeFilterProps {
  selectedTime: string | null
  onTimeSelect: (time: string | null) => void
}

const TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
]

export function TimeFilter({ selectedTime, onTimeSelect }: TimeFilterProps) {
  const [open, setOpen] = useState(false)

  const handleTimeSelect = (time: string) => {
    if (selectedTime === time) {
      onTimeSelect(null)
    } else {
      onTimeSelect(time)
    }
    setOpen(false)
  }

  const clearFilter = () => {
    onTimeSelect(null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedTime ? "default" : "outline"}
          className={`gap-2 ${
            selectedTime
              ? "bg-primary text-primary-foreground"
              : "border-border hover:bg-secondary"
          }`}
        >
          <Clock className="w-4 h-4" />
          {selectedTime ? selectedTime : "Select Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Select Time Slot</h4>
            {selectedTime && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeSelect(time)}
                className={`text-xs ${
                  selectedTime === time
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {time}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select a time to filter available courts
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
