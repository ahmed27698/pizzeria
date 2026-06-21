import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { getPizzaPrice } from "@/lib/utils";
import type { PizzaSize } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          pizza: true,
          toppings: { include: { topping: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return Response.json(cart || { items: [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { pizzaId, size, quantity, toppingIds } = await req.json();

  const pizza = await prisma.pizza.findUnique({ where: { id: pizzaId } });
  if (!pizza) return Response.json({ error: "Pizza not found" }, { status: 404 });

  const basePrice = getPizzaPrice(pizza, size as PizzaSize);
  const toppings = toppingIds?.length
    ? await prisma.topping.findMany({ where: { id: { in: toppingIds } } })
    : [];
  const toppingTotal = toppings.reduce((s: number, t: { price: number }) => s + t.price, 0);
  const price = basePrice + toppingTotal;

  let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: session.user.id } });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, pizzaId, size: size as PizzaSize },
    include: { toppings: true },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
    });
  } else {
    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        pizzaId,
        size: size as PizzaSize,
        quantity: quantity || 1,
        price,
      },
    });
    if (toppingIds?.length) {
      await prisma.cartItemTopping.createMany({
        data: toppingIds.map((tid: string) => ({ cartItemId: item.id, toppingId: tid })),
      });
    }
  }

  return Response.json({ success: true }, { status: 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return Response.json({ success: true });
}
