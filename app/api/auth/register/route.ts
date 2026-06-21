import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already in use" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hash },
    select: { id: true, name: true, email: true },
  });

  return Response.json(user, { status: 201 });
}
