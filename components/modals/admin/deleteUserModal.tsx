'use client';
import { Dialog } from '@headlessui/react';
import { useActionState, useEffect } from 'react';
import deleteUserAction from '@/actions/admin/deleteUserAction';
import { toast } from 'react-toastify';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeleteUserModal({
    userId,
    open,
    onClose,
    onEliminado,
}: {
    userId: number;
    open: boolean;
    onClose: () => void;
    onEliminado: () => void;
}) {
    console.log(userId)
    const [state, dispatch, pending] = useActionState(
        deleteUserAction, {
        errors: [],
        success: ''
    }
    );

    useEffect(() => {
        if (state.errors?.length > 0) {
            state.errors.forEach(error => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            onEliminado();
            onClose();
        }
    }, [state, onClose, onEliminado]);

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                <AlertTriangle size={20} />
                            </div>
                            <Dialog.Title className="text-lg font-bold text-gray-900">
                                Confirmar eliminación
                            </Dialog.Title>
                        </div>
                        <button
                            title='cerrar'
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form action={dispatch} className="space-y-5">
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                ¿Estás seguro que deseas eliminar este usuario?
                            </p>
                            <p className="text-sm text-gray-500">
                                Esta acción es permanente y eliminará todos sus datos.
                            </p>
                        </div>

                        <input type="hidden" name="userId" value={userId} />

                        {state.errors?.length > 0 && (
                            <div className="rounded-lg bg-red-50 p-3">
                                {state.errors.map((error, i) => (
                                    <p key={i} className="text-sm text-red-700">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={pending}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {pending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Eliminar usuario
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Dialog>
    );
}
