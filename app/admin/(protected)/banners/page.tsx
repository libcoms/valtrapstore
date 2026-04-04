import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DeleteBannerButton from "@/components/admin/DeleteBannerButton";
import { Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const slides = await prisma.bannerSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Баннеры</h1>
        <Link href="/admin/banners/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Добавить баннер
          </Button>
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center text-stone-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="mb-4">Баннеров ещё нет</p>
          <Link href="/admin/banners/new">
            <Button size="sm">Добавить первый баннер</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-center gap-4"
            >
              <div className="relative w-32 h-11 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title ?? "Баннер"}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                  {slide.title ?? <span className="text-stone-400 italic">Без заголовка</span>}
                </p>
                {slide.subtitle && (
                  <p className="text-xs text-stone-400 truncate">{slide.subtitle}</p>
                )}
                {slide.linkUrl && (
                  <p className="text-xs text-amber-600 truncate mt-0.5">→ {slide.linkUrl}</p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  slide.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                }`}>
                  {slide.active ? "Активен" : "Скрыт"}
                </span>
                <span className="text-xs text-stone-400">#{slide.sortOrder}</span>
                <Link href={`/admin/banners/${slide.id}`}>
                  <Button size="sm" variant="ghost">Изменить</Button>
                </Link>
                <DeleteBannerButton slideId={slide.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
