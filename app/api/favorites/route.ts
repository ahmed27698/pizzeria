import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      pizza: {
        include: {
          category: true,
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { pizzaId } = await req.json();

  const fav = await prisma.favorite.upsert({
    where: { userId_pizzaId: { userId: session.user.id, pizzaId } },
    create: { userId: session.user.id, pizzaId },
    update: {},
  });

  return Response.json(fav, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { pizzaId } = await req.json();

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, pizzaId },
  });

  return Response.json({ success: true });
}
