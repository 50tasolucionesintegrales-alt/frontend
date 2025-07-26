// app/(auth)/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';

export default function Page() {
  return (
    // El formulario ya incluye todo el diseño y llamadas a acción;
    // basta con renderizarlo a pantalla completa.
    <RegisterForm />
  );
}
