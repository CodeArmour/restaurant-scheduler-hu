"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, CreditCard, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Worker = {
  id: string
  name: string
  position: "kitchen" | "cashier" | "both"
}

interface DayScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDay: Date | null
  mockWorkers: Worker[]
  getDaySchedule: (date: string) => any[]
  countWorkersByPosition: (date: string, position: "kitchen" | "cashier") => number
  formatDate: (date: Date) => string
  handleRemoveWorker: (date: string, workerId: string) => void
  handleAddWorker: (workerId: string) => void
  filteredWorkers: Worker[]
  selectedPosition: "kitchen" | "cashier"
  setSelectedPosition: (position: "kitchen" | "cashier") => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function DayScheduleDialog({
  open,
  onOpenChange,
  selectedDay,
  mockWorkers,
  getDaySchedule,
  countWorkersByPosition,
  formatDate,
  handleRemoveWorker,
  handleAddWorker,
  filteredWorkers,
  selectedPosition,
  setSelectedPosition,
  searchTerm,
  setSearchTerm,
}: DayScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedDay ? `Beosztás: ${selectedDay.toLocaleDateString()}` : "Beosztás"}
          </DialogTitle>
        </DialogHeader>

        {selectedDay && (
          <Tabs defaultValue="current" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Aktuális beosztás</TabsTrigger>
              <TabsTrigger value="add">Dolgozók hozzáadása</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-medium">
                        Konyhai személyzet ({countWorkersByPosition(formatDate(selectedDay), "kitchen")}/4)
                      </h3>
                    </div>
                    <div className="space-y-2 rounded-lg border p-1">
                      {getDaySchedule(formatDate(selectedDay))
                        .filter((entry) => entry.position === "kitchen")
                        .map((entry) => {
                          const worker = mockWorkers.find((w) => w.id === entry.workerId)
                          return worker ? (
                            <div
                              key={entry.workerId}
                              className="flex items-center justify-between p-2 rounded-md bg-card hover:bg-muted/50 transition-colors"
                            >
                              <span>{worker.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveWorker(formatDate(selectedDay), entry.workerId)}
                                className="h-8 text-xs"
                              >
                                Eltávolítás
                              </Button>
                            </div>
                          ) : null
                        })}
                      {countWorkersByPosition(formatDate(selectedDay), "kitchen") === 0 && (
                        <div className="flex items-center justify-center h-20 text-muted-foreground">
                          Nincs konyhai személyzet beosztva
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium">
                        Pénztárosok ({countWorkersByPosition(formatDate(selectedDay), "cashier")}/3)
                      </h3>
                    </div>
                    <div className="space-y-2 rounded-lg border p-1">
                      {getDaySchedule(formatDate(selectedDay))
                        .filter((entry) => entry.position === "cashier")
                        .map((entry) => {
                          const worker = mockWorkers.find((w) => w.id === entry.workerId)
                          return worker ? (
                            <div
                              key={entry.workerId}
                              className="flex items-center justify-between p-2 rounded-md bg-card hover:bg-muted/50 transition-colors"
                            >
                              <span>{worker.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveWorker(formatDate(selectedDay), entry.workerId)}
                                className="h-8 text-xs"
                              >
                                Eltávolítás
                              </Button>
                            </div>
                          ) : null
                        })}
                      {countWorkersByPosition(formatDate(selectedDay), "cashier") === 0 && (
                        <div className="flex items-center justify-center h-20 text-muted-foreground">
                          Nincs pénztáros beosztva
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="add" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="position">Pozíció</Label>
                    <Select
                      value={selectedPosition}
                      onValueChange={(value) => setSelectedPosition(value as "kitchen" | "cashier")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válasszon pozíciót" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Konyha</SelectItem>
                        <SelectItem value="cashier">Pénztáros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="search">Dolgozók keresése</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Keresés név szerint"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="p-3 bg-muted font-medium flex items-center justify-between">
                    <span>Elérhető dolgozók</span>
                    <Badge variant="outline">{filteredWorkers.length} dolgozó</Badge>
                  </div>
                  <div className="divide-y max-h-[300px] overflow-y-auto">
                    {filteredWorkers.length > 0 ? (
                      filteredWorkers.map((worker) => (
                        <div
                          key={worker.id}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{worker.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              {worker.position === "kitchen" || worker.position === "both" ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                >
                                  <ChefHat className="mr-1 h-3 w-3" />
                                  Konyha
                                </Badge>
                              ) : null}
                              {worker.position === "cashier" || worker.position === "both" ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                >
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  Pénztáros
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleAddWorker(worker.id)}>
                            Hozzáadás
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Nincs elérhető dolgozó ehhez a pozícióhoz
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
