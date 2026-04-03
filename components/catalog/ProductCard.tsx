"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { formatPrice, CATEGORY_LABELS, VALTRAP_TYPE_LABELS, SIZE_LABELS } from "@/lib/utils";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const label =
    product.category === "valtrap" && product.valtrapType
      ? VALTRAP_TYPE_LABELS[product.valtrapType]
      : CATEGORY_LABELS[product.category];

  const images = product.images;
  const hasMultiple = images.length > 1;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goTo = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  }, []);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-100
                      transition-all duration-300 ease-out
                      md:hover:shadow-xl md:hover:-translate-y-1 md:hover:border-stone-200">
        <div className="relative aspect-square bg-stone-100 overflow-hidden">
          {images.length > 0 ? (
            <>
              {images.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  className={`object-cover transition-all duration-500 ease-out
                    ${i === currentIndex ? "opacity-100" : "opacity-0"}
                    ${i === currentIndex && !hasMultiple ? "md:group-hover:scale-110" : ""}
                  `}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ))}

              {hasMultiple && isHovered && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10
                               w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow
                               flex items-center justify-center text-stone-700
                               hover:bg-white transition-all duration-150
                               opacity-0 md:group-hover:opacity-100"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10
                               w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow
                               flex items-center justify-center text-stone-700
                               hover:bg-white transition-all duration-150
                               opacity-0 md:group-hover:opacity-100"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {hasMultiple && (
                <div
                  className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10"
                  onClick={(e) => e.preventDefault()}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => goTo(e, i)}
                      className={`rounded-full transition-all duration-200
                        ${i === currentIndex
                          ? "bg-white w-3 h-1.5"
                          : "bg-white/50 hover:bg-white/80 w-1.5 h-1.5"
                        }`}
                      aria-label={`Фото ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300
                            transition-colors duration-300 md:group-hover:text-stone-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}

          {product.isSet && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10
                             transition-transform duration-300 md:group-hover:scale-105">
              Комплект
            </span>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent
                          opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <p className="text-xs text-stone-400 font-medium mb-1 transition-colors duration-200 md:group-hover:text-amber-600">
            {label}
          </p>
          <h3 className="text-stone-800 font-semibold text-sm leading-snug mb-2 line-clamp-2
                         transition-colors duration-200 md:group-hover:text-stone-900">
            {product.name}
          </h3>

          {product.sizes.length > 0 && (() => {
            const ushkiSizes = product.sizes.filter((s) => ["cob", "full"].includes(s));
            const valtrapSizes = product.sizes.filter((s) => ["konkur", "vyezdka", "universalny"].includes(s));
            const showBoth = product.isSet && ushkiSizes.length > 0 && valtrapSizes.length > 0;

            return (
              <div className="space-y-1 mb-2">
                {showBoth ? (
                  <>
                    <div className="flex gap-1 flex-wrap items-center">
                      <span className="text-xs text-stone-400">Ушки:</span>
                      {ushkiSizes.map((s) => (
                        <span key={s} className="text-xs text-stone-600 font-medium bg-stone-100 rounded-full px-2 py-0.5 transition-colors duration-200 md:group-hover:bg-stone-200">
                          {SIZE_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 flex-wrap items-center">
                      <span className="text-xs text-stone-400">Вальтрап:</span>
                      {valtrapSizes.map((s) => (
                        <span key={s} className="text-xs text-stone-600 font-medium bg-stone-100 rounded-full px-2 py-0.5 transition-colors duration-200 md:group-hover:bg-stone-200">
                          {SIZE_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex gap-1 flex-wrap items-center">
                    <span className="text-xs text-stone-400">
                      {product.category === "ushki" ? "Размер:" : "Размер:"}
                    </span>
                    {product.sizes.map((s) => (
                      <span key={s} className="text-xs text-stone-600 font-medium bg-stone-100 rounded-full px-2 py-0.5 transition-colors duration-200 md:group-hover:bg-stone-200">
                        {SIZE_LABELS[s] ?? s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {product.colors.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-3">
              {product.colors.slice(0, 5).map((color) => (
                <span
                  key={color}
                  className="text-xs text-stone-500 bg-stone-100 rounded-full px-2 py-0.5
                             transition-colors duration-200 md:group-hover:bg-stone-200"
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-stone-400">+{product.colors.length - 5}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-stone-900 transition-colors duration-200 md:group-hover:text-amber-700">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-400">
              {product.manufacturer && `от ${product.manufacturer}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
