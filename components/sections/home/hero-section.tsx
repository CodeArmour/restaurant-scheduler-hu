"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-10 pb-20">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Éttermi Személyzeti Beosztás
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Hozza létre és kezelje éttermi személyzetének beosztását egyszerűen. Rendeljen konyhai és pénztáros
                pozíciókat, exportálja PDF vagy Excel formátumba, és tartsa rendben csapatát.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/schedule">
                <Button size="lg" className="gap-1">
                  <CalendarDays className="h-5 w-5" />
                  <span>Beosztás megtekintése</span>
                </Button>
              </Link>
              <Link href="/staff">
                <Button size="lg" variant="outline">
                  Személyzet kezelése
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full max-w-[450px] rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-muted p-1 shadow-xl">
              <div className="absolute inset-0 rounded-lg border border-border/50" />
              <div className="h-full w-full overflow-hidden rounded-lg bg-card p-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="text-lg font-semibold">Április 2025</div>
                  <div className="flex gap-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">←</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 pt-4">
                  {["Vas", "Hét", "Ked", "Sze", "Csü", "Pén", "Szo"].map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i - 3
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-md text-xs flex items-center justify-center ${
                          day > 0 && day <= 30 ? "bg-card hover:bg-muted cursor-pointer" : "opacity-30"
                        } ${[8, 15, 22].includes(day) ? "bg-primary/10" : ""}`}
                      >
                        {day > 0 && day <= 30 ? day : ""}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
