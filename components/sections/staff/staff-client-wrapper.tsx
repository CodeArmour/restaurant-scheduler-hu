"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the client component with ssr: false
const StaffClientContent = dynamic(
  () => import("@/components/sections/staff/staff-client").then((mod) => mod.StaffClientContent),
  {
    ssr: false,
    loading: () => <StaffPageSkeleton />,
  },
)

export function StaffClientWrapper() {
  return (
    <Suspense fallback={<StaffPageSkeleton />}>
      <StaffClientContent />
    </Suspense>
  )
}

function StaffPageSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="h-10 bg-muted/40 rounded animate-pulse"></div>
      <div className="border rounded-lg p-6">
        <div className="h-8 w-1/3 bg-muted/40 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-12 bg-muted/40 rounded animate-pulse"></div>
          <div className="h-12 bg-muted/40 rounded animate-pulse"></div>
          <div className="h-12 bg-muted/40 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
