import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <aside className="w-56 min-h-screen bg-white border-r border-stone-100 flex flex-col">
          <div className="p-5 border-b border-stone-100">
            <Link href="/" className="text-base font-bold text-stone-800">
              Valtrapru<span className="text-amber-600">.store</span>
            </Link>
            <p className="text-xs text-stone-400 mt-0.5">Панель управления</p>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-stone-100">
            <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              ← На сайт
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
