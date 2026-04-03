import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateBannerSchema = z.object({
  imageUrl: z.string().url(),
  linkUrl: z.string().optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  subtitle: z.string().max(400).optional().nullable(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function GET() {
  const slides = await prisma.bannerSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CreateBannerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const slide = await prisma.bannerSlide.create({ data: result.data });
  return NextResponse.json(slide, { status: 201 });
}
