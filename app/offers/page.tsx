"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Copy, Check, ArrowRight, Crown, Tag, Gift, Zap, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";

const COUPONS = [
  { code: "PIZZA20", discount: "20% OFF", label: "Any Order", expiry: "Jul 31, 2025", color: "from-orange-500 to-red-600" },
  { code: "COMBO15", discount: "15% OFF", label: "2+ Pizzas", expiry: "Aug 15, 2025", color: "from-pink-500 to-rose-600" },
  { code: "FIRST50", discount: "$5 OFF", label: "First Order", expiry: "No Expiry", color: "from-green-500 to-emerald-600" },
  { code: "WEEKEND10", discount: "10% OFF", label: "Weekends Only", expiry: "Recurring", color: "from-violet-500 to-purple-600" },
  { code: "LOYALTY25", discount: "25% OFF", label: "Gold Members", expiry: "Sep 1, 2025", color: "from-amber-500 to-orange-600" },
  { code: "REFER30", discount: "$3 OFF", label: "Per Referral", expiry: "No Expiry", color: "from-cyan-500 to-blue-600" },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function update() {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CouponCard({ coupon, i }: { coupon: (typeof COUPONS)[0]; i: number }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all"
    >
      <div className={`bg-gradient-to-r ${coupon.color} p-4 flex items-center justify-between`}>
        <div>
          <p className="text-white/80 text-xs font-medium">{coupon.label}</p>
          <p className="text-white text-2xl font-black">{coupon.discount}</p>
        </div>
        <Tag className="w-8 h-8 text-white/30" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-3 py-2 mb-3">
          <code className="text-orange-400 font-mono font-bold tracking-wider flex-1 text-sm">{coupon.code}</code>
          <button
            onClick={copy}
            className="text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-4 h-4 text-green-400" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        <p className="text-zinc-500 text-xs">Expires: {coupon.expiry}</p>
      </div>
    </motion.div>
  );
}

export default function OffersPage() {
  const [flashTarget] = useState(() => new Date(Date.now() + 24 * 3600 * 1000));
  const { h, m, s } = useCountdown(flashTarget);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-zinc-950 to-red-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.2),transparent_65%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 mb-4 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Flame className="w-10 h-10 text-orange-400" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl sm:text-7xl font-black"
          >
            Hot{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Deals
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto"
          >
            Exclusive discounts, limited-time flash sales, and loyalty rewards — all in one place.
          </motion.p>
        </motion.div>
      </section>

      {/* Flash Sale Countdown */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="relative z-10 p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">Flash Sale</span>
                </div>
                <h3 className="text-2xl font-black text-white">BBQ Feast Bundle — 30% OFF</h3>
                <p className="text-white/70 text-sm mt-1">4 large pizzas + garlic bread + 4 drinks</p>
                <p className="text-white font-bold text-lg mt-2">$79.99 <span className="line-through text-white/50 text-base font-normal ml-1">$114.99</span></p>
              </div>
              <div className="flex gap-3">
                {[{ label: "HRS", val: pad(h) }, { label: "MIN", val: pad(m) }, { label: "SEC", val: pad(s) }].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className="w-16 h-16 bg-black/30 backdrop-blur rounded-xl flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={t.val}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-2xl font-black text-white"
                        >
                          {t.val}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <p className="text-white/60 text-xs mt-1 font-medium">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Discount Codes</p>
            <h2 className="text-4xl font-black">Active Coupons</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUPONS.map((c, i) => <CouponCard key={c.code} coupon={c} i={i} />)}
          </div>
        </div>
      </section>

      {/* Loyalty Steps */}
      <section className="py-20 bg-zinc-900 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Rewards Program</p>
            <h2 className="text-4xl font-black">How Points Work</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connector lines */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.5%+1.5rem)] right-[calc(16.5%+1.5rem)] h-px bg-gradient-to-r from-orange-500 to-red-600 opacity-40" />
            {[
              { Icon: ShoppingCart, step: "01", title: "Place an Order", desc: "Every dollar you spend earns you 1 loyalty point." },
              { Icon: Star, step: "02", title: "Earn Points", desc: "Points accumulate automatically with every purchase." },
              { Icon: Gift, step: "03", title: "Redeem Rewards", desc: "100 points = $5 off your next order. No minimum required." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 text-center p-6 bg-zinc-800 border border-zinc-700 hover:border-orange-500/40 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 mb-3 mx-auto rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <item.Icon className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-orange-500 font-mono font-bold text-sm mb-2">{item.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/register">
              <AnimatedButton size="lg">
                <Gift className="w-4 h-4" />
                Join & Start Earning
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-10 text-center"
            style={{ background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(249,115,22,0.12),transparent_70%)]" />
            <div className="absolute inset-0 border border-orange-500/20 rounded-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-5">
                <Crown className="w-4 h-4" />
                Seasonal Special
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">Summer BBQ Feast Bundle</h3>
              <p className="text-zinc-400 mb-4">4 large pizzas · garlic bread · 4 soft drinks · free dessert</p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-4xl font-black text-white">$79.99</span>
                <span className="text-xl text-zinc-500 line-through">$114.99</span>
                <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">Save $35</span>
              </div>
              <Link href="/menu">
                <AnimatedButton size="lg">
                  Order the Bundle
                  <ArrowRight className="w-4 h-4" />
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
