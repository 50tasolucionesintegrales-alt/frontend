'use client'

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ButtonBack() {
    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}
            className="
            mb-6 inline-flex items-center gap-2
            bg-white border border-gray-200
            px-4 py-2 rounded-lg
            shadow-sm
            text-gray-700 hover:bg-gray-100
            transition
          "
        >
            <ArrowLeft className="w-3 h-3" />
            Volver
        </button>
    )
}
