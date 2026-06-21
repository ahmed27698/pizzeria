"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Star, Users, BookOpen, ChefHat, Leaf, Award, Clock } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

const TIMELINE = [
  { year: "2015", title: "The Beginning", desc: "Founded in a small Naples-inspired kitchen with a single wood-fired oven and a dream to share authentic Italian pizza with the world." },
  { year: "2017", title: "1,000 Happy Customers", desc: "Word spread fast. Our first 1,000 loyal customers helped us grow from a local secret to a neighborhood staple." },
  { year: "2019", title: "The Stone Oven Upgrade", desc: "Invested in a 900°F custom-built stone oven, elevating every crust to crispy-charred perfection — the real Neapolitan way." },
  { year: "2022", title: "Online Ordering Launched", desc: "Brought the full Pizzeria experience online so customers could order premium pizza from the comfort of home." },
  { year: "2025", title: "AI-Powered Pizzeria", desc: "Integrated intelligent recommendations and real-time tracking so every order is smarter, faster, and more personal than ever." },
];

const TEAM = [
  { name: "Chef Marco Rossi", role: "Head Chef & Founder", bio: "Trained in Naples under Maestro Giovanni, Marco brings 20 years of authentic Italian craft to every pie.", gradient: "from-orange-500 to-red-600", initials: "MR" },
  { name: "Chef Sofia Chen", role: "Pastry & Desserts", bio: "Sofia blends Asian precision with Italian soul — her tiramisu is the stuff of legend.", gradient: "from-pink-500 to-rose-600", initials: "SC" },
  { name: "Chef Ahmed Al-Rashid", role: "Sous Chef", bio: "Ahmed's bold spice intuition turned our Spicy Diablo into our best-selling pizza three years running.", gradient: "from-amber-500 to-orange-600", initials: "AA" },
  { name: "Chef Priya Sharma", role: "Head of Innovation", bio: "Priya dreams up our seasonal specials and ensures every new recipe earns its place on the menu.", gradient: "from-violet-500 to-purple-600", initials: "PS" },
];

const VALUES = [
  { icon: Leaf, title: "Quality Ingredients", desc: "We source only the finest local and imported ingredients. No shortcuts, no compromises." },
  { icon: Heart, title: "Made with Passion", desc: "Every pizza is a labor of love — from hand-stretched dough to freshly grated cheese." },
  { icon: Users, title: "Community First", desc: "We're not just a restaurant. We're a gathering place, a celebration, a shared table." },
];

const STATS = [
  { icon: BookOpen, value: "50+", label: "Signature Recipes" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: Clock, value: "9 yrs", label: "In Business" },
  { icon: Award, value: "10k+", label: "Orders Delivered" },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-x-hidden bg-zinc-950 text-white">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(249,115,22,0.18),transparent_70%)]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] rounded-full border border-orange-500/10 border-dashed"
        />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-4 pt-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4"
          >
            Since 2015
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-7xl font-black leading-tight"
          >
            Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Story
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            A family dream, a love for authentic Italian craft, and a belief that great pizza
            changes everything. This is the story of Pizzeria.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Story ── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">The Beginning</p>
            <h2 className="text-4xl font-black mb-6">Italian Heritage, Global Heart</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                It started in a small apartment kitchen in Naples. Chef Marco Rossi had spent years
                perfecting the art of Neapolitan pizza — learning the exact hydration of the dough,
                the precise temperature of the oven, the perfect balance of San Marzano tomatoes and
                fresh mozzarella.
              </p>
              <p>
                When Marco moved abroad, he carried that knowledge with him. What began as cooking
                for friends quickly became a community obsession. In 2015, with the support of his
                family and a borrowed stone oven, Pizzeria was born.
              </p>
              <p>
                Today, we serve thousands of customers but the philosophy remains the same: every
                pizza deserves to be made with the same care and pride as if it were the first one.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/menu">
                <AnimatedButton size="lg">Taste Our Story</AnimatedButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 border border-orange-500/20">
              <img
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
                alt="Our kitchen"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl px-6 py-4 shadow-2xl"
            >
              <p className="text-2xl font-black text-white">2015</p>
              <p className="text-white/80 text-sm">Year Founded</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl font-black">Milestones That Made Us</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/80 via-orange-500/30 to-transparent sm:-translate-x-px" />
            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`relative flex items-start gap-8 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  <div className={`sm:w-1/2 pl-16 sm:pl-0 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 rounded-2xl p-6 transition-all">
                      <p className="text-orange-500 font-black text-xl mb-1">{item.year}</p>
                      <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-zinc-900 shadow-lg shadow-orange-500/40" />
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">The People</p>
            <h2 className="text-4xl font-black">Meet the Team</h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Behind every perfect pizza is a person who cares deeply about the craft.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl font-black text-white shadow-xl mb-4`}
                >
                  {member.initials}
                </motion.div>
                <h3 className="font-bold text-white text-lg">{member.name}</h3>
                <p className="text-orange-400 text-sm font-medium mt-1 mb-3">{member.role}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-4xl font-black">Our Core Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-zinc-800 border border-zinc-700 hover:border-orange-500/40 text-center transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.15 }}
                  className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/30"
                >
                  <v.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
              <p className="text-4xl font-black text-white">{s.value}</p>
              <p className="text-white/75 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-zinc-950 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4"
        >
          <ChefHat className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-4">Ready to Taste the Difference?</h2>
          <p className="text-zinc-400 mb-8">Every bite tells our story. Come experience it for yourself.</p>
          <Link href="/menu">
            <AnimatedButton size="lg">Order Now</AnimatedButton>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
