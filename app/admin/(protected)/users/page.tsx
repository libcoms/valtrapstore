import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    select: { id: true, username: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Пользователи</h1>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {users.length === 0 ? (
          <p className="p-6 text-stone-400 text-sm text-center">Нет пользователей</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Логин</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Дата создания</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{u.username}</td>
                  <td className="px-4 py-3 text-stone-400">
                    {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Изменить
                    </Link>
                    <DeleteUserButton id={u.id} username={u.username} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
