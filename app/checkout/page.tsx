"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";

const MESSENGERS = [
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Telegram", label: "Telegram" },
  { value: "Viber", label: "Viber" },
  { value: "Звонок", label: "Телефонный звонок" },
];

interface FormData {
  name: string;
  phone: string;
  messenger: string;
  address: string;
  comment: string;
  privacy: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  messenger?: string;
  address?: string;
  privacy?: string;
}

function validateRuPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  return (
    (d.length === 11 && (d[0] === "7" || d[0] === "8")) ||
    (d.length === 10 && d[0] === "9")
  );
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2) errors.name = "Введите ваше имя";
  if (!validateRuPhone(data.phone)) errors.phone = "Введите номер телефона РФ (+7 или 8 и 10 цифр)";
  if (!data.messenger) errors.messenger = "Выберите мессенджер";
  if (!data.address.trim() || data.address.trim().length < 5) errors.address = "Укажите адрес пункта выдачи";
  if (!data.privacy) errors.privacy = "Необходимо согласие с политикой конфиденциальности";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    messenger: "",
    address: "",
    comment: "",
    privacy: false,
  });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">Корзина пуста</h1>
        <Link href="/">
          <Button>Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          messenger: form.messenger,
          address: form.address,
          comment: form.comment || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            quantity: i.quantity,
            price: i.price,
            color: i.color,
            size: i.size,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const { id } = await res.json();
      clearCart();
      router.push(`/order-success?id=${id}`);
    } catch {
      toast.error("Ошибка при оформлении заказа. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-stone-900 placeholder-stone-300
     focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all
     ${hasError ? "border-red-400" : "border-stone-200"}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Оформление заказа</h1>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-10">
        <form onSubmit={handleSubmit} className="space-y-5 mb-8 lg:mb-0">

          {/* Имя */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Ваше имя *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className={inputCls(!!errors.name)}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Телефон *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 (999) 000-00-00"
              type="tel"
              className={inputCls(!!errors.phone)}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Мессенджер */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Мессенджер для связи *
            </label>
            <select
              name="messenger"
              value={form.messenger}
              onChange={handleChange}
              className={inputCls(!!errors.messenger)}
            >
              <option value="">Выберите мессенджер</option>
              {MESSENGERS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            {errors.messenger && <p className="text-red-500 text-xs mt-1">{errors.messenger}</p>}
          </div>

          {/* Пункт выдачи */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Адрес пункта выдачи Яндекс Маркета *
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Например: ул. Ленина, 10, ПВЗ Яндекс Маркет"
              className={inputCls(!!errors.address)}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            <a
              href="https://market.yandex.ru/geo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors mt-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              Найти ближайший пункт выдачи на Яндекс Маркете
            </a>
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Комментарий к заказу
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Пожелания по цвету, размеру..."
              rows={3}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all resize-none"
            />
          </div>

          {/* Согласие */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacy"
                checked={form.privacy}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-800 focus:ring-stone-300 flex-shrink-0"
              />
              <span className="text-sm text-stone-600">
                Я согласен с{" "}
                <Link href="/privacy" target="_blank" className="text-stone-800 underline hover:text-amber-600 transition-colors">
                  политикой конфиденциальности
                </Link>
              </span>
            </label>
            {errors.privacy && <p className="text-red-500 text-xs mt-1 ml-7">{errors.privacy}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Отправить заявку
          </Button>

          <p className="text-xs text-stone-400 text-center">
            После отправки заявки с вами свяжется менеджер для подтверждения
          </p>
        </form>

        {/* Итого */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 mb-4">Ваш заказ</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const key = `${item.productId}-${item.color ?? ""}-${item.size ?? ""}`;
                return (
                  <div key={key} className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-700 font-medium leading-snug truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-stone-400">
                        {[item.color, item.size].filter(Boolean).join(" / ")} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-stone-800 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between font-bold text-stone-900">
              <span>Итого</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
