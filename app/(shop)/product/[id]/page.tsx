import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { formatPrice, CATEGORY_LABELS, VALTRAP_TYPE_LABELS } from "@/lib/utils";
import ProductGallery from "@/components/catalog/ProductGallery";
import ProductOptions from "@/components/catalog/ProductOptions";
import type { Product } from "@/types";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valtrapru.store";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return {};

  const title = `${product.name} — ВальтрапРу`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Купить ${product.name} с доставкой через Яндекс Маркет. Ручная работа.`;
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/product/${id}`,
      siteName: "ВальтрапРу",
      ...(image ? { images: [{ url: image, width: 800, height: 800, alt: product.name }] } : {}),
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  const label =
    product.category === "valtrap" && product.valtrapType
      ? VALTRAP_TYPE_LABELS[product.valtrapType]
      : CATEGORY_LABELS[product.category];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад в каталог
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          <div>
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-2">
              {label}
              {product.isSet && " · Комплект"}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
            {product.manufacturer && (
              <p className="text-sm text-stone-400 mt-1">от {product.manufacturer}</p>
            )}
          </div>

          <div className="text-3xl font-bold text-stone-900">
            {formatPrice(product.price)}
          </div>

          {product.description && (
            <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>
          )}

          <ProductOptions product={product as unknown as Product} />
        </div>
      </div>
    </div>
  );
}
