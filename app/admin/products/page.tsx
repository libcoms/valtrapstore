import { prisma } from "@/lib/prisma";
import { formatPrice, CATEGORY_LABELS, VALTRAP_TYPE_LABELS } from "@/lib/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    where: q
      ? { name: { contains: q, mode: "insensitive" } }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Товары</h1>
        <div className="flex items-center gap-3">
          <Suspense>
            <AdminSearchInput placeholder="Поиск по названию..." />
          </Suspense>
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Добавить товар
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            {q ? (
              <p>По запросу «{q}» ничего не найдено</p>
            ) : (
              <>
                <p className="mb-4">Товаров ещё нет</p>
                <Link href="/admin/products/new">
                  <Button size="sm">Добавить первый товар</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wider px-5 py-3">Название</th>
                <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 py-3">Категория</th>
                <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 py-3">Цена</th>
                <th className="text-left text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 py-3">Наличие</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-stone-800">{product.name}</p>
                    {product.manufacturer && (
                      <p className="text-xs text-stone-400">от {product.manufacturer}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-stone-600">{CATEGORY_LABELS[product.category]}</p>
                    {product.valtrapType && (
                      <p className="text-xs text-stone-400">{VALTRAP_TYPE_LABELS[product.valtrapType]}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.inStock ? "В наличии" : "Нет"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button size="sm" variant="ghost">Изменить</Button>
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
