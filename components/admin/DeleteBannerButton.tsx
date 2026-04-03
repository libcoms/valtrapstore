"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteBannerButton({ slideId }: { slideId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Удалить баннер?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/banners/${slideId}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("Ошибка при удалении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-stone-300 hover:text-red-500 transition-colors disabled:opacity-50"
      aria-label="Удалить баннер"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
