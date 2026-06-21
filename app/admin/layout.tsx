"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Pizza, ShoppingBag, Users, Tag, MessageSquare, ArrowLeft,
} from "lucide-react";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/pizzas", icon: Pizza, label: "Pizzas" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/chat", icon: MessageSquare, label: "Chat Logs" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") router.push("/");
  }, [session, status, router]);

  if (status === "loading" || !session) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex pt-16">
      {/* Sidebar */}
      <aside className="w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed left-0 top-16 bottom-0 z-40">
        <div className="p-4">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2 mb-3">Admin Panel</p>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/">
            <div className="flex items-center gap-2 text-xs text-zinc-500 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </div>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-56 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
