"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Star, Clock, Shield, ChefHat, Flame, Truck, Pizza, Award, Crown, Disc3, Citrus, CircleDashed, Beef, Umbrella, ShoppingCart, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PizzaCard } from "@/components/ui/pizza-card";
import { PizzaCardSkeleton } from "@/components/ui/skeleton";
import type { Pizza as PizzaType } from "@/types";

const STATS = [
  { icon: Pizza, value: "50+", label: "Pizza Varieties" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Truck, value: "30min", label: "Avg Delivery" },
  { icon: Award, value: "10k+", label: "Happy Customers" },
];

const FEATURES = [
  { icon: Flame, title: "Stone-fired", desc: "Every pizza baked in our 900°F wood-fired oven for the perfect crust." },
  { icon: ChefHat, title: "Master Chefs", desc: "Our pizzaiolos trained in Naples bring authentic Italian craft to every pie." },
  { icon: Shield, title: "Fresh Guaranteed", desc: "We source only the finest local ingredients, prepared fresh daily." },
  { icon: Clock, title: "Fast Delivery", desc: "Hot pizza at your door in 30 minutes or your next order is free." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", text: "Hands down the best pizza I've ever had. The crust is perfect — crispy outside, chewy inside.", rating: 5, avatar: "https://i.pravatar.cc/60?img=47" },
  { name: "James K.", text: "Ordered for our office party and everyone was blown away. Fast, hot, and absolutely delicious.", rating: 5, avatar: "https://i.pravatar.cc/60?img=12" },
  { name: "Priya S.", text: "The veg specials are incredible. Never thought a pizza app could feel so premium.", rating: 5, avatar: "https://i.pravatar.cc/60?img=32" },
];

const BLOG_PREVIEWS = [
  { title: "The Art of Neapolitan Pizza: A Deep Dive", tag: "History", readTime: "8 min", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", author: "Chef Marco" },
  { title: "5 Secrets to the Perfect Pizza Dough", tag: "Recipes", readTime: "5 min", image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600&q=80", author: "Chef Sofia" },
  { title: "Wood-Fired vs. Conventional Oven", tag: "Tips & Tricks", readTime: "4 min", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80", author: "Chef Marco" },
];

const PRESS = ["Food Network", "Eater", "Michelin Guide", "NY Times Food", "Bon Appétit", "TasteAtlas"];

const INGREDIENTS: { icon: LucideIcon; label: string; color: string }[] = [
  { icon: Disc3, label: "Cheese", color: "text-amber-400" },
  { icon: Citrus, label: "Tomato", color: "text-red-400" },
  { icon: CircleDashed, label: "Olives", color: "text-green-400" },
  { icon: Beef, label: "Pepperoni", color: "text-rose-400" },
  { icon: Umbrella, label: "Mushrooms", color: "text-purple-400" },
  { icon: Flame, label: "Jalapeños", color: "text-orange-400" },
];

const COUNTER_TARGETS = [
  { label: "Pizzas Delivered Today", value: 247 },
  { label: "Happy Customers", value: 10482 },
  { label: "Cities Covered", value: 12 },
  { label: "5-Star Reviews", value: 4200 },
];

function CounterNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target >= 1000 ? (count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 1 : 0)}k` : count) : count;

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-black text-orange-400">
      {display}{suffix}
    </span>
  );
}

export default function HomePage() {
  const [featuredPizzas, setFeaturedPizzas] = useState<PizzaType[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: bannerScroll } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bannerY = useTransform(bannerScroll, [0, 1], [-40, 40]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/pizzas?featured=true&limit=4")
      .then((r) => r.json())
      .then((d) => { setFeaturedPizzas(d.pizzas || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTestimonial((v) => (v + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  function toggleIngredient(label: string) {
    setSelectedIngredients((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(249,115,22,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(220,38,38,0.1),transparent_60%)]" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
              background: i % 2 === 0 ? "rgba(249,115,22,0.2)" : "rgba(220,38,38,0.15)",
              left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 20}%`,
            }}
          />
        ))}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              Fresh from the oven, delivered to your door
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              Pizza Made{" "}
              <span className="bg-linear  -to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Perfect</span>,{" "}
              <br className="hidden sm:block" />
              Delivered{" "}
              <span className="relative">
                Fast
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.5 }} className="absolute -bottom-2 left-0 right-0 h-1 bg-linear  -to-r from-orange-500 to-red-600 rounded-full origin-left" />
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-zinc-400 mt-6 max-w-xl leading-relaxed">
              Handcrafted by master pizzaiolos, baked in stone-fired ovens, and delivered steaming hot. Experience pizza the way it was meant to be.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-3 mt-8">
              <Link href="/menu"><AnimatedButton size="lg" className="text-base">Order Now <ArrowRight className="w-5 h-5" /></AnimatedButton></Link>
              <Link href="/menu"><AnimatedButton size="lg" variant="outline" className="text-base border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400">Browse Menu</AnimatedButton></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-6 mt-10">
              {STATS.slice(0, 3).map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="text-center">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 120 }} className="relative flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-80 h-80 rounded-full border border-orange-500/20 border-dashed" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 rounded-full border border-red-500/10 border-dashed" />
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 w-72 h-72 rounded-full overflow-hidden shadow-2xl shadow-orange-500/30 border-4 border-orange-500/30">
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" alt="Featured Pizza" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -right-4 top-16 bg-white dark:bg-zinc-800 rounded-2xl px-4 py-3 shadow-xl border border-zinc-100 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">4.9</span>
                <span className="text-zinc-500 text-xs">rating</span>
              </div>
            </motion.div>
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -left-6 bottom-20 bg-linear -to-r from-orange-500 to-red-600 rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm">30 min</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-zinc-500 text-xs">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-zinc-600 flex items-start justify-center pt-1.5">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-2 bg-orange-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-14 bg-linear -to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <s.icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
              <p className="text-4xl font-black text-white">{s.value}</p>
              <p className="text-white/70 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Pizzas ── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Top Picks</p>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">Featured Pizzas</h2>
            </div>
            <Link href="/menu"><AnimatedButton variant="ghost" size="sm" className="hidden md:flex">See All <ArrowRight className="w-4 h-4" /></AnimatedButton></Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(4).fill(0).map((_, i) => <PizzaCardSkeleton key={i} />) : featuredPizzas.map((pizza, i) => <PizzaCard key={pizza.id} pizza={pizza} index={i} />)}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link href="/menu"><AnimatedButton>See All Pizzas <ArrowRight className="w-4 h-4" /></AnimatedButton></Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">The Pizzeria Difference</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-orange-400 transition-all">
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                  <f.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-2">{f.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-4xl font-black text-white">How It Works</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.5%+2rem)] right-[calc(16.5%+2rem)] h-px bg-linear -to-r from-orange-500/50 via-orange-500/20 to-orange-500/50" />
            {[
              { icon: Pizza, step: "01", title: "Browse Menu", desc: "Choose from 50+ handcrafted pizzas with detailed descriptions and photos." },
              { icon: ChefHat, step: "02", title: "Customize", desc: "Add toppings, pick your size (S/M/L), and apply coupon codes for extra savings." },
              { icon: Truck, step: "03", title: "Track & Enjoy", desc: "Real-time tracking from our oven to your door. Average 30-minute delivery." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative z-10 text-center p-6 bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl transition-all">
                <div className="w-14 h-14 mx-auto bg-linear-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-500/30">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-orange-500 font-mono font-bold text-sm mb-2">{item.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Counter ── */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {COUNTER_TARGETS.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <CounterNumber target={item.value} />
              <p className="text-zinc-400 text-sm mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Interactive Ingredients ── */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Customise</p>
            <h2 className="text-4xl font-black text-white">Build Your Dream Pizza</h2>
            <p className="text-zinc-400 mt-3">Click ingredients to add them to your pizza, then head to the menu to order.</p>
          </motion.div>

          <div className="relative flex items-center justify-center my-30">
            {/* Pizza base */}
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-52 h-52 rounded-full bg-linear-to-br from-amber-600 to-orange-700 shadow-2xl shadow-orange-500/30 flex items-center justify-center border-4 border-amber-500/30 z-10"
            >
              <Pizza className="w-20 h-20 text-amber-200 drop-shadow-lg" />
              {selectedIngredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
                >
                  {selectedIngredients.length}
                </motion.div>
              )}
            </motion.div>

            {/* Ingredient orbs */}
            {INGREDIENTS.map((ing, i) => {
              const angle = (i / INGREDIENTS.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 150;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const selected = selectedIngredients.includes(ing.label);
              return (
                <motion.button
                  key={ing.label}
                  style={{ position: "absolute", left: `calc(50% + ${x}px - 32px)`, top: `calc(50% + ${y}px - 32px)` }}
                  animate={selected ? { x: [0, -x * 0.4, 0], y: [0, -y * 0.4, 0] } : { y: [0, -6, 0] }}
                  transition={selected ? { duration: 0.4 } : { duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  onClick={() => toggleIngredient(ing.label)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all border-2 ${selected ? "bg-orange-500 border-orange-300 shadow-orange-500/50" : "bg-zinc-800 border-zinc-700 hover:border-orange-500/60"}`}
                >
                  <ing.icon className={`w-6 h-6 ${selected ? "text-white" : ing.color}`} />
                  <span className="text-[9px] text-white/70 mt-0.5 font-medium leading-none">{ing.label}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4">
            <Link href="/menu">
              <AnimatedButton size="lg">
                Start Building
                <ArrowRight className="w-5 h-5" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Full-Width Banner ── */}
      <section ref={bannerRef} className="relative h-80 sm:h-96 overflow-hidden">
        <motion.div style={{ y: bannerY }} className="absolute inset-0 scale-110">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=90" alt="Crafted with passion" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">Crafted with Passion</h2>
            <p className="text-white/60 text-lg mt-3">Every pizza tells a story.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Loyalty Program ── */}
      <section className="py-20 bg-zinc-950 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-orange-500/30 p-8 sm:p-12"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 100%)" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(249,115,22,0.12),transparent_60%)]" />
            <div className="relative z-10 grid sm:grid-cols-2 gap-10 items-center">
              <div className="text-center sm:text-left">
                <Crown className="w-10 h-10 text-amber-400 mb-4" />
                <h2 className="text-3xl font-black text-white mb-3">Loyalty Rewards</h2>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Earn <span className="text-orange-400 font-bold">1 point</span> for every $1 spent. Redeem <span className="text-orange-400 font-bold">100 points</span> for $5 off your next order.
                </p>
                <div className="flex gap-3 flex-wrap justify-center sm:justify-start mb-6">
                  {[
                    { label: "Bronze", range: "0–500 pts", color: "from-amber-700 to-amber-800" },
                    { label: "Silver", range: "501–1000 pts", color: "from-zinc-400 to-zinc-500" },
                    { label: "Gold", range: "1000+ pts", color: "from-amber-400 to-yellow-500" },
                  ].map((tier) => (
                    <div key={tier.label} className={`px-3 py-1.5 rounded-lg bg-linear  -to-r ${tier.color} text-white text-xs font-bold`}>
                      {tier.label}
                      <span className="block text-white/70 font-normal">{tier.range}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register">
                  <AnimatedButton>
                    Join Now
                    <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-36 h-36 mx-auto rounded-full bg-linear-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                >
                  <div>
                    <Star className="w-16 h-16 text-white fill-white" />
                  </div>
                </motion.div>
                <p className="text-zinc-400 text-sm mt-4">Join 10,000+ rewards members</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Ready to Order?</h2>
            <p className="text-zinc-400 text-lg mb-8">Join thousands of pizza lovers getting the best delivery experience.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/menu"><AnimatedButton size="lg" className="text-base">Order Now <ArrowRight className="w-5 h-5" /></AnimatedButton></Link>
              <Link href="/register"><AnimatedButton size="lg" variant="outline" className="text-base border-zinc-600 text-zinc-300">Create Account</AnimatedButton></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">What People Say</h2>
          </motion.div>
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonial} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col items-center">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map((s) => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-lg text-zinc-700 dark:text-zinc-300 italic max-w-xl leading-relaxed mb-4">&quot;{TESTIMONIALS[currentTestimonial].text}&quot;</p>
                <div className="flex items-center gap-2">
                  <img src={TESTIMONIALS[currentTestimonial].avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{TESTIMONIALS[currentTestimonial].name}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setCurrentTestimonial(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentTestimonial ? "w-8 bg-orange-500" : "w-2 bg-zinc-300 dark:bg-zinc-600"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="py-20 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">From the Kitchen</p>
              <h2 className="text-4xl font-black text-white">Fresh from the Kitchen</h2>
            </div>
            <Link href="/blog"><AnimatedButton variant="ghost" size="sm" className="hidden md:flex text-zinc-300">All Posts <ArrowRight className="w-4 h-4" /></AnimatedButton></Link>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {BLOG_PREVIEWS.map((post, i) => (
              <motion.div key={post.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="group bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all cursor-pointer">
                <div className="relative overflow-hidden h-44">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-orange-500/90">{post.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">{post.title}</h3>
                  <div className="flex items-center justify-between mt-3 text-zinc-500 text-xs">
                    <span>{post.author}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/blog"><AnimatedButton>All Posts <ArrowRight className="w-4 h-4" /></AnimatedButton></Link>
          </div>
        </div>
      </section>

      {/* ── Press / As Seen In ── */}
      <section className="py-14 bg-zinc-900 border-t border-zinc-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">As Seen In</motion.p>
        </div>
        <div className="relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...PRESS, ...PRESS].map((name, i) => (
              <div key={i} className="inline-flex items-center px-6 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 text-sm font-semibold flex-shrink-0">
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
