import BannerForm from "@/components/admin/BannerForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewBannerPage() {
  return (
    <div>
      <Link
        href="/admin/banners"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Баннеры
      </Link>
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Новый баннер</h1>
      <BannerForm />
    </div>
  );
}
