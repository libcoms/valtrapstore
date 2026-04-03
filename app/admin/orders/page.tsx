import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import EditOrderForm from "@/components/admin/EditOrderForm";
import type { OrderItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const USHKI_LABELS = new Set(["Коб", "Фул"]);
const VALTRAP_LABELS = new Set(["Конкур", "Выездка", "Универсал"]);

function parseSetSize(size: string) {
  const parts = size.split(" / ");
  return {
    ushki: parts.find((p) => USHKI_LABELS.has(p)),
    valtrap: parts.find((p) => VALTRAP_LABELS.has(p)),
  };
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const isSet = !!item.size && item.size.includes(" / ");
  const sizeInfo = isSet ? parseSetSize(item.size!) : null;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-stone-50 last:border-0">
      {/* Фото + ссылка */}
      <Link
        href={`/product/${item.productId}`}
        target="_blank"
        className="flex-shrink-0 relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-100 hover:border-stone-300 transition-colors"
      >
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs">
            нет фото
          </div>
        )}
      </Link>

      {/* Инфо */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={`/product/${item.productId}`}
            target="_blank"
            className="text-sm font-semibold text-stone-800 hover:text-amber-600 transition-colors leading-snug"
          >
            {item.productName}
          </Link>
          {isSet && (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
              Комплект
            </span>
          )}
        </div>

        <div className="mt-0.5 space-y-0.5">
          {item.color && (
            <p className="text-xs text-stone-500">Цвет: {item.color}</p>
          )}
          {isSet && sizeInfo ? (
            <>
              {sizeInfo.ushki && (
                <p className="text-xs text-stone-500">Ушки: <span className="font-medium text-stone-700">{sizeInfo.ushki}</span></p>
              )}
              {sizeInfo.valtrap && (
                <p className="text-xs text-stone-500">Вальтрап: <span className="font-medium text-stone-700">{sizeInfo.valtrap}</span></p>
              )}
            </>
          ) : item.size ? (
            <p className="text-xs text-stone-500">Размер: <span className="font-medium text-stone-700">{item.size}</span></p>
          ) : null}
          <p className="text-xs text-stone-400">× {item.quantity}</p>
        </div>
      </div>

      {/* Цена */}
      <span className="text-sm font-semibold text-stone-700 flex-shrink-0">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Заказы</h1>
        <span className="text-sm text-stone-400">{orders.length} заказов</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center text-stone-400">
          <p>Заказов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items as unknown as OrderItem[];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-mono text-stone-400 mb-0.5">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-lg font-bold text-stone-900">{order.name}</p>
                    <p className="text-sm text-stone-500">{order.phone}</p>
                    {(order as { messenger?: string }).messenger && (
                      <p className="text-sm text-stone-500">
                        {(order as { messenger?: string }).messenger}
                      </p>
                    )}
                    <p className="text-sm text-stone-500">{order.address}</p>
                    {order.comment && (
                      <p className="text-sm text-stone-400 italic mt-1">"{order.comment}"</p>
                    )}
                    <EditOrderForm
                      orderId={order.id}
                      initialName={order.name}
                      initialPhone={order.phone}
                      initialAddress={order.address}
                      initialComment={order.comment}
                    />
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      <DeleteOrderButton orderId={order.id} />
                    </div>
                    <p className="text-xl font-bold text-stone-900">{formatPrice(order.total)}</p>
                    <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t border-stone-50 pt-3">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Состав заказа
                  </p>
                  <div>
                    {items.map((item, i) => (
                      <OrderItemRow key={i} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
