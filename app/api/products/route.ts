import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProductCategory, ValtrapType } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as ProductCategory | null;
  const valtrapType = searchParams.get("valtrapType") as ValtrapType | null;
  const color = searchParams.get("color");
  const size = searchParams.get("size");

  const where: Record<string, unknown> = { inStock: true };

  if (category) where.category = category;
  if (valtrapType) where.valtrapType = valtrapType;
  if (color) where.colors = { has: color };
  if (size) where.sizes = { has: size };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
