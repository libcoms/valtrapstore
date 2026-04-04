"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface Props {
  user: { id: string; username: string };
}

export default function AccountForm({ user }: Props) {
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }
    if (!currentPassword) {
      setError("Введите текущий пароль для подтверждения");
      return;
    }

    setLoading(true);
    const body: Record<string, string> = { currentPassword, username };
    if (newPassword) body.newPassword = newPassword;

    const res = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ошибка сохранения");
      return;
    }

    setSuccess("Сохранено. Войдите заново.");
    setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 1500);
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

      <div className="border-t border-stone-100 pt-4">
        <p className="text-sm font-medium text-stone-700 mb-3">Смена пароля</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-stone-500 mb-1">Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Новый пароль <span className="text-stone-400">(оставьте пустым, чтобы не менять)</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {newPassword && (
            <div>
              <label className="block text-xs text-stone-500 mb-1">Повторите новый пароль</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition-colors"
      >
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </form>
  );
}
