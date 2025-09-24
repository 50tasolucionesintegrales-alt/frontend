import Sidebar from "@/components/ui/sideBar";
import ToastNotification from "@/components/ui/ToastNotification";
import { verifySession } from "@/src/auth/dal";
import { redirect } from "next/navigation";

export default async function QuotesLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession()
    if (user.rol === 'comprador') {
        redirect('/errors/403')
    }
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] min-h-screen">
                <Sidebar user={user} />
                <main className="p-6 bg-gray-50 min-h-screen overflow-y-auto">
                    {children}
                    <ToastNotification />
                </main>
            </div>
        </div>
    );
}
