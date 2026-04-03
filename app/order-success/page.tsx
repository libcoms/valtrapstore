import Link from "next/link";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-stone-900 mb-3">Заявка принята!</h1>

      {id && (
        <p className="text-sm text-stone-400 mb-4 font-mono">
          #{id.slice(-8).toUpperCase()}
        </p>
      )}

      <p className="text-stone-600 mb-2">
        Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и обсуждения оплаты.
      </p>

      <Link href="/">
        <Button size="lg" variant="outline">
          Вернуться в каталог
        </Button>
      </Link>
    </div>
  );
}
