"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
}

const EMPTY: Partial<Product> = {
  name: "",
  description: "",
  category: "valtrap",
  valtrapType: "konkur",
  price: 0,
  images: [],
  colors: [],
  sizes: [],
  manufacturer: "",
  inStock: true,
  isSet: false,
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Product>>(product ?? EMPTY);
  const [colorsInput, setColorsInput] = useState((product?.colors ?? []).join(", "));
  const [sizesInput, setSizesInput] = useState((product?.sizes ?? []).join(", "));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        colors: colorsInput.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: sizesInput.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images ?? [],
        valtrapType: form.category === "valtrap" ? form.valtrapType : null,
      };

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success(product ? "Товар обновлён" : "Товар создан");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Ошибка сохранения товара");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all";
  const labelClass = "block text-sm font-semibold text-stone-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className={labelClass}>Название *</label>
        <input
          required
          value={form.name ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className={fieldClass}
          placeholder="Вальтрап конкур классик"
        />
      </div>

      <div>
        <label className={labelClass}>Описание</label>
        <textarea
          rows={3}
          value={form.description ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className={fieldClass + " resize-none"}
          placeholder="Описание товара..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Категория *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as "valtrap" | "ushki" }))}
            className={fieldClass}
          >
            <option value="valtrap">Вальтрап</option>
            <option value="ushki">Ушки</option>
          </select>
        </div>

        {form.category === "valtrap" && (
          <div>
            <label className={labelClass}>Тип вальтрапа</label>
            <select
              value={form.valtrapType ?? "konkur"}
              onChange={(e) => setForm((p) => ({ ...p, valtrapType: e.target.value as Product["valtrapType"] }))}
              className={fieldClass}
            >
              <option value="konkur">Конкур</option>
              <option value="vyezdka">Выездка</option>
              <option value="universalny">Универсальный</option>
              <option value="pony">Пони</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Цена (₽) *</label>
          <input
            type="number"
            required
            min={1}
            value={form.price ?? 0}
            onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Производитель</label>
          <input
            value={form.manufacturer ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, manufacturer: e.target.value }))}
            className={fieldClass}
            placeholder="Название мастерской"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Цвета (через запятую)</label>
        <input
          value={colorsInput}
          onChange={(e) => setColorsInput(e.target.value)}
          className={fieldClass}
          placeholder="Белый, Чёрный, Синий, Бордо"
        />
      </div>

      <div>
        <label className={labelClass}>Размеры (через запятую)</label>
        <input
          value={sizesInput}
          onChange={(e) => setSizesInput(e.target.value)}
          className={fieldClass}
          placeholder="cob, full, pony"
        />
      </div>

      <div>
        <label className={labelClass}>Фотографии товара</label>
        <ImageUploader
          value={form.images ?? []}
          onChange={(urls) => setForm((p) => ({ ...p, images: urls }))}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.inStock ?? true}
            onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))}
            className="w-4 h-4 rounded border-stone-300 text-stone-800"
          />
          <span className="text-sm font-medium text-stone-700">В наличии</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isSet ?? false}
            onChange={(e) => setForm((p) => ({ ...p, isSet: e.target.checked }))}
            className="w-4 h-4 rounded border-stone-300 text-stone-800"
          />
          <span className="text-sm font-medium text-stone-700">Продаётся комплектом</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {product ? "Сохранить изменения" : "Создать товар"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
