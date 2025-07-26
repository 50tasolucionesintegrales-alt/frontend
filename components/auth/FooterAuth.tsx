import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function FooterAuth() {
  return (
    <footer className="bg-[#174940] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        {/* Enlaces */}
        <div>
          <h3 className="font-semibold mb-3 text-[#63B23D]">Enlaces de interés</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-[#63B23D] transition-colors">
                Políticas de privacidad
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#63B23D] transition-colors">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#63B23D] transition-colors">
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <h3 className="font-semibold mb-3 text-[#63B23D]">Redes sociales</h3>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#63B23D] transition">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-[#63B23D] transition">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-semibold mb-3 text-[#63B23D]">Contacto</h3>
          <p className="text-sm">contacto@sincuenta.com</p>
          <p className="text-sm mt-1">+52 55 0000 0000</p>
        </div>
      </div>

      <div className="bg-[#0F332D] text-center py-4 text-xs text-gray-300">
        &copy; {new Date().getFullYear()} Sin Cuenta Soluciones Integrales. Todos los derechos reservados.
      </div>
    </footer>
  );
}
