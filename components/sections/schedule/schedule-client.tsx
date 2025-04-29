"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, ChevronLeft, ChevronRight, Download, FileSpreadsheet, Eye } from "lucide-react"
import { exportToPdf, exportToExcel } from "@/lib/export-utils"
import { CalendarView } from "@/components/sections/schedule/calendar-view"
import { DayScheduleDialog } from "@/components/sections/schedule/day-schedule-dialog"
import { PdfPreview } from "@/components/sections/schedule/pdf-preview"

// Types
type Worker = {
  id: string
  name: string
  position: "kitchen" | "cashier" | "both"
}

type ScheduleEntry = {
  workerId: string
  position: "kitchen" | "cashier"
}

type DaySchedule = {
  date: string
  workers: ScheduleEntry[]
}

// Mock data - Added more workers
const mockWorkers: Worker[] = [
  { id: "1", name: "Kovács János", position: "kitchen" },
  { id: "2", name: "Nagy Éva", position: "cashier" },
  { id: "3", name: "Szabó Péter", position: "both" },
  { id: "4", name: "Tóth Katalin", position: "kitchen" },
  { id: "5", name: "Horváth Gábor", position: "cashier" },
  { id: "6", name: "Kiss Eszter", position: "both" },
  { id: "7", name: "Varga Zoltán", position: "kitchen" },
  { id: "8", name: "Molnár Anna", position: "cashier" },
  { id: "9", name: "Németh Krisztián", position: "kitchen" },
  { id: "10", name: "Farkas Viktória", position: "cashier" },
]

export function ScheduleClientContent() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<"kitchen" | "cashier">("kitchen")
  const [showPreview, setShowPreview] = useState(false)

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

  // Get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "Január",
      "Február",
      "Március",
      "Április",
      "Május",
      "Június",
      "Július",
      "Augusztus",
      "Szeptember",
      "Október",
      "November",
      "December",
    ]
    return monthNames[month]
  }

  // Get schedule for a specific day
  const getDaySchedule = (date: string) => {
    return schedule.find((day) => day.date === date)?.workers || []
  }

  // Check if worker is already scheduled for the day
  const isWorkerScheduled = (date: string, workerId: string) => {
    const daySchedule = getDaySchedule(date)
    return daySchedule.some((entry) => entry.workerId === workerId)
  }

  // Count workers by position for a specific day
  const countWorkersByPosition = (date: string, position: "kitchen" | "cashier") => {
    const daySchedule = getDaySchedule(date)
    return daySchedule.filter((entry) => entry.position === position).length
  }

  // Filter workers by position and search term
  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      (worker.position === selectedPosition || worker.position === "both") &&
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      selectedDay &&
      !isWorkerScheduled(formatDate(selectedDay), worker.id),
  )

  // Handle previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Handle next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle day click
  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDay(selectedDate)
    setDialogOpen(true)
  }

  // Handle add worker to schedule
  const handleAddWorker = (workerId: string) => {
    if (!selectedDay) return

    const dateStr = formatDate(selectedDay)
    const existingDayIndex = schedule.findIndex((day) => day.date === dateStr)

    // Check position limits - increased limits to allow more workers
    const kitchenCount = countWorkersByPosition(dateStr, "kitchen")
    const cashierCount = countWorkersByPosition(dateStr, "cashier")

    if (selectedPosition === "kitchen" && kitchenCount >= 4) {
      toast({
        title: "Pozíció limit elérve",
        description: "Maximum 4 dolgozó rendelhető a konyhára",
        variant: "destructive",
      })
      return
    }

    if (selectedPosition === "cashier" && cashierCount >= 3) {
      toast({
        title: "Pozíció limit elérve",
        description: "Maximum 3 dolgozó rendelhető pénztárosnak",
        variant: "destructive",
      })
      return
    }

    const newEntry: ScheduleEntry = {
      workerId,
      position: selectedPosition,
    }

    if (existingDayIndex >= 0) {
      // Update existing day
      const updatedSchedule = [...schedule]
      updatedSchedule[existingDayIndex] = {
        ...updatedSchedule[existingDayIndex],
        workers: [...updatedSchedule[existingDayIndex].workers, newEntry],
      }
      setSchedule(updatedSchedule)
    } else {
      // Add new day
      setSchedule([...schedule, { date: dateStr, workers: [newEntry] }])
    }

    toast({
      title: "Dolgozó beosztva",
      description: `A dolgozó beosztva a következő napra: ${selectedDay.toLocaleDateString()}`,
    })
  }

  // Handle remove worker from schedule
  const handleRemoveWorker = (date: string, workerId: string) => {
    const existingDayIndex = schedule.findIndex((day) => day.date === date)

    if (existingDayIndex >= 0) {
      const updatedSchedule = [...schedule]
      updatedSchedule[existingDayIndex] = {
        ...updatedSchedule[existingDayIndex],
        workers: updatedSchedule[existingDayIndex].workers.filter((w) => w.workerId !== workerId),
      }

      // Remove day if no workers
      if (updatedSchedule[existingDayIndex].workers.length === 0) {
        updatedSchedule.splice(existingDayIndex, 1)
      }

      setSchedule(updatedSchedule)

      toast({
        title: "Dolgozó eltávolítva",
        description: "A dolgozó eltávolítva a beosztásból",
      })
    }
  }

  // Handle export to PDF
  const handleExportPdf = () => {
    exportToPdf(currentDate, schedule, mockWorkers)
    toast({
      title: "PDF exportálva",
      description: "A beosztás PDF formátumban exportálva",
    })
  }

  // Handle export to Excel
  const handleExportExcel = () => {
    exportToExcel(currentDate, schedule, mockWorkers)
    toast({
      title: "Excel exportálva",
      description: "A beosztás Excel formátumban exportálva",
    })
  }

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={togglePreview}>
          <Eye className="mr-2 h-4 w-4" />
          {showPreview ? "Előnézet elrejtése" : "Előnézet mutatása"}
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <Button variant="outline" onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </Button>
      </div>

      <div className="mt-6">
        <Card className="border-border/40 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <CalendarView
              currentDate={currentDate}
              schedule={schedule}
              getDaySchedule={getDaySchedule}
              countWorkersByPosition={countWorkersByPosition}
              handleDayClick={handleDayClick}
            />
          </CardContent>
        </Card>
      </div>

      {showPreview && <PdfPreview currentDate={currentDate} schedule={schedule} workers={mockWorkers} />}

      {/* Day Schedule Dialog */}
      <DayScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDay={selectedDay}
        mockWorkers={mockWorkers}
        getDaySchedule={getDaySchedule}
        countWorkersByPosition={countWorkersByPosition}
        formatDate={formatDate}
        handleRemoveWorker={handleRemoveWorker}
        handleAddWorker={handleAddWorker}
        filteredWorkers={filteredWorkers}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  )
}
