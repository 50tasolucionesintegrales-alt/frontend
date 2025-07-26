'use client';

import { useState, useActionState, useEffect, startTransition } from 'react';
import { updateProfileAction } from '@/actions/updateProfileAction';
import { toast } from 'react-toastify';
import { useAuthClient } from '@/src/context/authClientContext';
import { useRouter } from 'next/navigation';

export default function ProfileForm() {
    const { user } = useAuthClient();
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        password: '',
        confirmPassword: '',
        isTeacher: user?.rol === 'docente',
    });

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [state, dispatch, pending] = useActionState(updateProfileAction, {
        errors: [],
        success: '',
    });

    const router = useRouter();

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((err) => {
                toast.error(err);
            });
        }

        if (state.success) {
            toast.success(state.success, {
                onClose: () => {
                    // Redirigir al perfil después de actualizar
                    router.refresh()    
                },
            });
        }
    }, [state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newFormData = new FormData();

        // Compara y agrega solo si cambió el nombre
        if (formData.nombre !== user?.nombre) {
            newFormData.append('nombre', formData.nombre);
        }

        // Por ejemplo para password (si quieres permitir cambiarla)
        if (formData.password && formData.password === formData.confirmPassword) {
            newFormData.append('password', formData.password);
        }

        // Solo si cambiaste el avatar
        if (avatarFile) {
            newFormData.append('miniatura', avatarFile);
        }

        // Para el checkbox (si quieres enviar siempre el estado actual)
        newFormData.append('solicitoDocente', formData.isTeacher ? 'true' : 'false');

        // Llama a la acción con solo los campos que quieres enviar
        startTransition(() => {
            dispatch(newFormData);
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            {/* Encabezado */}
            <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Configuración de Perfil</h2>
                <p className="text-gray-500 mt-1">
                    Actualiza tu información personal y preferencias de cuenta
                </p>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Sección Avatar */}
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <div className="relative w-40 h-40 mb-4">
                                <img
                                    src={avatarPreview || '/default-avatar.png'}
                                    alt="Miniatura"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <label
                                    htmlFor="miniatura"
                                    className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-md"
                                    title="Cambiar foto"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input id="miniatura" name='miniatura' type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Formatos soportados: JPG, PNG (Máx. 5MB)
                            </p>
                        </div>

                        {/* Campos del formulario */}
                        <div className="flex-1 space-y-6 w-full">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
                                    placeholder="Ej: María González"
                                />
                            </div>
                            {/* Mostrar correo debajo del nombre */}
                            {user?.email && (
                                <p className="mt-2 text-sm text-gray-500">
                                    <strong className="text-gray-700">Correo:</strong> {user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Checkbox docente */}
                    {user?.rol === 'estudiante' && !user.solicitoDocente ? (
                        <div className="flex items-start pt-4">
                            <div className="flex items-center h-5 mt-0.5">
                                <input
                                    name="solicitoDocente"
                                    type="checkbox"
                                    checked={formData.isTeacher || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="solicitoDocente" className="block text-sm font-medium text-gray-700">
                                    Solicitar ser docente
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    Marca esta casilla si deseas aplicar para convertirte en docente.
                                    Nuestro equipo revisará tu solicitud y te notificará el resultado.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-green-600">
                            Tu solicitud para ser docente está en revisión.
                        </p>
                    )}

                    {/* Botón de enviar */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                        >
                            {pending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando cambios...
                                </span>
                            ) : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}