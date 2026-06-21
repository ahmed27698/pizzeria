"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, FileText, CreditCard, CheckCircle2, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/components/ui/animated-button";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
  size: string;
  pizza: { name: string; image: string };
}

const STEPS = ["Details", "Review", "Confirm"];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: "", phone: "", notes: "", coupon: "" });

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then((d) => setItems(d.items || []));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 30 ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  async function placeOrder() {
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryAddress: form.address, phone: form.phone, notes: form.notes, couponCode: form.coupon || undefined }),
    });
    setLoading(false);
    if (res.ok) {
      const order = await res.json();
      toast.success("Order placed successfully!");
      router.push(`/order-tracking/${order.id}`);
    } else {
      toast.error("Failed to place order");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                i <= step ? "bg-orange-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${i <= step ? "text-orange-500" : "text-zinc-400"}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${i < step ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-700"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-5">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Delivery Details</h2>

                <div>
                  <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Enter your full delivery address"
                    rows={2}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" /> Notes (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Special instructions, allergies, etc."
                    rows={2}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-500" /> Coupon Code
                  </label>
                  <input
                    value={form.coupon}
                    onChange={(e) => setForm((f) => ({ ...f, coupon: e.target.value.toUpperCase() }))}
                    placeholder="PIZZA10 or COMBO15"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500"
                  />
                </div>

                <AnimatedButton
                  fullWidth
                  onClick={() => {
                    if (!form.address || !form.phone) { toast.error("Please fill in address and phone"); return; }
                    setStep(1);
                  }}
                >
                  Continue to Review
                </AnimatedButton>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-5">Review Your Order</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.pizza.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{item.pizza.name}</p>
                        <p className="text-xs text-zinc-500">{item.size} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Delivery</span><span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50 text-base pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm space-y-1">
                  <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" /> {form.address}
                  </p>
                  <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" /> {form.phone}
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <AnimatedButton variant="secondary" onClick={() => setStep(0)}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </AnimatedButton>
                  <AnimatedButton fullWidth onClick={() => setStep(2)}>
                    Confirm Order
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-orange-500/30"
                >
                  <CreditCard className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2">Ready to Order</h2>
                <p className="text-zinc-500 mb-2">Total: <span className="font-bold text-orange-500 text-lg">{formatPrice(total)}</span></p>
                <p className="text-sm text-zinc-400 mb-8">Cash on delivery. Your pizza will arrive in ~30 minutes.</p>

                <div className="flex gap-3">
                  <AnimatedButton variant="secondary" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </AnimatedButton>
                  <AnimatedButton fullWidth loading={loading} onClick={placeOrder}>
                    <CheckCircle2 className="w-4 h-4" /> Place Order
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
