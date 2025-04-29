"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Menu, Moon, Sun, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const routes = [
    {
      name: "Kezdőlap",
      path: "/",
    },
    {
      name: "Beosztás",
      path: "/schedule",
      icon: CalendarDays,
    },
    {
      name: "Személyzet",
      path: "/staff",
      icon: Users,
    },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block">Éttermi Személyzeti Beosztás</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1 ml-auto">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-muted",
                pathname === route.path ? "text-primary bg-muted" : "text-muted-foreground",
              )}
            >
              {route.icon && <route.icon className="mr-2 h-4 w-4" />}
              {route.name}
            </Link>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2"
            aria-label="Téma váltása"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Téma váltása</span>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex items-center ml-auto md:hidden gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Téma váltása"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Téma váltása</span>
            </Button>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menü megnyitása</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col space-y-2 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-muted",
                    pathname === route.path ? "text-primary bg-muted" : "text-muted-foreground",
                  )}
                >
                  {route.icon && <route.icon className="mr-3 h-5 w-5" />}
                  {route.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
