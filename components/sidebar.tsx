"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Layers, Users, Home, Settings, Search, GraduationCap, File } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-30 w-64 h-screen pt-28 transition-transform -translate-x-full bg-background border-r border-border sm:translate-x-0">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-background">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href="/"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname === "/" ? "bg-accent" : ""
              }`}
            >
              <Home className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Inicio</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cursos"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname === "/cursos" ? "bg-accent" : ""
              }`}
            >
              <Book className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Cursos</span>
            </Link>
          </li>
          <li>
            <Link
              href="/mis-cursos"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname === "/mis-cursos" ? "bg-accent" : ""
              }`}
            >
              <GraduationCap className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Mis Cursos</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cursos/buscar"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname.includes("/cursos/buscar") ? "bg-accent" : ""
              }`}
            >
              <Search className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Buscar Cursos</span>
            </Link>
          </li>
          <li>
            <Link
              href="/categorias"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname.includes("/categorias") ? "bg-accent" : ""
              }`}
            >
              <Layers className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Categorías</span>
            </Link>
          </li>
          <li>
            <Link
              href="/usuarios"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname.includes("/usuarios") ? "bg-accent" : ""
              }`}
            >
              <Users className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Usuarios</span>
            </Link>
          </li>
          <li>
            <Link
              href="/configuracion"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname.includes("/configuracion") ? "bg-accent" : ""
              }`}
            >
              <Settings className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Configuración</span>
            </Link>
          </li>
          <li>
            <Link
              href="/examenes"
              className={`flex items-center p-2 text-foreground rounded-lg hover:bg-accent ${
                pathname.includes("/examenes") ? "bg-accent" : ""
              }`}
            >
              <File className="w-6 h-6 text-muted-foreground transition duration-75 group-hover:text-foreground" />
              <span className="ml-3">Examenes</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
