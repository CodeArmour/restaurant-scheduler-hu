"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChefHat, CreditCard, Trash, Users } from "lucide-react"

type Worker = {
  id: string
  name: string
  position: "kitchen" | "cashier" | "both"
  phone: string
  email: string
}

interface StaffListProps {
  workers: Worker[]
  onDelete: (id: string) => void
}

export function StaffList({ workers, onDelete }: StaffListProps) {
  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle>Személyzeti lista</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Név</TableHead>
                <TableHead>Pozíció</TableHead>
                <TableHead className="hidden md:table-cell">Telefon</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="w-[80px]">Műveletek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length > 0 ? (
                workers.map((worker) => (
                  <TableRow key={worker.id} className="group">
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {worker.position === "kitchen" || worker.position === "both" ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          >
                            <ChefHat className="mr-1 h-3 w-3" />
                            Konyha
                          </Badge>
                        ) : null}
                        {worker.position === "cashier" || worker.position === "both" ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            Pénztáros
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{worker.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{worker.email}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(worker.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Törlés</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <p>Nincsenek dolgozók</p>
                      <p className="text-sm text-muted-foreground">Adjon hozzá új dolgozót a kezdéshez</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
