// app/usuarios/create/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { createUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface OAuth2Info {
    email: string;
    name: string;
    provider: string;
}

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: string[];
    provider?: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function CreateUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: ['STUDENT'], // rol por defecto usando la nomenclatura del backend
    });
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [oauth2Info, setOauth2Info] = useState<OAuth2Info | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isStandalone, setIsStandalone] = useState(false);
 
    useEffect(() => {
        // Intentar obtener información de OAuth2
        fetch('http://localhost:8081/autenticacion/oauth2-info', {
            credentials: 'include',
            method: 'GET',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('No OAuth2 info found');
        })
        .then((data: OAuth2Info) => {
            setOauth2Info(data);
            
            // Pre-llenar el formulario con datos de OAuth2
            setFormData(prev => ({
                ...prev,
                email: data.email,
                username: data.name || data.email.split('@')[0],
                provider: data.provider
            }));
            
            setLoading(false);
        })
        .catch(error => {
            console.log('No hay info OAuth2, permitiendo registro standalone');
            setIsStandalone(true);
            setLoading(false);
        });
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validar username
        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        // Validar password (solo para registro standalone)
        if (isStandalone) {
            if (!formData.password) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            // Validar confirmación de contraseña
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Confirma tu contraseña';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrors({});
        
        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                roles: formData.roles
            };

            const result = await createUser(userData);

            if (result) {
                console.log('Usuario creado exitosamente:', result);
                // Mostrar mensaje de éxito
                alert('¡Cuenta creada exitosamente! Redirigiendo...');
                // Redirigir después de un breve delay
                setTimeout(() => {
                    router.push('/inicio');
                }, 1000);
            } else {
                setErrors({ general: 'Error al crear el usuario. Por favor intenta de nuevo.' });
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setErrors({ general: 'Error de conexión. Por favor verifica tu conexión a internet.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {oauth2Info ? 'Completar Registro' : 'Crear Cuenta'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {oauth2Info ? 
                        'Completa tu perfil para acceder a la plataforma' : 
                        'Únete a nuestra plataforma de aprendizaje'
                    }
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {oauth2Info && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Autenticado con <span className="font-medium">{oauth2Info.provider}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.general && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Nombre de usuario
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.username ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa tu nombre de usuario"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    readOnly={!!oauth2Info}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        oauth2Info ? 'bg-gray-100' : ''
                                    } ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="tu@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {isStandalone && (
                            <>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Contraseña
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.password ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmar contraseña
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Confirma tu contraseña"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                                Tipo de cuenta
                            </label>
                            <div className="mt-1">
                                <select
                                    id="roles"
                                    name="roles"
                                    value={formData.roles[0]}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        roles: [e.target.value]
                                    }))}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="STUDENT">Estudiante</option>
                                    <option value="INSTRUCTOR">Instructor</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    submitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}