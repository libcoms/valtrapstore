"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

interface BannerSlide {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  title: string | null;
  subtitle: string | null;
  sortOrder: number;
  active: boolean;
}

interface BannerFormProps {
  slide?: BannerSlide;
}

export default function BannerForm({ slide }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    imageUrl: slide?.imageUrl ?? "",
    linkUrl: slide?.linkUrl ?? "",
    title: slide?.title ?? "",
    subtitle: slide?.subtitle ?? "",
    sortOrder: slide?.sortOrder ?? 0,
    active: slide?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error("Загрузите фото баннера");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl || null,
        title: form.title || null,
        subtitle: form.subtitle || null,
        sortOrder: Number(form.sortOrder),
        active: form.active,
      };

      const url = slide ? `/api/admin/banners/${slide.id}` : "/api/admin/banners";
      const method = slide ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(slide ? "Баннер обновлён" : "Баннер создан");
      router.push("/admin/banners");
      router.refresh();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 " +
    "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors";
  const labelClass = "block text-sm font-semibold text-stone-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className={labelClass}>Фото баннера *</label>
        <ImageUploader
          value={form.imageUrl ? [form.imageUrl] : []}
          onChange={(urls) => setForm((p) => ({ ...p, imageUrl: urls[0] ?? "" }))}
        />
        <p className="text-xs text-stone-400 mt-1.5">Рекомендуемое соотношение сторон 3:1 (например 1500×500 px)</p>
      </div>

      <div>
        <label className={labelClass}>Ссылка при клике</label>
        <input
          type="text"
          value={form.linkUrl}
          onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
          className={fieldClass}
          placeholder="/product/abc123  или  /?category=valtrap"
        />
        <p className="text-xs text-stone-400 mt-1">Оставьте пустым, если баннер некликабельный</p>
      </div>

      <div>
        <label className={labelClass}>Заголовок</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className={fieldClass}
          placeholder="Новая коллекция вальтрапов"
        />
      </div>

      <div>
        <label className={labelClass}>Подзаголовок</label>
        <input
          type="text"
          value={form.subtitle}
          onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
          className={fieldClass}
          placeholder="Скидки до 30% на все размеры"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Порядок (меньше = выше)</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
            className={fieldClass}
            min={0}
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
              className="w-4 h-4 rounded border-stone-300"
            />
            <span className="text-sm font-medium text-stone-700">Активен (показывается на сайте)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {slide ? "Сохранить" : "Создать баннер"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
