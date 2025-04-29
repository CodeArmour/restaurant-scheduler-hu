"use client"

import { jsPDF } from "jspdf"
import * as XLSX from "xlsx"

// Types
type Worker = {
  id: string
  name: string
  position: string
}

type ScheduleEntry = {
  workerId: string
  position: "kitchen" | "cashier"
}

type DaySchedule = {
  date: string
  workers: ScheduleEntry[]
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

// Get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Get day of week
const getDayOfWeek = (date: Date) => {
  const days = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"]
  return days[date.getDay()]
}

// Get first name only
const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0]
}

// Export to PDF
export const exportToPdf = (currentDate: Date, schedule: DaySchedule[], workers: Worker[]) => {
  // Create new PDF with A4 size
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = getMonthName(month)
  const daysInMonth = getDaysInMonth(year, month)

  // Page dimensions
  const pageWidth = 210 // A4 width in mm
  const pageHeight = 297 // A4 height in mm
  const margin = 10 // margin in mm

  // Title
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(`${monthName} ${year} - Éttermi Személyzeti Beosztás`, pageWidth / 2, margin + 10, { align: "center" })

  // Table settings
  const startY = margin + 20
  const tableWidth = pageWidth - 2 * margin
  const dayColWidth = 12 // Width for day number column
  const dayNameColWidth = 28 // Width for day name column

  // Calculate column widths to fit all required columns
  const remainingWidth = tableWidth - dayColWidth - dayNameColWidth
  const positionColWidth = remainingWidth / 7 // Width for each position column (7 columns)
  const rowHeight = 8 // Height of each row

  // Define columns - Always show all positions
  const columns = [
    { header: monthName, width: dayColWidth },
    { header: "Nap", width: dayNameColWidth },
    { header: "Pénztáros 1", width: positionColWidth },
    { header: "Pénztáros 2", width: positionColWidth },
    { header: "Pénztáros 3", width: positionColWidth },
    { header: "Konyha 1", width: positionColWidth },
    { header: "Konyha 2", width: positionColWidth },
    { header: "Konyha 3", width: positionColWidth },
    { header: "Konyha 4", width: positionColWidth },
  ]

  // Draw table header
  let currentX = margin
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, startY, tableWidth, rowHeight, "F")
  doc.setDrawColor(0)
  doc.setLineWidth(0.3)

  // Draw header cells
  columns.forEach((column) => {
    doc.rect(currentX, startY, column.width, rowHeight)
    doc.setFontSize(8) // Smaller font for headers
    doc.setFont("helvetica", "bold")
    doc.text(column.header, currentX + column.width / 2, startY + rowHeight / 2 + 1, {
      align: "center",
      baseline: "middle",
    })
    currentX += column.width
  })

  // Draw table rows
  for (let day = 1; day <= daysInMonth; day++) {
    const rowY = startY + day * rowHeight
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split("T")[0]
    const dayOfWeek = getDayOfWeek(date)
    const daySchedule = schedule.find((d) => d.date === dateStr)

    // Check if we need to start a new page
    if (rowY + rowHeight > pageHeight - margin) {
      doc.addPage()
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`${monthName} ${year} - Éttermi Személyzeti Beosztás (folytatás)`, pageWidth / 2, margin + 10, {
        align: "center",
      })

      // Reset Y position for the new page
      currentX = margin

      // Redraw header on new page
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, startY, tableWidth, rowHeight, "F")

      columns.forEach((column) => {
        doc.rect(currentX, startY, column.width, rowHeight)
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.text(column.header, currentX + column.width / 2, startY + rowHeight / 2 + 1, {
          align: "center",
          baseline: "middle",
        })
        currentX += column.width
      })
    }

    // Set background color for alternating rows
    if (day % 2 === 0) {
      doc.setFillColor(249, 249, 249)
      doc.rect(margin, rowY, tableWidth, rowHeight, "F")
    }

    // Draw row cells
    currentX = margin

    // Day number
    doc.rect(currentX, rowY, columns[0].width, rowHeight)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(day.toString(), currentX + columns[0].width / 2, rowY + rowHeight / 2 + 1, {
      align: "center",
      baseline: "middle",
    })
    currentX += columns[0].width

    // Day name
    doc.rect(currentX, rowY, columns[1].width, rowHeight)
    doc.setFont("helvetica", "normal")
    doc.text(dayOfWeek, currentX + columns[1].width / 2, rowY + rowHeight / 2 + 1, {
      align: "center",
      baseline: "middle",
    })
    currentX += columns[1].width

    // Get workers for this day
    const cashiers =
      daySchedule?.workers
        .filter((w) => w.position === "cashier")
        .map((w) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        }) || []

    const kitchenStaff =
      daySchedule?.workers
        .filter((w) => w.position === "kitchen")
        .map((w) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        }) || []

    // Determine if we need to use first names only (if any name is too long)
    const useFirstNamesOnly = [...cashiers, ...kitchenStaff].some((name) => name.length > 10 && name.includes(" "))

    // Cashier 1
    doc.rect(currentX, rowY, columns[2].width, rowHeight)
    if (cashiers[0]) {
      const displayName = useFirstNamesOnly ? getFirstName(cashiers[0]) : cashiers[0]
      doc.text(displayName, currentX + columns[2].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[2].width

    // Cashier 2
    doc.rect(currentX, rowY, columns[3].width, rowHeight)
    if (cashiers[1]) {
      const displayName = useFirstNamesOnly ? getFirstName(cashiers[1]) : cashiers[1]
      doc.text(displayName, currentX + columns[3].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[3].width

    // Cashier 3
    doc.rect(currentX, rowY, columns[4].width, rowHeight)
    if (cashiers[2]) {
      const displayName = useFirstNamesOnly ? getFirstName(cashiers[2]) : cashiers[2]
      doc.text(displayName, currentX + columns[4].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[4].width

    // Kitchen 1
    doc.rect(currentX, rowY, columns[5].width, rowHeight)
    if (kitchenStaff[0]) {
      const displayName = useFirstNamesOnly ? getFirstName(kitchenStaff[0]) : kitchenStaff[0]
      doc.text(displayName, currentX + columns[5].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[5].width

    // Kitchen 2
    doc.rect(currentX, rowY, columns[6].width, rowHeight)
    if (kitchenStaff[1]) {
      const displayName = useFirstNamesOnly ? getFirstName(kitchenStaff[1]) : kitchenStaff[1]
      doc.text(displayName, currentX + columns[6].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[6].width

    // Kitchen 3
    doc.rect(currentX, rowY, columns[7].width, rowHeight)
    if (kitchenStaff[2]) {
      const displayName = useFirstNamesOnly ? getFirstName(kitchenStaff[2]) : kitchenStaff[2]
      doc.text(displayName, currentX + columns[7].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
    currentX += columns[7].width

    // Kitchen 4
    doc.rect(currentX, rowY, columns[8].width, rowHeight)
    if (kitchenStaff[3]) {
      const displayName = useFirstNamesOnly ? getFirstName(kitchenStaff[3]) : kitchenStaff[3]
      doc.text(displayName, currentX + columns[8].width / 2, rowY + rowHeight / 2 + 1, {
        align: "center",
        baseline: "middle",
      })
    }
  }

  // Add page number
  const totalPages = Math.ceil((startY + (daysInMonth + 1) * rowHeight) / (pageHeight - margin))
  for (let i = 0; i < totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`${i + 1} / ${totalPages}`, margin, margin, { align: "left" })
  }

  // Save PDF
  doc.save(`ettermi-beosztas-${monthName.toLowerCase()}-${year}.pdf`)
}

// Export to Excel
export const exportToExcel = (currentDate: Date, schedule: DaySchedule[], workers: Worker[]) => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = getMonthName(month)
  const daysInMonth = getDaysInMonth(year, month)

  const data: any[] = []

  // Header row - Always show all positions
  data.push([
    monthName,
    "Nap",
    "Pénztáros 1",
    "Pénztáros 2",
    "Pénztáros 3",
    "Konyha 1",
    "Konyha 2",
    "Konyha 3",
    "Konyha 4",
  ])

  // Data rows
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split("T")[0]
    const dayOfWeek = getDayOfWeek(date)
    const daySchedule = schedule.find((d) => d.date === dateStr)

    const cashiers =
      daySchedule?.workers
        .filter((w) => w.position === "cashier")
        .map((w) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        }) || []

    const kitchenStaff =
      daySchedule?.workers
        .filter((w) => w.position === "kitchen")
        .map((w) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        }) || []

    data.push([
      day,
      dayOfWeek,
      cashiers[0] || "",
      cashiers[1] || "",
      cashiers[2] || "",
      kitchenStaff[0] || "",
      kitchenStaff[1] || "",
      kitchenStaff[2] || "",
      kitchenStaff[3] || "",
    ])
  }

  // Create workbook
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${monthName} ${year}`)

  // Save Excel file
  XLSX.writeFile(wb, `ettermi-beosztas-${monthName.toLowerCase()}-${year}.xlsx`)
}
