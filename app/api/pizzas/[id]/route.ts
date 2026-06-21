import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pizza = await prisma.pizza.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  });

  if (!pizza) return Response.json({ error: "Not found" }, { status: 404 });

  const avgRating = pizza.reviews.length
    ? pizza.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / pizza.reviews.length
    : 0;

  return Response.json({ ...pizza, avgRating });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const pizza = await prisma.pizza.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      basePrice: body.basePrice,
      smallPrice: body.smallPrice,
      mediumPrice: body.mediumPrice,
      largePrice: body.largePrice,
      categoryId: body.categoryId,
      ingredients: body.ingredients,
      tags: body.tags,
      isAvailable: body.isAvailable,
      isFeatured: body.isFeatured,
    },
    include: { category: true },
  });

  return Response.json(pizza);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.pizza.delete({ where: { id } });
  return Response.json({ success: true });
}
