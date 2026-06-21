import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const where: any = { isAvailable: true };
  if (category && category !== "all") where.category = { slug: category };
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (featured === "true") where.isFeatured = true;

  const [pizzas, total] = await Promise.all([
    prisma.pizza.findMany({
      where,
      include: {
        category: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, favorites: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.pizza.count({ where }),
  ]);

  const pizzasWithRating = pizzas.map((p: any) => ({
    ...p,
    avgRating: p.reviews.length
      ? p.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / p.reviews.length
      : 0,
  }));

  return Response.json({ pizzas: pizzasWithRating, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const pizza = await prisma.pizza.create({
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
      ingredients: body.ingredients || [],
      tags: body.tags || [],
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
    },
    include: { category: true },
  });

  return Response.json(pizza, { status: 201 });
}
