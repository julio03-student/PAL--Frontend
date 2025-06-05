"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: string) => boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario y token del localStorage al iniciar
    const savedUser = localStorage.getItem('currentUser')
    const savedToken = localStorage.getItem('authToken')

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setToken(savedToken)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('currentUser')
        localStorage.removeItem('authToken')
      }
    }
    
    setLoading(false)
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('authToken', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    // Opcional: redirigir a login
    window.location.href = '/login'
  }

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
    token,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 