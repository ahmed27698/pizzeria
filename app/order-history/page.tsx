"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Package, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PREPARING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  BAKING: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => { setOrders(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-orange-500" /> Order History
        </h1>

        {loading ? (
          <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <h2 className="text-xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">No orders yet</h2>
            <Link href="/menu"><AnimatedButton>Order Your First Pizza</AnimatedButton></Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                <button
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 font-mono text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-sm text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-sm text-zinc-500">{order.items?.length} item{order.items?.length !== 1 && "s"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-zinc-900 dark:text-zinc-50">{formatPrice(order.total)}</p>
                  </div>
                  {expanded === order.id ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img src={item.image || item.pizza?.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</p>
                              <p className="text-xs text-zinc-500">{item.size} × {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/order-tracking/${order.id}`} className="flex-1">
                            <AnimatedButton variant="secondary" size="sm" fullWidth>
                              <ExternalLink className="w-3.5 h-3.5" /> Track Order
                            </AnimatedButton>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
