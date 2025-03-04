"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ToggleTheme() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant={"ghost"} onClick={() => setTheme( theme === "dark" ? "light" : "dark" )}>
        {theme === "dark" ? <Sun /> : <Moon />}

        <span className="sr-only">Témaváltás</span>
    </Button>
  )
};
