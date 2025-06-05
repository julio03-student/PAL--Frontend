# Implementación de Autorización para Exámenes

## 📋 Resumen

Se ha implementado un sistema completo de autorización para los endpoints `/api/examenes/*` que garantiza que:

- **Estudiantes** solo puedan ver exámenes de cursos en los que están inscritos
- **Instructores** solo puedan ver y gestionar exámenes de cursos que dictan
- **Administradores** tengan acceso completo a todos los exámenes

## 🛠️ Componentes Implementados

### 1. **Proveedor de Autenticación** (`components/auth-provider.tsx`)
- Context provider para manejar el estado de autenticación globalmente
- Funciones: `login()`, `logout()`, `hasRole()`, `isAuthenticated`
- Persistencia en `localStorage` del usuario y token
- Hook `useAuth()` para acceder al contexto desde cualquier componente

### 2. **Funciones de API Autorizadas** (`lib/api.ts`)

#### Funciones Principales:
- `getAuthorizedExams()` - Obtiene exámenes según el rol del usuario
- `createExam()` - Crear exámenes (solo instructores/admins)
- `deleteExam()` - Eliminar exámenes (solo instructores/admins)

#### Endpoints Utilizados:
```typescript
// Para estudiantes
GET /api/exams/student/{userId}

// Para instructores  
GET /api/exams/instructor/{instructorId}

// Para administradores
GET /api/exams/all

// Crear/eliminar (instructores y admins)
POST /api/exams/create
DELETE /api/exams/delete/{id}
```

### 3. **Página de Exámenes Actualizada** (`app/examenes/page.tsx`)

#### Características de Autorización:
- **Verificación de autenticación** antes de mostrar contenido
- **Botones condicionales** según el rol del usuario
- **Mensajes personalizados** según el rol y estado
- **Manejo de errores** 403 (Prohibido) y 401 (No autorizado)

#### Estados de la UI:
- **No autenticado**: Mensaje de login requerido
- **Estudiante sin exámenes**: Mensaje para inscribirse en cursos
- **Instructor sin exámenes**: Mensaje para crear primer examen
- **Con exámenes**: Lista filtrada según permisos

## 🔐 Matriz de Permisos

| Rol | Ver Exámenes | Crear Exámenes | Eliminar Exámenes | Filtro Aplicado |
|-----|--------------|----------------|-------------------|-----------------|
| **STUDENT** | ✅ | ❌ | ❌ | Solo cursos inscritos |
| **INSTRUCTOR** | ✅ | ✅ | ✅ | Solo cursos que dicta |
| **ADMIN** | ✅ | ✅ | ✅ | Todos los exámenes |

## 🔄 Flujo de Autorización

```mermaid
graph TD
    A[Usuario accede a /examenes] --> B{¿Autenticado?}
    B -->|No| C[Mostrar mensaje de login]
    B -->|Sí| D{¿Qué rol tiene?}
    
    D -->|STUDENT| E[GET /api/exams/student/{id}]
    D -->|INSTRUCTOR| F[GET /api/exams/instructor/{id}]
    D -->|ADMIN| G[GET /api/exams/all]
    
    E --> H[Mostrar exámenes de cursos inscritos]
    F --> I[Mostrar exámenes de cursos dictados]
    G --> J[Mostrar todos los exámenes]
    
    I --> K{¿Quiere crear/eliminar?}
    J --> K
    K -->|Sí| L[Verificar permisos en backend]
    L -->|403| M[Mostrar error de permisos]
    L -->|200| N[Ejecutar acción]
```

## 🚨 Manejo de Errores

### Códigos de Respuesta Manejados:
- **401**: Sesión expirada → Solicitar nuevo login
- **403**: Sin permisos → Mensaje de acceso denegado
- **404**: Recurso no encontrado → Mensaje de error específico
- **400**: Datos inválidos → Mostrar errores de validación

### Mensajes de Usuario:
```typescript
// Ejemplos de mensajes mostrados
"No tienes permisos para crear exámenes"
"Sesión expirada. Por favor inicia sesión nuevamente"
"No tienes exámenes disponibles - Inscríbete en cursos"
"No has creado exámenes aún - Crea tu primer examen"
```

## 🔧 Configuración del Backend Requerida

Para que esta implementación funcione completamente, el backend debe implementar:

### Endpoints Específicos:
```java
@GetMapping("/api/exams/student/{userId}")
@PreAuthorize("hasRole('STUDENT') and #userId == authentication.principal.id")
public ResponseEntity<?> getExamsForStudent(@PathVariable Long userId)

@GetMapping("/api/exams/instructor/{instructorId}")  
@PreAuthorize("hasRole('INSTRUCTOR') and #instructorId == authentication.principal.id")
public ResponseEntity<?> getExamsForInstructor(@PathVariable Long instructorId)

@PostMapping("/api/exams/create")
@PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
public ResponseEntity<?> createExam(@RequestBody ExamDTO examData)

@DeleteMapping("/api/exams/delete/{id}")
@PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
public ResponseEntity<?> deleteExam(@PathVariable Long id)
```

### Verificaciones de Relación:
- **Estudiantes**: Verificar inscripción en el curso del examen
- **Instructores**: Verificar que es instructor del curso del examen
- **Logging**: Registrar intentos de acceso no autorizado

## ✅ Beneficios de la Implementación

1. **Seguridad**: Control granular de acceso basado en roles
2. **UX Mejorada**: Mensajes claros y acciones apropiadas por rol
3. **Escalabilidad**: Sistema fácil de extender a otros recursos
4. **Mantenibilidad**: Código organizado con separación de responsabilidades
5. **Debugging**: Manejo robusto de errores y logging

## 🚀 Próximos Pasos

1. **Implementar el backend** con los endpoints y validaciones mencionadas
2. **Agregar logging** de intentos de acceso no autorizado
3. **Implementar rate limiting** para prevenir ataques
4. **Extender autorización** a otros recursos (cursos, contenido, etc.)
5. **Agregar tests** unitarios y de integración 