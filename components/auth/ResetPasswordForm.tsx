'use client';

import { useActionState, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { resetPasswordAction } from '@/actions/auth/resetPasswordAction';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);

  const resetPassWithToken = resetPasswordAction.bind(null, token);
  const [state, dispatch] = useActionState(resetPassWithToken, {
    errors: [],
    success: '',
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => toast.error(error));
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => router.push('/auth/login'),
      });
    }
  }, [state, router]);

  const togglePwd = () => setShowPassword((prev) => !prev);
  const togglePwd2 = () => setShowPassword2((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-[#63B23D] text-center mb-6">
          Cambia tu contraseña
        </h2>

        <form className="space-y-6" action={dispatch}>
          {/* Nueva contraseña */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Nueva Contraseña
            </label>
            <input
              name="password"
              type={showPassword ? 'password' : 'text'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 pr-10 mt-1 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none"
            />
            <button
              type="button"
              onClick={togglePwd}
              className="absolute right-3 top-9 text-gray-500 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              name="confirmPassword"
              type={showPassword2 ? 'password' : 'text'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 pr-10 mt-1 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none"
            />
            <button
              type="button"
              onClick={togglePwd2}
              className="absolute right-3 top-9 text-gray-500 focus:outline-none"
            >
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#63B23D] hover:bg-[#4b8f2f] text-white text-base font-bold rounded-xl transition duration-200"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
