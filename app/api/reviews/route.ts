import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { pizzaId, rating, comment } = await req.json();
  if (!pizzaId || !rating || rating < 1 || rating > 5) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const review = await prisma.review.upsert({
    where: { userId_pizzaId: { userId: session.user.id, pizzaId } },
    create: { userId: session.user.id, pizzaId, rating, comment },
    update: { rating, comment },
    include: { user: { select: { name: true, image: true } } },
  });

  return Response.json(review, { status: 201 });
}
