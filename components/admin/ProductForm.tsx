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
  price: 0,
  images: [],
  colors: [],
  sizes: [],
  manufacturer: "",
  inStock: true,
  isSet: false,
};

const SIZE_OPTIONS = {
  ushki: [
    { value: "cob", label: "Коб" },
    { value: "full", label: "Фул" },
  ],
  valtrap: [
    { value: "konkur", label: "Конкур" },
    { value: "vyezdka", label: "Выездка" },
    { value: "universalny", label: "Универсал" },
  ],
};

function SizeGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-stone-600 mb-2">{title}</p>
      <div className="flex flex-wrap gap-3">
        {options.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => onChange(value)}
              className="w-4 h-4 rounded border-stone-300 text-stone-800"
            />
            <span className="text-sm font-medium text-stone-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Product>>(product ?? EMPTY);
  const [colorsInput, setColorsInput] = useState((product?.colors ?? []).join(", "));

  const toggleSize = (value: string) => {
    setForm((p) => {
      const sizes = p.sizes ?? [];
      return {
        ...p,
        sizes: sizes.includes(value) ? sizes.filter((s) => s !== value) : [...sizes, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        colors: colorsInput.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes ?? [],
        images: form.images ?? [],
        valtrapType: null,
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

  const fieldClass =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 " +
    "focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all";
  const labelClass = "block text-sm font-semibold text-stone-700 mb-1.5";
  const sizes = form.sizes ?? [];

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
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                category: e.target.value as "valtrap" | "ushki",
                sizes: [],
              }))
            }
            className={fieldClass}
          >
            <option value="valtrap">Вальтрап</option>
            <option value="ushki">Ушки</option>
          </select>
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
        <label className={labelClass}>Цвета (через запятую)</label>
        <input
          value={colorsInput}
          onChange={(e) => setColorsInput(e.target.value)}
          className={fieldClass}
          placeholder="Белый, Чёрный, Синий, Бордо"
        />
      </div>

      {/* Размеры — всегда показываем */}
      <div className="rounded-xl border border-stone-200 p-4 space-y-4">
        <p className={labelClass + " mb-0"}>Размеры</p>

        {!form.isSet ? (
          /* Не комплект: только своя категория */
          <SizeGroup
            title={form.category === "ushki" ? "Ушки" : "Вальтрап"}
            options={form.category === "ushki" ? SIZE_OPTIONS.ushki : SIZE_OPTIONS.valtrap}
            selected={sizes}
            onChange={toggleSize}
          />
        ) : (
          /* Комплект: обе категории */
          <>
            <SizeGroup
              title="Ушки"
              options={SIZE_OPTIONS.ushki}
              selected={sizes}
              onChange={toggleSize}
            />
            <SizeGroup
              title="Вальтрап"
              options={SIZE_OPTIONS.valtrap}
              selected={sizes}
              onChange={toggleSize}
            />
          </>
        )}
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
            onChange={(e) =>
              setForm((p) => ({ ...p, isSet: e.target.checked, sizes: [] }))
            }
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
