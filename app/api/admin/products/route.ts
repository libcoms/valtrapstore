import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(["valtrap", "ushki"]),
  valtrapType: z.enum(["konkur", "vyezdka", "universalny", "pony"]).nullish(),
  price: z.number().positive(),
  images: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  manufacturer: z.string().optional(),
  inStock: z.boolean().default(true),
  isSet: z.boolean().default(false),
});

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = ProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({ data: result.data });
  return NextResponse.json(product, { status: 201 });
}
