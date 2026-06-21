import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isAdmin = (session.user as any).role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          pizza: { select: { name: true, image: true, slug: true } },
          toppings: { include: { topping: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  if (!isAdmin && order.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return Response.json(order);
}
