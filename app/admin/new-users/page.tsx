import { cookies } from 'next/headers';
import { ArrowLeft, Users } from 'lucide-react';

import UserRoleTable from '@/components/admin/UserTable';
import { User } from '@/src/schemas';
import Link from 'next/link';

export default async function UnassignedUsersPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/unassigned`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  );

  const data: User[] = await res.json();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <Users className="w-8 h-8 text-[#174940]" />
          <h1 className="text-3xl font-bold text-[#174940]">
            Gestionar nuevos usuarios
          </h1>
        </div>
        <Link
            href='/admin'
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
        </Link>
      </div>

      <UserRoleTable
        users={data}
        mode="assign"
      />
    </div>
  );
}
