"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface EditOrderFormProps {
  orderId: string;
  initialName: string;
  initialPhone: string;
  initialAddress: string;
  initialComment: string | null;
}

export default function EditOrderForm({
  orderId,
  initialName,
  initialPhone,
  initialAddress,
  initialComment,
}: EditOrderFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialName,
    phone: initialPhone,
    address: initialAddress,
    comment: initialComment ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          comment: form.comment || null,
        }),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      router.refresh();
    } catch {
      alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors mt-1"
      >
        <Pencil className="w-3 h-3" />
        Изменить данные
      </button>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder-stone-300 " +
    "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors bg-white";

  return (
    <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Редактирование</p>
        <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Имя</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Телефон</label>
          <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Адрес</label>
        <input name="address" value={form.address} onChange={handleChange} className={inputCls} />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Комментарий</label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={handleSave} loading={loading}>Сохранить</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
      </div>
    </div>
  );
}
