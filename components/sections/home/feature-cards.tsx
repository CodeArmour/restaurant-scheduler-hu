"use client"

import Link from "next/link"
import { CalendarDays, FileSpreadsheet, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function FeatureCards() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group overflow-hidden border-border/40 transition-all hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <CalendarDays className="h-5 w-5" />
              </div>
              <span>Havi beosztás</span>
            </CardTitle>
            <CardDescription>Havi személyzeti beosztások létrehozása és kezelése</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">
              Könnyen rendeljen konyhai és pénztáros pozíciókat a hónap minden napjára.
            </p>
            <Link href="/schedule">
              <Button className="w-full">Beosztás megtekintése</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-border/40 transition-all hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <span>Személyzet kezelése</span>
            </CardTitle>
            <CardDescription>Éttermi személyzet regisztrálása és kezelése</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">Új dolgozók hozzáadása és a meglévők kezelése.</p>
            <Link href="/staff">
              <Button className="w-full">Személyzet kezelése</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-border/40 transition-all hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <span>Exportálási lehetőségek</span>
            </CardTitle>
            <CardDescription>Beosztások letöltése különböző formátumokban</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">
              Exportálja beosztását PDF vagy Excel formátumban a könnyű terjesztés érdekében.
            </p>
            <div className="flex gap-2">
              <Link href="/schedule?export=pdf" className="flex-1">
                <Button variant="outline" className="w-full">
                  PDF
                </Button>
              </Link>
              <Link href="/schedule?export=excel" className="flex-1">
                <Button variant="outline" className="w-full">
                  Excel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
