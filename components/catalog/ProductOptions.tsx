"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

export default function ProductOptions({ product }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes[0]
  );

  return (
    <div className="space-y-5">
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

      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-stone-700 mb-2">
            Размер: <span className="font-normal text-stone-500 uppercase">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm border-2 transition-all font-semibold uppercase",
                  selectedSize === size
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <AddToCartButton
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
      />
    </div>
  );
}
