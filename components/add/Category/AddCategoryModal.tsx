'use client'

import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Fragment, useActionState, useEffect, useState } from 'react'
import AddCategoryAction from '@/actions/add/categories/AddCategoryAction'
import { toast } from 'react-toastify'

export default function AddCategoryModal({ open, onClose }: {
    open: boolean
    onClose: () => void
}) {
    const [state, dispatch, pending] = useActionState(AddCategoryAction, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if(state.errors) {
            state.errors.forEach(e => toast.error(e))
        }
        if(state.success) {
            toast.success(state.success)
        }
    }, [state])


    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            as={motion.div}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                        >
                            <Dialog.Title className="text-lg font-medium mb-4">
                                Nueva Categoría
                            </Dialog.Title>

                            <form
                                className="space-y-4"
                                action={dispatch}
                            >
                                <div>
                                    <label className="block text-sm font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <button onClick={onClose} disabled={pending}>
                                        Cancelar
                                    </button>
                                    <button type='submit' disabled={pending}>
                                        {pending ? 'Creando...' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
