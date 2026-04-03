"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-stone-200 mb-4" />
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Корзина пуста</h1>
        <p className="text-stone-500 mb-8">Добавьте товары из каталога</p>
        <Link href="/">
          <Button size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Корзина</h1>

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        <div className="space-y-4 mb-6 lg:mb-0">
          {items.map((item) => {
            const key = `${item.productId}-${item.color ?? ""}-${item.size ?? ""}`;
            return (
              <div
                key={key}
                className="cart-item flex gap-4 bg-white rounded-2xl border border-stone-100 p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                  {item.productImage ? (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm leading-snug mb-0.5">
                    {item.productName}
                  </p>
                  <p className="text-xs text-stone-400">
                    {[item.color, item.size?.toUpperCase()].filter(Boolean).join(" / ")}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                        aria-label="Уменьшить"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                        aria-label="Увеличить"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="text-stone-300 hover:text-red-500 transition-colors"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-sm text-stone-400 hover:text-stone-600 underline transition-colors"
          >
            Очистить корзину
          </button>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Итого</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => {
                const key = `${item.productId}-${item.color ?? ""}-${item.size ?? ""}`;
                return (
                  <div key={key} className="flex justify-between text-sm text-stone-600">
                    <span className="truncate mr-2">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-stone-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-stone-900 text-lg">
                <span>Итого</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">Доставка рассчитывается при оформлении</p>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Оформить заказ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
