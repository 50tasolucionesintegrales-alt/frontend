"use client"

import { logout } from "@/actions/auth/logoutAction";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

export default function AdminNavigation({ mobile = false }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  return (
    <>
      {/* Versión desktop */}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`
          hidden lg:flex items-center gap-2
          bg-indigo-600 px-4 py-2 text-white uppercase 
          font-medium text-xs rounded-lg 
          hover:bg-indigo-500 transition-colors
          ${isLoading ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <FaSignOutAlt size={14} />
        <span>Cerrar Sesión</span>
      </button>

      {/* Versión mobile */}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`
          lg:hidden flex items-center gap-2 w-full p-3
          text-left text-gray-700 hover:bg-gray-100
          rounded-md transition-colors
          ${isLoading ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <FaSignOutAlt className="text-indigo-600" />
        <span>Cerrar sesión</span>
      </button>
    </>
  );
}