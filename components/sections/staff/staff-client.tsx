"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

export function StaffClientContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "1", name: "Kovács János", position: "kitchen", phone: "06-30-123-4567", email: "kovacs.janos@example.com" },
    { id: "2", name: "Nagy Éva", position: "cashier", phone: "06-20-987-6543", email: "nagy.eva@example.com" },
    { id: "3", name: "Szabó Péter", position: "both", phone: "06-70-456-7890", email: "szabo.peter@example.com" },
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
        title: "A név megadása kötelező",
        description: "Kérjük, adja meg a dolgozó nevét",
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
      title: "Dolgozó hozzáadva",
      description: "A dolgozó sikeresen hozzáadva",
    })
  }

  const handleDeleteWorker = (id: string) => {
    setWorkers(workers.filter((worker) => worker.id !== id))
    toast({
      title: "Dolgozó törölve",
      description: "A dolgozó sikeresen törölve a rendszerből",
    })
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Keresés a személyzetben..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Badge variant="outline" className="text-xs">
            Összesen: {workers.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Konyha: {workers.filter((w) => w.position === "kitchen" || w.position === "both").length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Pénztáros: {workers.filter((w) => w.position === "cashier" || w.position === "both").length}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Új dolgozó
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új dolgozó hozzáadása</DialogTitle>
            </DialogHeader>
            <AddStaffForm onSubmit={handleAddWorker} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <StaffList workers={filteredWorkers} onDelete={handleDeleteWorker} />
    </div>
  )
}
