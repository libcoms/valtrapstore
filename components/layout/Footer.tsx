import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-base font-bold text-stone-800">
              Equestrian<span className="text-amber-600">Shop</span>
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Вальтрапы и ушки для лошадей ручной работы
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Каталог</p>
            <ul className="space-y-1">
              <li>
                <Link href="/?category=valtrap" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                  Вальтрапы
                </Link>
              </li>
              <li>
                <Link href="/?category=ushki" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                  Ушки
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Информация</p>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-stone-200 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} EquestrianShop. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
