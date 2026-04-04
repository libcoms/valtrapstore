import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserForm from "@/components/admin/UserForm";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, username: true },
  });
  if (!user) notFound();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Редактировать пользователя</h1>
      <UserForm user={user} />
    </div>
  );
}
