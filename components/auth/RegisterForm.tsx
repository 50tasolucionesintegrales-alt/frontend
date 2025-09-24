'use client';

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff, CheckCircle, User, Mail } from 'lucide-react';
import { register } from "@/actions/auth/registerAction";
import { Button } from "../ui/boton";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    password2: "",
    solicitoDocente: false,
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);

  const [state, dispatch] = useActionState(register, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => toast.error(error));
    }
    if (state.success) {
      toast.success(state.success, {
        onClose: () => {
          router.push("/auth/confirm-account");
        }
      });
      setFormData({
        nombre: "",
        email: "",
        password: "",
        password2: "",
        solicitoDocente: false,
      });
    }
  }, [state, router]);

  const togglePwd = () => setShowPassword((prev) => !prev);
  const togglePwd2 = () => setShowPassword2((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (formData_: FormData) => {
    formData_.set("nombre", formData.nombre);
    formData_.set("email", formData.email);
    formData_.set("password", formData.password);
    formData_.set("password2", formData.password2);

    return await dispatch(formData_);
  };

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
            <div
              key={`left-${i}`}
              className="w-6 h-6 bg-[#174940] clip-triangle mx-auto"
            />
          ))}
        </div>
      </div>

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

      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>

      {/* Contenedor principal */}
      <div className="relative z-10 mb-10 w-full max-w-6xl flex flex-col lg:flex-row items-stretch rounded-xl overflow-hidden shadow-xl bg-transparent">
        {/* Información de la empresa */}
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
            Expertos en cotización de productos y servicios desde hace más de una
            década.
          </p>

          <ul className="text-left text-[#cccccc] space-y-2">
            {['Registro seguro', 'Protección de datos', 'Acceso inmediato', 'Soporte 24/7'].map(
              (text) => (
                <li key={text} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#63B23D]" />
                  {text}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Formulario de registro */}
        <div className="lg:w-[40%] bg-white p-6 md:p-10 flex flex-col justify-center mx-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 justify-center mb-6 text-[#63B23D]">
            <User className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Crear Cuenta</h2>
          </div>

          <form action={handleSubmit} className="space-y-5" noValidate>
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-gray-700"
              >
                Nombre completo
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full text-black pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="usuario@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-black pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
                />
              </div>
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
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full text-black px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={togglePwd}
                className="absolute right-3 bottom-2 text-gray-400 focus:outline-none select-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="password2"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmar contraseña
              </label>
              <input
                name="password2"
                type={showPassword2 ? 'password' : 'text'}
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
                className="mt-1 w-full text-black px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={togglePwd2}
                className="absolute right-3 bottom-2 text-gray-400 focus:outline-none select-none"
              >
                {showPassword2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Botón submit */}
            <Button className="w-full">Registrarse</Button>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <Link href="/auth/login" className="text-[#174940] underline">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}