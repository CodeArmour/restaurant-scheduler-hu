import { PageHeader } from "@/components/layout/page-header"
import { Users } from "lucide-react"
import { StaffClientWrapper } from "@/components/sections/staff/staff-client-wrapper"

export default function StaffPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6">
      <PageHeader
        title="Személyzet kezelése"
        description="Személyzet hozzáadása, szerkesztése és kezelése"
        icon={Users}
      />
      <StaffClientWrapper />
    </div>
  )
}
