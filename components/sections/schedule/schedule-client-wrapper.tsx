"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the client component with ssr: false
const ScheduleClientContent = dynamic(
  () => import("@/components/sections/schedule/schedule-client").then((mod) => mod.ScheduleClientContent),
  {
    ssr: false,
    loading: () => <SchedulePageSkeleton />,
  },
)

export function ScheduleClientWrapper() {
  return (
    <Suspense fallback={<SchedulePageSkeleton />}>
      <ScheduleClientContent />
    </Suspense>
  )
}

function SchedulePageSkeleton() {
  return (
    <div className="mt-6">
      <div className="border rounded-lg overflow-hidden">
        <div className="h-16 bg-muted/50 p-4 flex justify-between items-center">
          <div className="h-8 w-40 bg-muted/40 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-muted/40 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-muted/40 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-px mb-2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-8 bg-muted/40 rounded animate-pulse"></div>
              ))}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {Array(35)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-16 sm:h-24 bg-muted/30 rounded animate-pulse"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
