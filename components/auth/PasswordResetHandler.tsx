'use client';

import { useState } from 'react';
import ValidateTokenForm from './ValidateTokenForm';
import ResetPasswordForm from './ResetPasswordForm';
import { KeyRound, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function PasswordResetHandler() {
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState('');
  const triangles = Array.from({ length: 100 });

  return (
    <div className="relative min-h-screen w-full font-sans bg-[#0F332D] overflow-hidden flex flex-col lg:flex-row items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(110deg, #0F332D 50%, #174940 50%)',
        }}
      />

      <div className="hidden lg:block absolute left-0 top-0 h-full w-1/2 z-0 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 gap-2 h-full opacity-30">
          {triangles.map((_, i) => (
            <div key={`left-${i}`} className="w-6 h-6 bg-[#174940] clip-triangle mx-auto" />
          ))}
        </div>
      </div>
      <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 z-0 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 gap-2 h-full opacity-30">
          {triangles.map((_, i) => (
            <div key={`right-${i}`} className="w-6 h-6 bg-[#0F332D] clip-triangle mx-auto" />
          ))}
        </div>
      </div>

      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>

      {/* Contenedor principal */}
      <div className="relative z-10 mb-10 w-full max-w-6xl flex flex-col lg:flex-row items-stretch rounded-xl overflow-hidden shadow-xl bg-transparent">
        {/* Columna izquierda: branding */}
        <div className="w-full lg:w-1/2 text-white p-6 md:p-10 flex flex-col justify-center items-center space-y-5 text-center bg-transparent">
          <Image
            src="/LOGOSINCUENTAB.png"
            alt="Logo Sin Cuenta"
            width={160}
            height={160}
            className="w-30 h-30 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain rounded-md shadow p-2"
          />
          <h2 className="text-3xl font-bold text-[#63B23D]">
            Sin Cuenta Soluciones Integrales
          </h2>
          <p className="text-[#cccccc] max-w-md">
            Estás a un paso de recuperar el acceso a tu cuenta. Restablece tu contraseña de forma segura.
          </p>
          <ul className="text-left text-[#cccccc] space-y-2">
            {['Seguridad verificada', 'Proceso rápido', 'Protección de datos', 'Soporte personalizado'].map((text) => (
              <li key={text} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#63B23D]" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: formulario */}
        <div className="lg:w-[40%] bg-white p-6 md:p-10 flex flex-col justify-center mx-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 justify-center mb-6 text-[#63B23D]">
            <KeyRound className="w-6 h-6" />
            <h2 className="text-2xl font-bold">
              Reestablece tu contraseña
            </h2>
          </div>

          {!isValidToken ? (
            <ValidateTokenForm
              setIsValidToken={setIsValidToken}
              token={token}
              setToken={setToken}
            />
          ) : (
            <ResetPasswordForm token={token} />
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
              <a
                href="/auth/login"
                className="font-medium text-[#174940] underline hover:text-[#63B23D] transition"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
