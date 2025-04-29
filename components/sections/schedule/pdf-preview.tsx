"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { exportToPdf } from "@/lib/export-utils"

interface PdfPreviewProps {
  currentDate: Date
  schedule: any[]
  workers: any[]
}

export function PdfPreview({ currentDate, schedule, workers }: PdfPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("")

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

  // Format date
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Get schedule for a specific day
  const getDaySchedule = (date: string) => {
    return schedule.find((day) => day.date === date)?.workers || []
  }

  // Get worker by ID
  const getWorker = (workerId: string) => {
    return workers.find((w) => w.id === workerId)
  }

  // Get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0]
  }

  // Generate preview HTML
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = getMonthName(month)
    const daysInMonth = getDaysInMonth(year, month)

    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 100%; margin: 0 auto; padding: 20px;">
        <div style="text-align: left; margin-bottom: 5px; font-size: 12px; color: #666;">1 / 1</div>
        <h2 style="text-align: center; margin-bottom: 15px; font-size: 18px;">${monthName} ${year} - Éttermi Személyzeti Beosztás</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 12px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 6px; width: 30px; text-align: center; font-weight: bold;">${monthName}</th>
              <th style="border: 1px solid #000; padding: 6px; width: 80px; text-align: center; font-weight: bold;">Nap</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Pénztáros 1</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Pénztáros 2</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Pénztáros 3</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Konyha 1</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Konyha 2</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Konyha 3</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Konyha 4</th>
            </tr>
          </thead>
          <tbody>
    `

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)
      const dayOfWeek = getDayOfWeek(date)
      const daySchedule = getDaySchedule(dateStr)

      const cashiers = daySchedule
        .filter((w: any) => w.position === "cashier")
        .map((w: any) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        })

      const kitchenStaff = daySchedule
        .filter((w: any) => w.position === "kitchen")
        .map((w: any) => {
          const worker = workers.find((worker) => worker.id === w.workerId)
          return worker?.name || ""
        })

      // Determine if we need to use first names only
      const useFirstNamesOnly = [...cashiers, ...kitchenStaff].some((name) => name.length > 10 && name.includes(" "))

      // Add alternating row background
      const rowBg = day % 2 === 0 ? "#f9f9f9" : "#ffffff"

      html += `
        <tr style="background-color: ${rowBg};">
          <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${day}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${dayOfWeek}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${cashiers[0] ? (useFirstNamesOnly ? getFirstName(cashiers[0]) : cashiers[0]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${cashiers[1] ? (useFirstNamesOnly ? getFirstName(cashiers[1]) : cashiers[1]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${cashiers[2] ? (useFirstNamesOnly ? getFirstName(cashiers[2]) : cashiers[2]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${kitchenStaff[0] ? (useFirstNamesOnly ? getFirstName(kitchenStaff[0]) : kitchenStaff[0]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${kitchenStaff[1] ? (useFirstNamesOnly ? getFirstName(kitchenStaff[1]) : kitchenStaff[1]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${kitchenStaff[2] ? (useFirstNamesOnly ? getFirstName(kitchenStaff[2]) : kitchenStaff[2]) : ""}</td>
          <td style="border: 1px solid #000; padding: 6px; text-align: center;">${kitchenStaff[3] ? (useFirstNamesOnly ? getFirstName(kitchenStaff[3]) : kitchenStaff[3]) : ""}</td>
        </tr>
      `
    }

    html += `
          </tbody>
        </table>
      </div>
    `

    setPreviewHtml(html)
  }, [currentDate, schedule, workers])

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Éttermi Személyzeti Beosztás</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              body { 
                margin: 0; 
                padding: 10mm; 
                font-family: Arial, sans-serif;
                font-size: 12px;
              }
              table { 
                width: 100%;
                border-collapse: collapse;
                page-break-inside: auto;
              }
              tr { 
                page-break-inside: avoid; 
                page-break-after: auto;
              }
              th {
                background-color: #f2f2f2;
                border: 1px solid #000;
                padding: 6px;
                text-align: center;
                font-size: 12px;
                font-weight: bold;
              }
              td {
                border: 1px solid #000;
                padding: 6px;
                text-align: center;
                font-size: 12px;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              h2 {
                text-align: center;
                margin-bottom: 15px;
              }
            </style>
          </head>
          <body>
            ${previewHtml}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

  // Handle download
  const handleDownload = () => {
    exportToPdf(currentDate, schedule, workers)
  }

  return (
    <Card className="mt-6 border-border/40">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Beosztás előnézet (A4 formátum)</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Nyomtatás
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              PDF letöltése
            </Button>
          </div>
        </div>

        <div className="border rounded-md overflow-auto max-h-[600px] bg-white dark:bg-gray-100 dark:text-gray-900">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} className="min-w-[800px]" />
        </div>
      </CardContent>
    </Card>
  )
}
