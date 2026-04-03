import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        Назад к товарам
      </Link>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Редактирование товара</h1>
      <ProductForm product={product as unknown as Product} />
    </div>
  );
}
