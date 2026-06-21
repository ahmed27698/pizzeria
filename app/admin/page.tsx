"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, Pizza, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PREPARING: "bg-blue-100 text-blue-700",
  BAKING: "bg-orange-100 text-orange-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => { setStats(d); setLoading(false); });
  }, []);

  const CARDS = stats ? [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "from-green-500 to-emerald-600", delta: "+12%" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "from-orange-500 to-red-600", delta: "+8%" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-indigo-600", delta: "+5%" },
    { label: "Pizza Varieties", value: stats.totalPizzas, icon: Pizza, color: "from-purple-500 to-pink-600", delta: "active" },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))
          : CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-500 font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                    {card.delta}
                  </span>
                </div>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{card.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{card.label}</p>
              </motion.div>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Add New Pizza", href: "/admin/pizzas/add", color: "from-orange-500 to-red-600" },
          { label: "Manage Orders", href: "/admin/orders", color: "from-blue-500 to-indigo-600" },
          { label: "View Users", href: "/admin/users", color: "from-purple-500 to-pink-600" },
        ].map((action, i) => (
          <Link key={action.href} href={action.href}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r ${action.color} rounded-2xl p-5 text-white font-bold shadow-lg cursor-pointer`}
            >
              <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
              {action.label}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" /> Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-xs text-orange-500 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : stats?.recentOrders?.map((order: any, i: number) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-zinc-900 dark:text-zinc-100">{order.user?.name || "—"}</td>
                      <td className="px-5 py-3 text-zinc-500">{order.items?.length}</td>
                      <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-zinc-50">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
