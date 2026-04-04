import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const UpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const { username, password } = parsed.data;

  if (username) {
    const conflict = await prisma.adminUser.findUnique({ where: { username } });
    if (conflict && conflict.id !== id) {
      return NextResponse.json({ error: "Логин уже занят" }, { status: 409 });
    }
  }

  const data: Record<string, string> = {};
  if (username) data.username = username;
  if (password) data.passwordHash = await hash(password, 12);

  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, username: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Prevent deleting the last admin
  const count = await prisma.adminUser.count();
  if (count <= 1) {
    return NextResponse.json({ error: "Нельзя удалить единственного администратора" }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
