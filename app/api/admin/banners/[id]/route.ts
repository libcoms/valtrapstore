import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateBannerSchema = z.object({
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  subtitle: z.string().max(400).optional().nullable(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = UpdateBannerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const slide = await prisma.bannerSlide.update({ where: { id }, data: result.data });
  return NextResponse.json(slide);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.bannerSlide.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
