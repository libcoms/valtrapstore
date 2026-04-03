import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const [totalOrders, orders, totalProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ select: { total: true, status: true, items: true } }),
    prisma.product.count(),
  ]);

  type OrderRow = { total: number; status: string; items: unknown };
  const totalRevenue = (orders as OrderRow[]).filter((o) => o.status === "done").reduce((s: number, o: OrderRow) => s + o.total, 0);
  const ordersByStatus = {
    new: (orders as OrderRow[]).filter((o) => o.status === "new").length,
    accepted: (orders as OrderRow[]).filter((o) => o.status === "accepted").length,
    in_progress: (orders as OrderRow[]).filter((o) => o.status === "in_progress").length,
    done: (orders as OrderRow[]).filter((o) => o.status === "done").length,
  };

  return { totalOrders, totalRevenue, ordersByStatus, totalProducts };
}

export default async function AdminDashboard() {
  const metrics = await getMetrics();
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Всего заказов", value: metrics.totalOrders, suffix: "" },
          { label: "Выручка (выполненные)", value: formatPrice(metrics.totalRevenue), suffix: "" },
          { label: "Новых заказов", value: metrics.ordersByStatus.new, suffix: "" },
          { label: "Товаров в каталоге", value: metrics.totalProducts, suffix: "" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <p className="text-xs text-stone-400 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${ORDER_STATUS_COLORS[status]}`}>
              {ORDER_STATUS_LABELS[status]}
            </span>
            <p className="text-xl font-bold text-stone-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-bold text-stone-900">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
            Все заказы →
          </Link>
        </div>
        <div className="divide-y divide-stone-50">
          {recentOrders.length === 0 ? (
            <p className="text-center text-stone-400 py-10 text-sm">Заказов ещё нет</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    #{order.id.slice(-8).toUpperCase()} — {order.name}
                  </p>
                  <p className="text-xs text-stone-400">{order.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm font-bold text-stone-800">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
