'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-toastify';
import { User } from '@/src/schemas';
import { modificarRolAction } from '@/actions/admin/modificarRolAction';
import DeleteUserModal from '../modals/admin/deleteUserModal';

interface Props {
  users: User[];
  mode: 'assign' | 'edit';
}

export default function UserRoleTable({ users, mode }: Props) {
  const router = useRouter();
  const [state, dispatch] = useActionState(modificarRolAction, { errors: [], success: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (state.errors?.length) state.errors.forEach(e => toast.error(e));
    if (state.success) toast.success(state.success);
  }, [state]);

  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleted = () => router.refresh();

  return (
    <>
      {selectedUserId !== null && (
        <DeleteUserModal
          open={modalOpen}
          userId={selectedUserId}
          onClose={closeModal}
          onEliminado={handleDeleted}
        />
      )}

      {users.length === 0 ? (
        <p className="py-12 text-center">
          <span className="inline-block px-8 py-4 rounded-lg bg-[#174940]/5 border-l-4 border-[#63B23D] text-[#174940] text-lg font-medium">
            No hay usuarios pendientes de {mode === 'assign' ? 'asignación' : 'edición'}
          </span>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border-2 border-[#174940] shadow-lg shadow-[#174940]/20">
          <table className="min-w-full divide-y divide-[#63B23D]/30">
            <thead className="bg-[#174940]">
              <tr>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                  Correo
                </th>
                {mode === 'edit' && (
                  <th className="px-4 py-2 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Rol actual
                  </th>
                )}
                <th className="px-4 py-2 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                  {mode === 'assign' ? 'Asignar rol' : 'Cambiar rol'}
                </th>
                {mode === 'edit' && (
                  <th className="px-4 py-2 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-[#174940]/5 divide-y divide-[#63B23D]/20">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#63B23D]/10 transition-colors duration-200">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-[#174940]">{u.nombre}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#174940]/90">{u.email}</td>
                  {mode === 'edit' && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#174940]/90 capitalize">{u.rol}</td>
                  )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <form action={dispatch} className="flex items-center gap-3">
                        <input type="hidden" name="userId" value={u.id} />
                        <select
                          title="rol"
                          name="rol"
                          defaultValue={mode === 'edit' ? u.rol : ''}
                          required
                          className="w-48 sm:w-40 pl-3 pr-10 py-2 text-sm border-2 border-[#174940] rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D]"
                        >
                          <option value="" disabled className="text-[#999999]">
                            Seleccionar rol
                          </option>
                          <option value="cotizador" className="text-[#174940]">Cotizador</option>
                          <option value="comprador" className="text-[#174940]">Comprador</option>
                        </select>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg shadow-md text-white bg-[#0F332D] hover:bg-[#174940] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#63B23D] transition-colors"
                        >
                          {mode === 'assign' ? 'Asignar' : 'Actualizar'}
                        </button>
                      </form>
                    </td>
                  {mode === 'edit' && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openModal(u.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}