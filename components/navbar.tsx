"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Layers, Users, Home, Settings, Search, GraduationCap } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-background border-b border-border fixed w-full z-40">
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
      <div className="px-3 py-2 border-t border-border lg:px-5 bg-muted">
        <div className="flex items-center space-x-4">
          <Link
            href="/cursos"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              pathname === "/cursos"
                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Book className="w-5 h-5 mr-2" />
            <span>Cursos</span>
          </Link>
          <Link
            href="/mis-cursos"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              pathname === "/mis-cursos"
                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            <span>Mis Cursos</span>
          </Link>
          <Link
            href="/cursos/buscar"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              pathname.includes("/cursos/buscar")
                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Search className="w-5 h-5 mr-2" />
            <span>Buscar</span>
          </Link>
          <Link
            href="/categorias"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              pathname.includes("/categorias")
                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Layers className="w-5 h-5 mr-2" />
            <span>Categorías</span>
          </Link>
          <Link
            href="/usuarios"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              pathname.includes("/usuarios")
                ? "text-primary-foreground bg-primary hover:bg-primary/90"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            <span>Usuarios</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
