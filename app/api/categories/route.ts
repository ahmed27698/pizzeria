import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { pizzas: true } } },
    orderBy: { name: "asc" },
  });
  return Response.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
    },
  });
  return Response.json(category, { status: 201 });
}
