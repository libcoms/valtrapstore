import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import BannerSlider from "@/components/ui/BannerSlider";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, slides] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bannerSlide.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {slides.length > 0 && <BannerSlider slides={slides} />}

      {products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg font-medium">Товары скоро появятся</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <ProductCard product={product as unknown as Product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
