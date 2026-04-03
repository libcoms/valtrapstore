import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import ProductFilters from "@/components/catalog/ProductFilters";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    valtrapType?: string;
    color?: string;
    size?: string;
    search?: string;
  }>;
}

async function getProducts(params: {
  category?: string;
  valtrapType?: string;
  color?: string;
  size?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = { inStock: true };
  if (params.category) where.category = params.category;
  if (params.valtrapType) where.valtrapType = params.valtrapType;
  if (params.color) where.colors = { has: params.color };
  if (params.size) where.sizes = { has: params.size };
  if (params.search) where.name = { contains: params.search, mode: "insensitive" };

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function getAllColors() {
  const products = await prisma.product.findMany({ select: { colors: true } });
  const all = products.flatMap((p) => p.colors);
  return [...new Set(all)].sort();
}

function pluralize(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "товар";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "товара";
  return "товаров";
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [products, allColors] = await Promise.all([
    getProducts(params),
    getAllColors(),
  ]);

  const categoryLabel = params.search
    ? `Поиск: ${params.search}`
    : params.category === "valtrap"
      ? "Вальтрапы"
      : params.category === "ushki"
        ? "Ушки"
        : "Все товары";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-1">{categoryLabel}</h1>
        <p className="text-stone-500 text-sm">
          {products.length === 0
            ? "Товары не найдены"
            : `${products.length} ${pluralize(products.length)}`}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside>
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-100 p-5 shadow-sm mb-6 lg:mb-0">
            <h2 className="text-sm font-bold text-stone-800 mb-4">Фильтры</h2>
            <Suspense>
              <ProductFilters availableColors={allColors} />
            </Suspense>
          </div>
        </aside>

        <section>
          {products.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <p className="text-lg font-medium mb-2">Товары не найдены</p>
              <p className="text-sm">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <ProductCard product={product as unknown as Product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
