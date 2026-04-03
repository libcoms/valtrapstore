"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    if (totalItems === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 400);
    return () => clearTimeout(t);
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Логотип + название */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 md:group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Valtrapru.store"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span className="text-lg font-bold text-stone-800 tracking-tight leading-none">
              Valtrapru<span className="text-amber-600">.store</span>
            </span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Каталог" },
              { href: "/?category=valtrap", label: "Вальтрапы" },
              { href: "/?category=ushki", label: "Ушки" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium
                           after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5
                           after:bg-amber-500 after:transition-all after:duration-300
                           hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors rounded-xl hover:bg-stone-50"
            >
              <ShoppingBag className={`w-5 h-5 transition-transform duration-300 ${cartBump ? "md:scale-125" : "scale-100"}`} />
              {totalItems > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none transition-transform duration-300 ${cartBump ? "md:scale-125" : "scale-100"}`}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-xl hover:bg-stone-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              <span className={`block transition-all duration-200 ${mobileOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"}`}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </span>
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="py-3 border-t border-stone-100 flex flex-col gap-1">
            {[
              { href: "/", label: "Весь каталог" },
              { href: "/?category=valtrap", label: "Вальтрапы" },
              { href: "/?category=ushki", label: "Ушки" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2 text-stone-700 hover:text-stone-900 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
