import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, Users, Award, ArrowRight, Mail, Github, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PAL
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plataforma de aprendizaje personalizada que transforma la educación. 
              Cursos interactivos, evaluaciones inteligentes y seguimiento del progreso.
            </p>
            
            {/* Login Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg px-8 py-3 text-lg"
                asChild
              >
                <Link href="/autenticacion/google" className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  Iniciar sesión con Gmail
                </Link>
              </Button>
              
              <Button 
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-lg px-8 py-3 text-lg"
                asChild
              >
                <Link href="/autenticacion/github" className="flex items-center gap-3">
                  <Github className="w-5 h-5" />
                  Iniciar sesión con GitHub
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Inicio de sesión seguro y rápido</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir PAL?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre las características que hacen de PAL la mejor plataforma para tu educación
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Cursos Interactivos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 text-base">
                  Accede a una amplia biblioteca de cursos diseñados por expertos con contenido multimedia y ejercicios prácticos.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Evaluaciones Inteligentes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 text-base">
                  Sistema de evaluación avanzado que se adapta a tu nivel y proporciona retroalimentación personalizada.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Comunidad Activa</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 text-base">
                  Conecta con otros estudiantes, comparte conocimientos y aprende de manera colaborativa.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100 text-lg">Estudiantes Activos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-blue-100 text-lg">Cursos Disponibles</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                <div className="text-blue-100 text-lg">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para comenzar tu viaje de aprendizaje?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de estudiantes que ya están transformando su futuro con PAL
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 text-lg"
              asChild
            >
              <Link href="/autenticacion/google" className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                Empezar con Gmail
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-lg px-8 py-3 text-lg"
              asChild
            >
              <Link href="/autenticacion/github" className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                Empezar con GitHub
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-2">Calificado 5/5 por nuestros usuarios</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">PAL</h3>
            <p className="text-gray-400 mb-6">
              Transformando la educación, un estudiante a la vez
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
