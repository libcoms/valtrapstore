"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartIcon() {
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <Link href="/cart" className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
