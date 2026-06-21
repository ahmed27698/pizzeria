"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES = ["PENDING", "PREPARING", "BAKING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PREPARING: "bg-blue-100 text-blue-700",
  BAKING: "bg-orange-100 text-orange-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => { setOrders(d); setLoading(false); });
  }, []);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success("Status updated");
    } else toast.error("Failed to update");
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Orders</h1>
        <p className="text-zinc-500 mt-1">{orders.length} total orders</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
              filter === s ? "bg-orange-500 text-white" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {["Order", "Customer", "Items", "Total", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(8).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" /></td>)}
                    </tr>
                  ))
                : filtered.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{order.user?.name || "—"}</p>
                          <p className="text-xs text-zinc-400">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{order.items?.length}</td>
                      <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-zinc-50">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
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
