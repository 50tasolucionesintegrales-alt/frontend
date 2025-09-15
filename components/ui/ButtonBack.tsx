"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ButtonBackProps = {
  href: string;
};

export default function ButtonBack({ href }: ButtonBackProps) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center gap-2 px-3 py-2
        text-sm font-medium
        bg-white border border-gray-200 rounded-lg shadow-md
        text-[#174940] hover:bg-[#63B23D] hover:text-white
        transition-colors duration-300
        ml-auto
      "
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden md:inline">Volver</span>
    </Link>
  );
}