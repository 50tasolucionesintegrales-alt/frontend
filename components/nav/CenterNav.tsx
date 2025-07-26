"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
    _id: string
    nombre: string
    email: string
    rol: 'admin' | 'docente' | 'estudiante'
}

export default function CenterNav() {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setUser(await userData.json());
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const rol = () => {
        switch (user?.rol) {
            case 'admin':
                return '/admin'
            case 'docente':
                return '/docente'
            case 'estudiante':
                return '/estudiante'
            default:
                return '/'
        }
    }

    return (
        <nav className="hidden md:flex space-x-6">
            <Link href={rol()} className="hover:text-indigo-600 transition-colors">Inicio</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">Conócenos</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contacto</Link>
        </nav>
    )
}
