import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function FooterAuth() {
  return (
    <footer className="bg-[#174940] text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          {/* Columna 1: Enlaces de interés */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b border-[#0F332D] pb-2">
              Enlaces de Interés
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition duration-300"
                >
                  Políticas de privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition duration-300"
                >
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-white transition duration-300"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 2: Redes sociales */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b border-[#0F332D] pb-2">
              Síguenos
            </h2>
            <div className="flex justify-center md:justify-start space-x-6 mt-2">
              <a
                href="#"
                className="text-gray-200 hover:text-[#63B23D] transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-[#63B23D] transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-[#63B23D] transition duration-300"
                aria-label="Twitter"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-[#63B23D] transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b border-[#0F332D] pb-2">
              Contacto
            </h2>
            <p className="text-gray-200 mb-2">50tasolucionesintegrales@gmail.com</p>
            <p className="text-gray-200">+52 55 0000 0000</p>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="border-t border-[#0F332D] pt-6 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Sin Cuenta Soluciones Integrales. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}