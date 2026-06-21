import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;
  const { quantity } = await req.json();

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await params;
  await prisma.cartItem.delete({ where: { id: itemId } });
  return Response.json({ success: true });
}
