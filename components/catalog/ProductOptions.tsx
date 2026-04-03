"use client";

import { useState } from "react";
import { cn, SIZE_LABELS } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

const USHKI_VALUES = ["cob", "full"];
const VALTRAP_VALUES = ["konkur", "vyezdka", "universalny"];

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.isSet ? undefined : product.sizes[0]
  );

  // Для комплекта — два отдельных выбора
  const ushkiSizes = product.sizes.filter((s) => USHKI_VALUES.includes(s));
  const valtrapSizes = product.sizes.filter((s) => VALTRAP_VALUES.includes(s));

  const [selectedUshki, setSelectedUshki] = useState<string | undefined>(
    product.isSet ? ushkiSizes[0] : undefined
  );
  const [selectedValtrap, setSelectedValtrap] = useState<string | undefined>(
    product.isSet ? valtrapSizes[0] : undefined
  );

  // Итоговый размер для корзины
  const combinedSize = product.isSet
    ? [selectedUshki, selectedValtrap]
        .filter(Boolean)
        .map((s) => SIZE_LABELS[s!] ?? s)
        .join(" / ")
    : selectedSize;

  return (
    <div className="space-y-5">
      {/* Цвет */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-stone-700 mb-2">
            Цвет: <span className="font-normal text-stone-500">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm border-2 transition-all font-medium",
                  selectedColor === color
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Размер — обычный товар */}
      {!product.isSet && product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-stone-700 mb-2">
            Размер:{" "}
            <span className="font-normal text-stone-500">
              {selectedSize ? (SIZE_LABELS[selectedSize] ?? selectedSize) : ""}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm border-2 transition-all font-semibold",
                  selectedSize === size
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                )}
              >
                {SIZE_LABELS[size] ?? size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Размеры — комплект */}
      {product.isSet && (
        <>
          {ushkiSizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                Размер ушек:{" "}
                <span className="font-normal text-stone-500">
                  {selectedUshki ? (SIZE_LABELS[selectedUshki] ?? selectedUshki) : ""}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {ushkiSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedUshki(size)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm border-2 transition-all font-semibold",
                      selectedUshki === size
                        ? "border-stone-800 bg-stone-800 text-white"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    )}
                  >
                    {SIZE_LABELS[size] ?? size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {valtrapSizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                Размер вальтрапа:{" "}
                <span className="font-normal text-stone-500">
                  {selectedValtrap ? (SIZE_LABELS[selectedValtrap] ?? selectedValtrap) : ""}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {valtrapSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedValtrap(size)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm border-2 transition-all font-semibold",
                      selectedValtrap === size
                        ? "border-stone-800 bg-stone-800 text-white"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    )}
                  >
                    {SIZE_LABELS[size] ?? size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AddToCartButton
        product={product}
        selectedColor={selectedColor}
        selectedSize={combinedSize}
      />
    </div>
  );
}
