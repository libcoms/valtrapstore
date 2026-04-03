"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Удалить товар? Это действие нельзя отменить.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Товар удалён");
      router.refresh();
    } catch {
      toast.error("Ошибка удаления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="danger" onClick={handleDelete} loading={loading}>
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  );
}
