import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalOrders, totalUsers, totalPizzas, recentOrders, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.pizza.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
  ]);

  return Response.json({
    totalOrders,
    totalUsers,
    totalPizzas,
    totalRevenue: revenue._sum.total ?? 0,
    recentOrders,
  });
}
