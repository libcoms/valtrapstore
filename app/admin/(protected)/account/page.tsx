import AccountForm from "@/components/admin/AccountForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) notFound();

  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
  if (!user) notFound();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Мой аккаунт</h1>
      <AccountForm user={user} />
    </div>
  );
}
