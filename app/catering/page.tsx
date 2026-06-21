"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, Phone, Calendar, ChefHat, Truck, ClipboardList, Star, ArrowRight, PartyPopper } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

const PACKAGES = [
  {
    name: "Basic",
    subtitle: "Perfect for small gatherings",
    price: "$299",
    capacity: "Up to 20 people",
    features: ["3 pizza choices", "Paper plates & napkins", "1 hour setup time", "Delivery included", "Basic toppings bar"],
    color: "from-zinc-600 to-zinc-700",
    badge: null,
  },
  {
    name: "Premium",
    subtitle: "Our most popular package",
    price: "$699",
    capacity: "Up to 50 people",
    features: ["8 pizza choices", "Real plates & cutlery", "2 hours setup & service", "Dedicated server", "Full toppings bar", "Garlic bread & salad", "Delivery included"],
    color: "from-orange-500 to-red-600",
    badge: "Most Popular",
  },
  {
    name: "Elite",
    subtitle: "The full Pizzeria experience",
    price: "$1,299",
    capacity: "Up to 100 people",
    features: ["Full menu access", "Premium tableware", "3-hour full service", "Dedicated chef & staff", "Dessert selection", "Drinks package", "Setup & breakdown", "Event coordinator"],
    color: "from-amber-500 to-orange-600",
    badge: "Best Value",
  },
];

const HOW_IT_WORKS = [
  { icon: Phone, step: "01", title: "Contact Us", desc: "Call or fill out our form with your event details." },
  { icon: ClipboardList, step: "02", title: "Plan the Menu", desc: "Work with our chef to design your perfect pizza spread." },
  { icon: ChefHat, step: "03", title: "We Prepare", desc: "Our team preps everything fresh on the day of your event." },
  { icon: Truck, step: "04", title: "We Deliver & Set Up", desc: "Arrive, set up, serve — you just enjoy the party." },
];

const EVENTS = [
  { name: "TechCorp Annual Lunch", type: "Corporate Event", guests: 80, date: "March 2024", rating: 5 },
  { name: "The Martinez Wedding", type: "Wedding Reception", guests: 120, date: "June 2024", rating: 5 },
  { name: "Emma's 30th Birthday", type: "Birthday Party", guests: 35, date: "August 2024", rating: 5 },
];

export default function CateringPage() {
  const [form, setForm] = useState({ eventType: "", date: "", guests: "", requests: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(249,115,22,0.18),transparent_65%)]" />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ width: `${100 + i * 60}px`, height: `${100 + i * 60}px`, background: "rgba(249,115,22,0.15)", left: `${20 + i * 30}%`, top: `${30 + i * 10}%` }}
          />
        ))}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">
            Event Catering
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl sm:text-7xl font-black leading-tight">
            Feed the{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Crowd
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-zinc-400 text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            From intimate dinners to 100-person corporate events, we bring the full Pizzeria experience to your venue. Fresh, hot, and unforgettable.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
            <a href="#inquiry">
              <AnimatedButton size="lg">
                <Users className="w-4 h-4" />
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Packages</p>
            <h2 className="text-4xl font-black">Choose Your Package</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all ${
                  pkg.badge === "Most Popular"
                    ? "border-orange-500/60 shadow-2xl shadow-orange-500/20"
                    : "border-zinc-800 hover:border-orange-500/30"
                } bg-zinc-900`}
              >
                {pkg.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pkg.color}`}>
                    {pkg.badge}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pkg.color} p-6`}>
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{pkg.subtitle}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                    <span className="text-white/60 text-sm ml-2">starting</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Users className="w-4 h-4 text-white/70" />
                    <span className="text-white/80 text-sm">{pkg.capacity}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#inquiry" className="mt-6 block">
                    <AnimatedButton fullWidth variant={pkg.badge === "Most Popular" ? "primary" : "secondary"}>
                      Get Quote
                    </AnimatedButton>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-900 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-4xl font-black">How It Works</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-zinc-800 border border-zinc-700 hover:border-orange-500/40 rounded-2xl transition-all"
              >
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-orange-500 font-mono text-sm font-bold mb-2">{step.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Portfolio</p>
            <h2 className="text-4xl font-black">Events We&apos;ve Catered</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(event.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h3 className="font-bold text-white text-lg">{event.name}</h3>
                <p className="text-orange-400 text-sm font-medium mt-1">{event.type}</p>
                <div className="flex items-center gap-4 mt-3 text-zinc-500 text-sm">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{event.guests} guests</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{event.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-20 bg-zinc-900 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Get Started</p>
            <h2 className="text-4xl font-black">Request a Quote</h2>
            <p className="text-zinc-400 mt-3">We&apos;ll get back to you within 2 hours.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 mb-4 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <PartyPopper className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Inquiry Received!</h3>
                  <p className="text-zinc-400">Our catering team will contact you within 2 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Event Type</label>
                      <select name="eventType" value={form.eventType} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm">
                        <option value="">Select type…</option>
                        {["Corporate Event", "Wedding", "Birthday Party", "Anniversary", "School Event", "Other"].map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Event Date</label>
                      <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Expected Guest Count</label>
                    <input type="number" name="guests" value={form.guests} onChange={handleChange} required min="10" placeholder="e.g. 50" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Special Requests</label>
                    <textarea name="requests" value={form.requests} onChange={handleChange} rows={4} placeholder="Dietary restrictions, venue info, theme…" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 text-sm resize-none" />
                  </div>
                  <AnimatedButton type="submit" loading={loading} fullWidth className="py-3.5">
                    Submit Inquiry
                    <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
