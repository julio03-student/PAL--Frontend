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
  const [isOpen, setIsOpen] = React.useState(false)
  const [customColors, setCustomColors] = React.useState({
    primary: "#000000",
    secondary: "#f4f4f5",
    accent: "#f4f4f5",
  })
  const [pendingColors, setPendingColors] = React.useState(customColors);

  // Función para convertir hex a hsl
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Al cargar, lee los colores personalizados si existen
  React.useEffect(() => {
    const saved = localStorage.getItem('customColors');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomColors(parsed);
      setPendingColors(parsed);
      
      // Aplica los colores guardados usando las variables de Tailwind
      const root = document.documentElement;
      root.style.setProperty('--primary', hexToHsl(parsed.primary));
      root.style.setProperty('--secondary', hexToHsl(parsed.secondary));
      root.style.setProperty('--accent', hexToHsl(parsed.accent));
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
      root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
    }
  }, []);

  const handlePendingColorChange = (color: string, value: string) => {
    setPendingColors(prev => ({
      ...prev,
      [color]: value
    }));
  };

  const applyColors = () => {
    setCustomColors(pendingColors);
    localStorage.setItem('customColors', JSON.stringify(pendingColors));
    
    // Aplicar colores usando variables CSS estándar de Tailwind
    const root = document.documentElement;
    
    // Sobrescribir las variables CSS de Tailwind
    const primaryHsl = hexToHsl(pendingColors.primary);
    const secondaryHsl = hexToHsl(pendingColors.secondary);
    const accentHsl = hexToHsl(pendingColors.accent);
    
    // Aplicar a las variables principales de Tailwind
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--accent', accentHsl);
    
    // También actualizar el foreground para mejor contraste
    root.style.setProperty('--primary-foreground', '0 0% 98%');
    root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
    root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
    
    // Cerrar el modal
    setIsOpen(false);
  };

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
          <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  value={pendingColors.primary}
                  onChange={(e) => handlePendingColorChange('primary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={pendingColors.primary}
                  onChange={(e) => handlePendingColorChange('primary', e.target.value)}
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
                  value={pendingColors.secondary}
                  onChange={(e) => handlePendingColorChange('secondary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={pendingColors.secondary}
                  onChange={(e) => handlePendingColorChange('secondary', e.target.value)}
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
                  value={pendingColors.accent}
                  onChange={(e) => handlePendingColorChange('accent', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={pendingColors.accent}
                  onChange={(e) => handlePendingColorChange('accent', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <Button onClick={applyColors} className="mt-2 w-full bg-red-400 text-white hover:bg-red-500">
              Aplicar colores
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 