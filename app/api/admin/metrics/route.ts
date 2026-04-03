import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalOrders, orders, products] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ select: { total: true, status: true, items: true } }),
    prisma.product.findMany({ select: { id: true, name: true } }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === "done")
    .reduce((sum, o) => sum + o.total, 0);

  const ordersByStatus = {
    new: orders.filter((o) => o.status === "new").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    done: orders.filter((o) => o.status === "done").length,
  };

  const productCounts: Record<string, number> = {};
  for (const order of orders) {
    const items = order.items as Array<{ productId: string; quantity: number }>;
    for (const item of items) {
      productCounts[item.productId] = (productCounts[item.productId] ?? 0) + item.quantity;
    }
  }

  const popularProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, count]) => ({
      productId,
      name: products.find((p) => p.id === productId)?.name ?? "Unknown",
      count,
    }));

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    ordersByStatus,
    popularProducts,
    totalProducts: products.length,
  });
}
