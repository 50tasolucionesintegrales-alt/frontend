'use client';

import { updatePassAction } from "@/actions/updatePassAction";
import { useActionState, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function UpdatePassForm() {
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [showPassword3, setShowPassword3] = useState(true);
    const [state, dispatch] = useActionState(updatePassAction, {
        errors: [],
        success: ''
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state])

    const togglePwd = () => setShowPassword((prev) => !prev);
    const togglePwd2 = () => setShowPassword2((prev) => !prev);
    const togglePwd3 = () => setShowPassword3((prev) => !prev);

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualizar Contraseña</h1>
                <p className="text-gray-500">Protege tu cuenta con una contraseña segura</p>
            </div>

            <form
                action={dispatch}
                className="space-y-6"
            >
                {/* Contraseña actual */}
                <div className="relative">
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña actual
                    </label>
                    <input
                        type={showPassword ? 'password' : 'text'}
                        name="current_password"
                        id="current_password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Ingresa tu contraseña actual"
                        required
                    />
                    <button type="button" onClick={togglePwd} className="absolute right-3 top-11 text-gray-500 focus:outline-none">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Nueva contraseña */}
                <div className="relative">
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva contraseña
                    </label>
                    <input
                        type={showPassword2 ? 'password' : 'text'}
                        name="new_password"
                        id="new_password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                    <button type="button" onClick={togglePwd2} className="absolute right-3 top-11 text-gray-500 focus:outline-none">
                        {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                        La contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                    </p>

                </div>

                {/* Confirmar nueva contraseña */}
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar nueva contraseña
                    </label>
                    <input
                        type={showPassword3 ? 'password' : 'text'}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Repite tu nueva contraseña"
                        required
                    />
                    <button type="button" onClick={togglePwd3} className="absolute right-3 top-11 text-gray-500 focus:outline-none">
                        {showPassword3 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Botón de actualizar */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Actualizar contraseña
                    </button>
                </div>
            </form>
        </>
    );
}