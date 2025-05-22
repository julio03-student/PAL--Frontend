"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()
  const [customColors, setCustomColors] = React.useState({
    primary: "#000000",
    secondary: "#f4f4f5",
    accent: "#f4f4f5",
  })

  const handleColorChange = (color: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [color]: value
    }))

    // Aplicar el color personalizado
    const root = document.documentElement
    if (color === 'primary') {
      root.style.setProperty('--primary', value)
    } else if (color === 'secondary') {
      root.style.setProperty('--secondary', value)
    } else if (color === 'accent') {
      root.style.setProperty('--accent', value)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Oscuro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Personalizar colores</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personalizar Colores</DialogTitle>
            <DialogDescription>
              Personaliza los colores de la aplicación según tus preferencias.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="primary">Color Primario</Label>
              <div className="flex gap-2">
                <Input
                  id="primary"
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secondary">Color Secundario</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary"
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accent">Color de Acento</Label>
              <div className="flex gap-2">
                <Input
                  id="accent"
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={customColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 