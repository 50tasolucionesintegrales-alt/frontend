'use client';

import {
  useActionState,
  useEffect,
  useState,
  startTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

import { login } from '@/actions/auth/loginAction';
import { Button } from '../ui/boton';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [state, dispatch] = useActionState(login, {
    errors: [],
    success: '',
    rol: '',
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => toast.error(error));
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => {
          const destination =
            state.rol === 'admin'
              ? '/admin'
              : state.rol === 'cotizador'
                ? '/catalog'
                : '/catalog';
          router.push(destination);
        },
      });
    }
  }, [state, router]);

  /* ---------- estado UI ---------- */
  const [showPassword, setShowPassword] = useState(true);
  const togglePwd = () => setShowPassword((prev) => !prev);

  /* ---------- data para triángulos decorativos ---------- */
  const triangles = Array.from({ length: 100 });

  return (
    <div className="relative min-h-screen w-full font-sans bg-[#0F332D] overflow-hidden flex flex-col lg:flex-row items-center justify-center">
      {/* Fondo diagonal */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(110deg, #0F332D 50%, #174940 50%)',
        }}
      />

      {/* Triángulos lado izquierdo (color lado derecho) */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-1/2 z-0 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 gap-2 h-full opacity-30">
          {triangles.map((_, i) => (
            <div
              key={`left-${i}`}
              className="w-6 h-6 bg-[#174940] clip-triangle mx-auto"
            />
          ))}
        </div>
      </div>

      {/* Triángulos lado derecho (color lado izquierdo) */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 z-0 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 gap-2 h-full opacity-30">
          {triangles.map((_, i) => (
            <div
              key={`right-${i}`}
              className="w-6 h-6 bg-[#0F332D] clip-triangle mx-auto"
            />
          ))}
        </div>
      </div>

      {/* Clipping para triángulos */}
      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-stretch rounded-xl overflow-hidden shadow-xl bg-transparent">
        {/* Información de la empresa */}
        <div className="w-full lg:w-1/2 text-white p-6 md:p-10 flex flex-col justify-center items-center space-y-5 text-center bg-transparent">
          <img
            src="/LOGOSINCUENTAB.png"
            alt="Logo"
            className="w-30 h-30 md:w-35 md:h-35 lg:w-40 lg:h-40 object-contain rounded-md shadow p-2"
          />
          <h2 className="text-3xl font-bold text-[#63B23D]">
            Sin Cuenta Soluciones Integrales
          </h2>

          <p className="text-[#cccccc] max-w-md">
            Expertos en cotización de productos y servicios desde hace más de una
            década.
          </p>

          <ul className="text-left text-[#cccccc] space-y-2">
            {['Precisión en cotizaciones', 'Eficiencia en procesos', 'Confianza garantizada', 'Servicio confiable'].map(
              (text) => (
                <li key={text} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#63B23D]" />
                  {text}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="lg:w-[40%] bg-white p-6 md:p-10 flex flex-col justify-center mx-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 justify-center mb-6 text-[#63B23D]">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Inicio de Sesión</h2>
          </div>

          <form
            action={dispatch}
            className="space-y-5"
            noValidate
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                placeholder="usuario@correo.com"
                className="mt-1 w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Contraseña
              </label>
              <input
                name="password"
                type={showPassword ? 'password' : 'text'}
                placeholder="••••••••"
                className="mt-1 w-full text-black px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={togglePwd}
                className="absolute right-3 bottom-2 text-gray-400 focus:outline-none select-none"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <Link href="/auth/forgot-password" className="text-[#174940] underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón submit */}
            <Button className="w-full">Iniciar sesión</Button>
            <div className='flex text-sm mb-2'>
              <span className="text-gray-600">¿Aun no tienes cuenta? </span>
              <Link href='/auth/register' className='text-[#174940] underline' >
                Registrate aqui
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
