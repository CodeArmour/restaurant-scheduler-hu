"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, ChevronLeft, ChevronRight, Download, FileSpreadsheet, Eye } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
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
  { id: "1", name: "John Doe", position: "kitchen" },
  { id: "2", name: "Jane Smith", position: "cashier" },
  { id: "3", name: "Mike Johnson", position: "both" },
  { id: "4", name: "Sarah Williams", position: "kitchen" },
  { id: "5", name: "David Brown", position: "cashier" },
  { id: "6", name: "Lisa Davis", position: "both" },
  { id: "7", name: "Robert Wilson", position: "kitchen" },
  { id: "8", name: "Emily Taylor", position: "cashier" },
  { id: "9", name: "Christopher Anderson", position: "kitchen" }, // Added longer name
  { id: "10", name: "Elizabeth Martinez", position: "cashier" }, // Added longer name
]

export function MonthlySchedule() {
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
    return new Date(0, month).toLocaleString("default", { month: "long" })
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
        title: "Position limit reached",
        description: "Maximum 4 workers can be assigned to kitchen",
        variant: "destructive",
      })
      return
    }

    if (selectedPosition === "cashier" && cashierCount >= 3) {
      toast({
        title: "Position limit reached",
        description: "Maximum 3 workers can be assigned as cashiers",
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
      title: "Worker scheduled",
      description: `Worker has been scheduled for ${selectedDay.toLocaleDateString()}`,
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
        title: "Worker removed",
        description: "Worker has been removed from the schedule",
      })
    }
  }

  // Handle export to PDF
  const handleExportPdf = () => {
    exportToPdf(currentDate, schedule, mockWorkers)
    toast({
      title: "PDF exported",
      description: "Schedule has been exported as PDF",
    })
  }

  // Handle export to Excel
  const handleExportExcel = () => {
    exportToExcel(currentDate, schedule, mockWorkers)
    toast({
      title: "Excel exported",
      description: "Schedule has been exported as Excel file",
    })
  }

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <>
      <PageHeader title="Monthly Schedule" description="Create and manage your staff schedule" icon={Calendar}>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={togglePreview}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
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
      </PageHeader>

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
