import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Enlaces de interés */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Enlaces de Interés
            </h2>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition duration-300 hover:pl-2 block"
                >
                  Políticas de privacidad
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition duration-300 hover:pl-2 block"
                >
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition duration-300 hover:pl-2 block"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 2: Redes sociales */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Síguenos
            </h2>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-500 transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-pink-600 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-gray-600 transition duration-300"
                aria-label="Twitter"
              >
                <FaXTwitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-700 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contacto
            </h2>
            <p className="text-gray-300 mb-2">contacto@cursify.com</p>
            <p className="text-gray-300">+1 (555) 123-4567</p>
          </div>

          {/* Columna 4: Newsletter (opcional) */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Suscríbete
            </h2>
            <p className="text-gray-300 mb-4">
              Recibe las últimas actualizaciones en tu correo.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-900"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r transition duration-300">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="border-t border-gray-800 pt-6 text-center md:text-left">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Cursify. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}