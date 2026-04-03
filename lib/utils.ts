import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const CATEGORY_LABELS: Record<string, string> = {
  valtrap: "Вальтрапы",
  ushki: "Ушки",
};

export const VALTRAP_TYPE_LABELS: Record<string, string> = {
  konkur: "Конкур",
  vyezdka: "Выездка",
  universalny: "Универсальный",
  pony: "Пони",
};

export const SIZE_LABELS: Record<string, string> = {
  cob: "Коб",
  full: "Фул",
  konkur: "Конкур",
  vyezdka: "Выездка",
  universalny: "Универсал",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  accepted: "Принят",
  in_progress: "В работе",
  done: "Выполнен",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  accepted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-800",
};
