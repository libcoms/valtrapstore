import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToTelegram } from "@/lib/telegram";
import { z } from "zod";

const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  color: z.string().optional(),
  size: z.string().optional(),
});

const CreateOrderSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  address: z.string().min(5).max(500),
  comment: z.string().max(1000).optional(),
  items: z.array(OrderItemSchema).min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CreateOrderSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { name, phone, address, comment, items } = result.data;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      address,
      comment,
      total,
      items,
      status: "new",
    },
  });

  sendOrderToTelegram({
    id: order.id,
    name: order.name,
    phone: order.phone,
    address: order.address,
    comment: order.comment,
    total: order.total,
    items: items,
    createdAt: order.createdAt,
  }).catch(console.error);

  return NextResponse.json({ id: order.id }, { status: 201 });
}
