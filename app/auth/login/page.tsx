// app/(auth)/login/page.tsx  ─ o donde corresponda
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="relative">
      <LoginForm />

      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <p className="text-sm text-white">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="text-[#63B23D] font-semibold underline hover:text-[#4b8f2f]"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
