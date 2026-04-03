"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
}

export default function AddToCartButton({
  product,
  selectedColor,
  selectedSize,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      price: product.price,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800">Добавлено в корзину</p>
            <p className="text-xs text-stone-400 truncate">{product.name}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/"
              onClick={() => toast.dismiss(t.id)}
              className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/cart"
              onClick={() => toast.dismiss(t.id)}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              В корзину →
            </Link>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  return (
    <Button onClick={handleAdd} size="lg" className="w-full" variant={added ? "secondary" : "primary"}>
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Добавлено
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          В корзину
        </>
      )}
    </Button>
  );
}
