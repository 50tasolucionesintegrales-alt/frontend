import Link from "next/link";
import { Mail } from 'lucide-react';
import ForgotPassForm from "@/components/auth/ForgotPass";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full font-sans bg-[#0F332D] overflow-hidden flex items-center justify-center px-4">
      {/* Fondo diagonal */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(110deg, #0F332D 50%, #174940 50%)',
        }}
      />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl">
        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[#63B23D]/10 rounded-full">
            <Mail size={50} className="text-[#63B23D]" />
          </div>
        </div>

        {/* Títulos */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Recupera tu contraseña
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>

        {/* Formulario */}
        <ForgotPassForm />

        {/* Links de navegación */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="text-center space-y-3 text-sm">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-[#174940] hover:underline transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-[#174940] hover:underline transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}