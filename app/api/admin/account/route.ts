import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const Schema = z.object({
  currentPassword: z.string().min(1),
  username: z.string().min(3).max(50).optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const { currentPassword, username, newPassword } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const valid = await compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 403 });

  if (username && username !== user.username) {
    const conflict = await prisma.adminUser.findUnique({ where: { username } });
    if (conflict) return NextResponse.json({ error: "Логин уже занят" }, { status: 409 });
  }

  const data: Record<string, string> = {};
  if (username) data.username = username;
  if (newPassword) data.passwordHash = await hash(newPassword, 12);

  await prisma.adminUser.update({ where: { id: userId }, data });

  return NextResponse.json({ ok: true });
}
