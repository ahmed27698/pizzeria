import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a friendly AI assistant for Pizzeria, a premium pizza delivery service.
You help customers with pizza recommendations, menu questions, order tracking, combo suggestions, and dietary info.
Keep responses concise (2-4 sentences), warm, and helpful. Use a friendly enthusiastic tone.
When customers mention a budget, tell them exactly which pizzas they can afford from the menu context.
Always stay on topic — only discuss pizzas, orders, and the restaurant.`;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return Response.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return Response.json({ error: "Empty message" }, { status: 400 });

  const [history, featuredPizzas, allPizzas] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 10,
    }),
    prisma.pizza.findMany({
      where: { isAvailable: true, isFeatured: true },
      take: 5,
      select: { name: true, basePrice: true, category: { select: { name: true } } },
    }),
    prisma.pizza.findMany({
      where: { isAvailable: true },
      select: { name: true, basePrice: true, category: { select: { name: true } } },
      orderBy: { basePrice: "asc" },
    }),
  ]);

  await prisma.chatMessage.create({
    data: { userId: session.user.id, role: "user", content: message },
  });

  const menuContext = [
    "FEATURED: " + featuredPizzas.map((p: any) => `${p.name} (${p.category?.name}) - $${p.basePrice}`).join(", "),
    "ALL MENU: " + allPizzas.map((p: any) => `${p.name} - $${p.basePrice}`).join(", "),
  ].join("\n");

  const chatHistory = history.map((m: any) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: `${SYSTEM_PROMPT}\n\nCurrent menu:\n${menuContext}` },
      ...chatHistory,
      { role: "user", content: message },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response. Please try again.";

  await prisma.chatMessage.create({
    data: { userId: session.user.id, role: "assistant", content: response },
  });

  return Response.json({ response });
}
