"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { StaffList } from "@/components/sections/staff/staff-list"
import { AddStaffForm } from "@/components/sections/staff/add-staff-form"

// Define worker type
type Worker = {
  id: string
  name: string
  position: "kitchen" | "cashier" | "both"
  phone: string
  email: string
}

export function StaffManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "1", name: "John Doe", position: "kitchen", phone: "555-1234", email: "john@example.com" },
    { id: "2", name: "Jane Smith", position: "cashier", phone: "555-5678", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", position: "both", phone: "555-9012", email: "mike@example.com" },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone.includes(searchTerm),
  )

  const handleAddWorker = (newWorker: Omit<Worker, "id">) => {
    if (!newWorker.name) {
      toast({
        title: "Worker name is required",
        description: "Please enter a name for the worker",
        variant: "destructive",
      })
      return
    }

    const worker: Worker = {
      ...newWorker,
      id: Date.now().toString(),
    }

    setWorkers([...workers, worker])
    setDialogOpen(false)

    toast({
      title: "Worker added",
      description: "Worker has been added successfully",
    })
  }

  const handleDeleteWorker = (id: string) => {
    setWorkers(workers.filter((worker) => worker.id !== id))
    toast({
      title: "Worker removed",
      description: "Worker has been removed from the system",
    })
  }

  return (
    <>
      <PageHeader title="Staff Management" description="Add, edit, and manage your restaurant staff" icon={Users}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
            </DialogHeader>
            <AddStaffForm onSubmit={handleAddWorker} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Badge variant="outline" className="text-xs">
              Total: {workers.length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Kitchen: {workers.filter((w) => w.position === "kitchen" || w.position === "both").length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Cashier: {workers.filter((w) => w.position === "cashier" || w.position === "both").length}
            </Badge>
          </div>
        </div>

        <StaffList workers={filteredWorkers} onDelete={handleDeleteWorker} />
      </div>
    </>
  )
}
