import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Layers, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (

    <div>
        <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40 w-9/12 mx-auto ">
        <Link href="/cursos">
          <Card className="hover:text-sky-950 hover:shadow-lg transition-shadow h-60 hover:scale-105 hover:bg-sky-100 hover:border-sky-400 hover:border-2 ease-in-out duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Cursos</CardTitle>
              <Book className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                Gestiona los cursos disponibles, crea nuevos o actualiza los existentes.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/categorias">
          <Card className="hover:text-red-700  hover:shadow-lg transition-shadow h-60 hover:scale-105 hover:bg-red-100 hover:border-red-400 hover:border-2 ease-in-out duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Categorías</CardTitle>
              <Layers className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                Administra las categorías para organizar los cursos por temáticas.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/usuarios">
          <Card className="hover:text-yellow-950  hover:shadow-lg transition-shadow h-60 hover:scale-105 hover:bg-yellow-100 hover:border-yellow-400 hover:border-2 ease-in-out duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Usuarios</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                Gestiona los usuarios, tanto estudiantes como instructores.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
