"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  MapPin, 
  User, 
  Shield,
  Edit,
  MoreHorizontal,
  Settings
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  createdAt?: string;
  lastLogin?: string;
  bio?: string;
  location?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/users/${id}` 
        );

        if (!response.ok) throw new Error("Error al obtener el usuario");

        const result = await response.json();

        if (result.data) {
          if (Array.isArray(result.data) && result.data.length > 0) {
            setUser(result.data[0]);
          } else if (!Array.isArray(result.data)) {
            setUser(result.data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(true);
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/usuarios">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
        </div>
        <Card className="bg-red-50 border-2 border-red-200">
          <CardContent className="pt-6">
            <p className="text-lg text-red-700">
              {error ? "Error al cargar el usuario" : "Usuario no encontrado"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'instructor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'estudiante':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return <Shield className="h-3 w-3 mr-1" />;
      case 'instructor':
        return <User className="h-3 w-3 mr-1" />;
      case 'estudiante':
        return <User className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/usuarios">
                <Button variant="ghost" size="sm" className="mr-3">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-sm text-gray-500">Usuario #{user.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Banner y Avatar */}
        <div className="relative">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-b-lg"></div>
          
          {/* Avatar */}
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-14 w-14 text-white" />
              </div>
            </div>
          </div>

          {/* Botón Editar Perfil */}
          <div className="absolute bottom-4 right-6">
            <Button variant="outline" className="bg-white">
              <Edit className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
          </div>
        </div>

        {/* Información del perfil */}
        <div className="mt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información básica */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Nombre y roles */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.roles && user.roles.map((role) => (
                          <Badge 
                            key={role.id} 
                            variant="outline" 
                            className={`${getRoleColor(role.name)} flex items-center`}
                          >
                            {getRoleIcon(role.name)}
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Bio (placeholder) */}
                    <div>
                      <p className="text-gray-600 text-lg">
                        {user.bio || "Usuario de la plataforma educativa PAL. Explorando el mundo del aprendizaje digital."}
                      </p>
                    </div>

                    {/* Información de contacto */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Se unió el septiembre de 2019</span>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex gap-6 pt-2">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {user.followingCount || 42}
                        </div>
                        <div className="text-sm text-gray-500">Siguiendo</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {user.followersCount || 128}
                        </div>
                        <div className="text-sm text-gray-500">Seguidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {user.postsCount || 15}
                        </div>
                        <div className="text-sm text-gray-500">Publicaciones</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actividad reciente */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Completó el examen de JavaScript</p>
                          <p className="text-xs text-gray-500">Hace 2 horas</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Aprobado
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Se inscribió en React Avanzado</p>
                          <p className="text-xs text-gray-500">Hace 1 día</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Nuevo
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Actualizó su perfil</p>
                          <p className="text-xs text-gray-500">Hace 3 días</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Información del sistema */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID de Usuario:</span>
                      <span className="text-sm font-medium text-gray-900">#{user.id}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estado:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Último acceso:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {user.lastLogin || "Hace 2 horas"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Verificado:</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        ✓ Verificado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logros */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">🏆</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Primer Examen</p>
                        <p className="text-xs text-gray-500">Completó su primer examen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <div className="text-2xl">📚</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estudiante Activo</p>
                        <p className="text-xs text-gray-500">7 días consecutivos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <div className="text-2xl">⭐</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Puntuación Perfecta</p>
                        <p className="text-xs text-gray-500">100% en un examen</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 