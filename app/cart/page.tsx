"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  pizzaId: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  quantity: number;
  price: number;
  pizza: { id: string; name: string; image: string; slug: string };
  toppings: { topping: { name: string; price: number } }[];
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then((d) => { setItems(d.items || []); setLoading(false); });
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      if (quantity < 1) setItems((prev) => prev.filter((i) => i.id !== itemId));
      else setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity } : i));
    }
  }

  async function removeItem(itemId: string) {
    const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Item removed");
    }
  }

  function applyCoupon() {
    if (coupon === "PIZZA10") { setDiscount(0.1); setCouponApplied(true); toast.success("Coupon applied! 10% off"); }
    else if (coupon === "COMBO15") { setDiscount(0.15); setCouponApplied(true); toast.success("Coupon applied! 15% off"); }
    else toast.error("Invalid coupon code");
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 30 ? 0 : 3.99;
  const total = subtotal - discountAmount + deliveryFee;

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-64" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-orange-500" />
          Your Cart
          <span className="text-lg font-normal text-zinc-400">({items.length} items)</span>
        </motion.h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <h2 className="text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8">Add some pizzas to get started</p>
            <Link href="/menu"><AnimatedButton size="lg">Browse Menu <ArrowRight className="w-5 h-5" /></AnimatedButton></Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-[1fr_340px] gap-8">
            {/* Items */}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex gap-4"
                  >
                    <Link href={`/pizza/${item.pizza.slug}`}>
                      <img src={item.pizza.image} alt={item.pizza.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 hover:scale-105 transition-transform" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{item.pizza.name}</h3>
                          <p className="text-sm text-zinc-500 mt-0.5">
                            {item.size.charAt(0) + item.size.slice(1).toLowerCase()}
                            {item.toppings.length > 0 && ` · ${item.toppings.map((t) => t.topping.name).join(", ")}`}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm">
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                        <motion.span
                          key={item.price * item.quantity}
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          className="font-bold text-zinc-900 dark:text-zinc-50"
                        >
                          {formatPrice(item.price * item.quantity)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 sticky top-24"
              >
                <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-4">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE"
                        disabled={couponApplied}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 disabled:opacity-50"
                      />
                    </div>
                    <AnimatedButton
                      variant="secondary"
                      size="sm"
                      onClick={applyCoupon}
                      disabled={couponApplied || !coupon}
                    >
                      Apply
                    </AnimatedButton>
                  </div>
                  {couponApplied && <p className="text-xs text-green-500 mt-1.5">Coupon applied successfully!</p>}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-green-500"
                    >
                      <span>Discount ({discount * 100}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? <span className="text-green-500">Free</span> : formatPrice(deliveryFee)}</span>
                  </div>
                  {subtotal < 30 && (
                    <p className="text-xs text-orange-500">Add {formatPrice(30 - subtotal)} more for free delivery!</p>
                  )}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2.5 flex justify-between font-bold text-base text-zinc-900 dark:text-zinc-50">
                    <span>Total</span>
                    <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                      {formatPrice(total)}
                    </motion.span>
                  </div>
                </div>

                <Link href="/checkout">
                  <AnimatedButton fullWidth className="mt-5">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>

                <Link href="/menu">
                  <AnimatedButton variant="ghost" fullWidth size="sm" className="mt-2">
                    Continue Shopping
                  </AnimatedButton>
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
