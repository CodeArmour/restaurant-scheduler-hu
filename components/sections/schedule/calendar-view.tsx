"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type DaySchedule = {
  date: string
  workers: {
    workerId: string
    position: "kitchen" | "cashier"
  }[]
}

interface CalendarViewProps {
  currentDate: Date
  schedule: DaySchedule[]
  getDaySchedule: (date: string) => any[]
  countWorkersByPosition: (date: string, position: "kitchen" | "cashier") => number
  handleDayClick: (day: number) => void
}

export function CalendarView({
  currentDate,
  schedule,
  getDaySchedule,
  countWorkersByPosition,
  handleDayClick,
}: CalendarViewProps) {
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week
  const getDayOfWeek = (year: number, month: number, day: number) => {
    return new Date(year, month, day).getDay()
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfWeek = getDayOfWeek(year, month, 1)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 border border-border/40 bg-muted/20"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)
      const daySchedule = getDaySchedule(dateStr)
      const kitchenCount = countWorkersByPosition(dateStr, "kitchen")
      const cashierCount = countWorkersByPosition(dateStr, "cashier")
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={cn(
            "h-16 sm:h-24 border border-border/40 p-1 sm:p-2 cursor-pointer transition-colors",
            isToday ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50",
            daySchedule.length > 0 ? "bg-green-50/50 dark:bg-green-950/20" : "",
          )}
          onClick={() => handleDayClick(day)}
        >
          <div
            className={cn(
              "font-medium text-sm sm:text-base flex items-center justify-center sm:justify-start h-6 w-6 sm:h-auto sm:w-auto rounded-full",
              isToday ? "bg-primary text-primary-foreground sm:bg-transparent sm:text-foreground" : "",
            )}
          >
            {day}
          </div>
          {daySchedule.length > 0 && (
            <div className="mt-1 space-y-1 hidden sm:block">
              <div className="flex flex-wrap gap-1">
                {kitchenCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                  >
                    K: {kitchenCount}/4
                  </Badge>
                )}
                {cashierCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    P: {cashierCount}/3
                  </Badge>
                )}
              </div>
            </div>
          )}
          {daySchedule.length > 0 && (
            <div className="flex justify-center sm:justify-start mt-1">
              <Badge className="text-[10px] sm:text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                {daySchedule.length}
              </Badge>
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-7 gap-px">
          <div className="text-center font-medium p-2 text-sm">Vas</div>
          <div className="text-center font-medium p-2 text-sm">Hét</div>
          <div className="text-center font-medium p-2 text-sm">Ked</div>
          <div className="text-center font-medium p-2 text-sm">Sze</div>
          <div className="text-center font-medium p-2 text-sm">Csü</div>
          <div className="text-center font-medium p-2 text-sm">Pén</div>
          <div className="text-center font-medium p-2 text-sm">Szo</div>
          {renderCalendar()}
        </div>
      </div>
    </div>
  )
}
