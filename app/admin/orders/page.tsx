import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import EditOrderForm from "@/components/admin/EditOrderForm";
import type { OrderItem } from "@/types";

export const dynamic = "force-dynamic";

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

                <div className="border-t border-stone-50 pt-4">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Состав заказа</p>
                  <div className="space-y-1">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-700">
                          {item.productName}
                          {item.color && ` (${item.color})`}
                          {item.size && ` / ${item.size.toUpperCase()}`}
                          {" × "}
                          {item.quantity}
                        </span>
                        <span className="text-stone-500">{formatPrice(item.price * item.quantity)}</span>
                      </div>
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
