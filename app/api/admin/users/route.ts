import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const CreateSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.adminUser.findMany({
    select: { id: true, username: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const { username, password } = parsed.data;

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) return NextResponse.json({ error: "Логин уже занят" }, { status: 409 });

  const passwordHash = await hash(password, 12);
  const user = await prisma.adminUser.create({
    data: { username, passwordHash },
    select: { id: true, username: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
}
