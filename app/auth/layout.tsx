import ToastNotification from "@/components/ui/ToastNotification";
import HeaderAuth from "@/components/auth/HeaderAuth";
import FooterAuth from "@/components/auth/FooterAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "50ta - Auth"
};

export default function authLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <HeaderAuth />
            {children}
            <FooterAuth />

            <ToastNotification />
        </>
    );
}