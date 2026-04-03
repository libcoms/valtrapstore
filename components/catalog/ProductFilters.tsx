"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "Все товары" },
  { value: "valtrap", label: "Вальтрапы" },
  { value: "ushki", label: "Ушки" },
];

const VALTRAP_TYPES = [
  { value: "konkur", label: "Конкур" },
  { value: "vyezdka", label: "Выездка" },
  { value: "universalny", label: "Универсальный" },
  { value: "pony", label: "Пони" },
];

const USHKI_SIZES = ["cob", "full", "pony"];

interface ProductFiltersProps {
  availableColors: string[];
}

export default function ProductFilters({ availableColors }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const valtrapType = searchParams.get("valtrapType") ?? "";
  const color = searchParams.get("color") ?? "";
  const size = searchParams.get("size") ?? "";
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key === "category") {
        params.delete("valtrapType");
        params.delete("size");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    setSearchValue("");
    router.push("/");
  };

  const hasFilters = category || valtrapType || color || size || searchValue;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Поиск</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Название товара..."
            className="pl-8 pr-7 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50 w-full
                       focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Очистить"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Категория</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter("category", cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                category === cat.value
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {category === "valtrap" && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Тип</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("valtrapType", "")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                !valtrapType ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              Все
            </button>
            {VALTRAP_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter("valtrapType", type.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  valtrapType === type.value
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {category === "ushki" && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Размер</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("size", "")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                !size ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              Все
            </button>
            {USHKI_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => updateFilter("size", s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all uppercase",
                  size === s
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableColors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Цвет</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter("color", "")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                !color ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              Все
            </button>
            {availableColors.map((c) => (
              <button
                key={c}
                onClick={() => updateFilter("color", c)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  color === c
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-stone-500 hover:text-stone-800 underline transition-colors"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
