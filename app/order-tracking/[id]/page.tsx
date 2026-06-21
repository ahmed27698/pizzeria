"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Package } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";
import { OrderStatusBar } from "@/components/ui/order-status-bar";
import { formatPrice } from "@/lib/utils";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
      setLoading(false);
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-600">Order not found</p>
        <Link href="/order-history"><AnimatedButton className="mt-4">View Orders</AnimatedButton></Link>
      </div>
    </div>
  );

  const estimatedTime = order.status === "DELIVERED" ? "Delivered" :
    order.status === "OUT_FOR_DELIVERY" ? "~10 min" : "~30 min";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Order Tracking</h1>
            <p className="text-zinc-500 mt-1 font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* ETA */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-center text-white mb-8 shadow-xl shadow-orange-500/25"
          >
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium opacity-80">Estimated Time</p>
            <p className="text-4xl font-black mt-1">{estimatedTime}</p>
          </motion.div>

          {/* Status */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-6">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-6">Order Status</h2>
            <OrderStatusBar status={order.status} />
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-6">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.size} × {item.quantity}</p>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 mt-4 pt-4 flex justify-between font-bold text-zinc-900 dark:text-zinc-50">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-8">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4">Delivery Info</h2>
            <div className="space-y-2">
              <p className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" /> {order.deliveryAddress}
              </p>
              <p className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" /> {order.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/order-history" className="flex-1">
              <AnimatedButton variant="secondary" fullWidth>All Orders</AnimatedButton>
            </Link>
            <Link href="/menu" className="flex-1">
              <AnimatedButton fullWidth>Order More</AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
