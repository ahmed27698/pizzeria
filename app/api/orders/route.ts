import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          pizza: { select: { name: true, image: true } },
          toppings: { include: { topping: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { deliveryAddress, phone, notes, couponCode } = await req.json();

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          pizza: true,
          toppings: { include: { topping: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode, isActive: true } });
    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
        const subtotal = cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
        discount = coupon.isPercent ? subtotal * (coupon.discount / 100) : coupon.discount;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }
  }

  const total = cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0) - discount;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      deliveryAddress,
      phone,
      notes,
      couponCode,
      discount,
      total,
      items: {
        create: cart.items.map((i: any) => ({
          pizzaId: i.pizzaId,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          name: i.pizza.name,
          image: i.pizza.image,
          toppings: {
            create: i.toppings.map((t: any) => ({ toppingId: t.topping.id })),
          },
        })),
      },
    },
    include: { items: { include: { toppings: { include: { topping: true } } } } },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return Response.json(order, { status: 201 });
}
