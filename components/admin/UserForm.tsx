"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user?: { id: string; username: string };
}

export default function UserForm({ user }: Props) {
  const router = useRouter();
  const isEdit = !!user;

  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isEdit && !password) {
      setError("Введите пароль");
      return;
    }
    if (password && password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (password && password.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }

    setLoading(true);
    const body: Record<string, string> = { username };
    if (password) body.password = password;

    const res = await fetch(
      isEdit ? `/api/admin/users/${user.id}` : "/api/admin/users",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ошибка сохранения");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Логин</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          {isEdit ? "Новый пароль" : "Пароль"}
          {isEdit && <span className="text-stone-400 font-normal ml-1">(оставьте пустым, чтобы не менять)</span>}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!isEdit}
          autoComplete="new-password"
          className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {(password || !isEdit) && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Повторите пароль</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required={!isEdit || !!password}
            autoComplete="new-password"
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors"
        >
          {loading ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="text-stone-500 hover:text-stone-700 text-sm px-4 py-2.5"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
