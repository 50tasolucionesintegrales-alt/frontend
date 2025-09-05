'use client';

import { useState, useEffect, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { confirmAccount } from '@/actions/auth/confirmAccountAction';
import { MailCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ConfirmAccountForm() {
    const [token, setToken] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();
    const ConfirmAccountWithToken = confirmAccount.bind(null, token);

    const [state, dispatch] = useActionState(ConfirmAccountWithToken, {
        errors: [],
        success: '',
    })

    useEffect(() => {
        if (isCompleted) {
            startTransition(() => {
                dispatch();
            });
        }
    }, [isCompleted]);

    useEffect(() => {
        if (state.errors) state.errors.forEach((e) => toast.error(e));
        if (state.success) {
            toast.success(state.success, {
                onClose: () => router.push('/auth/login'),
            });
        }
    }, [state, router]);

    const handleChange = (val: string) => {
        setIsCompleted(false);
        setToken(val);
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

            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-stretch rounded-xl overflow-hidden shadow-xl bg-transparent">
                {/* Branding */}
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
                        Verifica tu correo electrónico y activa tu cuenta para comenzar a cotizar con nosotros.
                    </p>
                    <ul className="text-left text-[#cccccc] space-y-2">
                        {['Proceso rápido', 'Seguridad garantizada', 'Acceso inmediato', 'Soporte 24/7'].map(
                            (t) => (
                                <li key={t} className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#63B23D]" />
                                    {t}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Formulario */}
                <div className="lg:w-[40%] bg-white p-6 md:p-10 flex flex-col justify-center mx-6 rounded-xl shadow-2xl">
                    <div className="flex items-center gap-2 justify-center mb-6 text-[#63B23D]">
                        <MailCheck className="w-6 h-6" />
                        <h2 className="text-2xl font-bold">Confirma tu cuenta</h2>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                        <p className="text-center text-sm text-gray-600">
                            Ingresa el código de 6 dígitos que enviamos a tu correo
                        </p>
                        <div className="flex gap-4 justify-center">
                        <PinInput
                            value={token}
                            onChange={handleChange}
                            onComplete={() => setIsCompleted(true)}
                            otp
                        >
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                            <PinInputField className="w-12 h-12 text-center text-xl rounded-md bg-gray-100 border border-gray-300 placeholder-white" />
                        </PinInput>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
