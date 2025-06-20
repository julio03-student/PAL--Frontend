"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Layers, Users, Search, GraduationCap, ChevronUp, ChevronDown, LogOut } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-10">

      {showNavbar && (
        <nav className="navbar">
          <nav className="navbar bg-background border-b border-border fixed w-full z-40">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <Link href="/" className="flex ml-2 md:mr-24">
                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-foreground">Portal Educativo</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                  className="bg-red-400 text-white px-2 py-2 rounded-md hover:bg-red-500 transition-colors duration-200 border-2"
                  onClick={() => {
                    fetch('http://localhost:8081/autenticacion/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                    window.location.href = '/';
                  }}>
                    <LogOut className="w-5 h-5 mr-2" />
                  </button>
                  <ThemeSelector />
                </div>
              </div>
            </div>
            <div className="px-3 py-2 border-t border-border lg:px-5 bg-muted">
              <div className="flex items-center space-x-4">
                <Link
                  href="/cursos"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname === "/cursos"
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Book className="w-5 h-5 mr-2" />
                  <span>Cursos</span>
                </Link>
                <Link
                  href="/mis-cursos"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname === "/mis-cursos"
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>Mis Cursos</span>
                </Link>
                <Link
                  href="/cursos/buscar"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname.includes("/cursos/buscar")
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Search className="w-5 h-5 mr-2" />
                  <span>Buscar</span>
                </Link>
                <Link
                  href="/categorias"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname.includes("/categorias")
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Layers className="w-5 h-5 mr-2" />
                  <span>Categorías</span>
                </Link>
                <Link
                  href="/usuarios"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname.includes("/usuarios")
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  <span>Usuarios</span>
                </Link>
                <Link
                  href="/examenes"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${pathname.includes("/examenes")
                    ? "text-primary-foreground bg-primary hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  <span>Examenes</span>
                </Link>
                <Button onClick={() => setShowNavbar(!showNavbar)}>            <ChevronUp className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          </nav>
          <button
            onClick={() => setShowNavbar(false)}
            className="ml-auto px-2 py-1"
            title="Ocultar barra"
          >
            <ChevronUp className="w-5 h-5 mr-2" />
          </button>
        </nav>
      )}
      {!showNavbar && (
        <nav className="navbar">
          <nav className="navbar bg-background border-b border-border fixed w-full z-40">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <Link href="/" className="flex ml-2 md:mr-24">
                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-foreground">Portal Educativo</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeSelector />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNavbar(true)}
              className="m-2 border rounded shadow px-2 py-1"
              title="Mostrar barra"
            >
              <ChevronDown className="w-5 h-5 mr-2" />
            </button>
          </nav>
        </nav>
      )}
    </div>
  )
}
