"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

function itemKey(item: Pick<CartItem, "productId" | "color" | "size">) {
  return `${item.productId}-${item.color ?? ""}-${item.size ?? ""}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const key = itemKey(newItem);
          const existing = state.items.find((i) => itemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, color, size) => {
        const key = itemKey({ productId, color, size });
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== key),
        }));
      },

      updateQuantity: (productId, quantity, color, size) => {
        const key = itemKey({ productId, color, size });
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i) !== key),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              itemKey(i) === key ? { ...i, quantity } : i
            ),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "shop-cart",
    }
  )
);
