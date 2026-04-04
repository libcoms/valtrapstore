"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ id, username }: { id: string; username: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Удалить пользователя «${username}»?`)) return;

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Ошибка удаления");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
