import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, phone: true, address: true, role: true, createdAt: true },
  });

  return Response.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, address } = await req.json();

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, address },
    select: { id: true, name: true, email: true, phone: true, address: true },
  });

  return Response.json(user);
}
