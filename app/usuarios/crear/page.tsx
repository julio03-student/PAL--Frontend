// app/usuarios/create/page.tsx
'use client'
import { useEffect, useState } from 'react';

interface OAuth2Info {
    email: string;
    name: string;
    provider: string;
}

interface FormData {
    username: string;
    email: string;
    password: string;
    roles: string[];
    provider?: string;
}

export default function CreateUserPage() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        roles: ['estudiante'], // rol por defecto
    });
    const [loading, setLoading] = useState(true);
    const [oauth2Info, setOauth2Info] = useState<OAuth2Info | null>(null);
 
    useEffect(() => {
        // Obtener información de OAuth2
        fetch('http://localhost:8081/autenticacion/oauth2-info', {
            credentials: 'include', // Importante para incluir cookies de sesión
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
                username: data.name || data.email.split('@')[0], // usar name o parte del email
                provider: data.provider
            }));
            
            setLoading(false);
        })
        .catch(error => {
            console.error('Error obteniendo info OAuth2:', error);
            // Si no hay info OAuth2, redirigir a login
            window.location.href = '/login';
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8081/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Usuario creado:', result);
                // Redirigir al dashboard o página de inicio
                window.location.href = '/inicio';
            } else {
                const error = await response.json();
                console.error('Error creando usuario:', error);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Cargando información...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6">Completar Registro</h1>
            
            {oauth2Info && (
                <div className="mb-4 p-4 bg-blue-50 rounded">
                    <p className="text-sm text-blue-600">
                        Autenticado con {oauth2Info.provider}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        readOnly // Email viene de OAuth2, no se puede cambiar
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>

                <div>
                    <label htmlFor="roles" className="block text-sm font-medium mb-1">
                        Rol
                    </label>
                    <select
                        id="roles"
                        name="roles"
                        value={formData.roles[0]}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            roles: [e.target.value]
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="estudiante">Estudiante</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Crear Cuenta
                </button>
            </form>
        </div>
    );
}