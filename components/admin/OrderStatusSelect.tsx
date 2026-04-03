"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES = ["new", "accepted", "in_progress", "done"] as const;
type Status = (typeof STATUSES)[number];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus as Status);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success("Статус обновлён");
      router.refresh();
    } catch {
      toast.error("Ошибка обновления статуса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-xl border-0 text-xs font-semibold px-3 py-1.5 cursor-pointer focus:ring-2 focus:ring-stone-300 focus:outline-none disabled:opacity-50 ${ORDER_STATUS_COLORS[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
