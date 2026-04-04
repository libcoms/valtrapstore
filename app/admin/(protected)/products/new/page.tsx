import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        Назад к товарам
      </Link>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Новый товар</h1>
      <ProductForm />
    </div>
  );
}
