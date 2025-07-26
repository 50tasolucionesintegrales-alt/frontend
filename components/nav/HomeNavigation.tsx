"use client"

import Link from "next/link";

export default function HomeNavigation({ mobile = false }) {
    return (
        <>
            <nav className={mobile ? "flex flex-col space-y-2" : "flex space-x-4"}>
                <Link
                    className='hover:text-indigo-600 transition'
                    href='/'
                >Inicio</Link>

                <Link
                    className='hover:text-indigo-600 transition'
                    href='/auth/cursos'
                >Cursos</Link>
            </nav>
        </>
    )
}
