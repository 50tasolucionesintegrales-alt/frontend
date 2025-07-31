import Sidebar from "@/components/ui/sideBar";
import ToastNotification from "@/components/ui/ToastNotification";
import { verifySession } from "@/src/auth/dal";
import { redirect } from "next/dist/server/api-utils";

export default async function PrincipalLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession()

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] min-h-screen">
                <Sidebar />
                <main className="p-6 bg-gray-50 min-h-screen overflow-y-auto">
                    {children}
                <ToastNotification />
                </main>
            </div>
        </div>
    );
}
