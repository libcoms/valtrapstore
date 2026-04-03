import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateOrderSchema = z.object({
  status: z.enum(["new", "accepted", "in_progress", "done"]).optional(),
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  address: z.string().min(5).max(500).optional(),
  comment: z.string().max(1000).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = UpdateOrderSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(order);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
