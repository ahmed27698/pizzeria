"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Clock, Send, CheckCircle, ExternalLink, Camera, Hash, Share2 } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

const SUBJECTS = ["General Inquiry", "Order Support", "Catering Request", "Feedback", "Partnership", "Other"];

const SOCIALS = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Hash, label: "Twitter / X", href: "#" },
  { icon: Share2, label: "Facebook", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.15),transparent_70%)]" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl sm:text-6xl font-black"
          >
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Hear
            </span>{" "}
            from You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 text-lg mt-5 leading-relaxed"
          >
            Questions, feedback, catering inquiries — we&apos;re always here and happy to help.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-5"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-zinc-400">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-orange-400 hover:text-orange-300 text-sm font-medium"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
                    >
                      <option value="">Select a topic…</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help…"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all resize-none"
                    />
                  </div>

                  <AnimatedButton type="submit" loading={loading} fullWidth className="py-3.5">
                    <Send className="w-4 h-4" />
                    Send Message
                  </AnimatedButton>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Info cards */}
            {[
              { icon: MapPin, label: "Visit Us", value: "123 Olive Street, Naples District", sub: "Ground Floor, The Hearth Building" },
              { icon: Phone, label: "Call Us", value: "+1 (555) PIZZA-NOW", sub: "+1 (555) 749-9266" },
              { icon: Clock, label: "Opening Hours", value: "Mon – Sun: 10:00am – 11:00pm", sub: "Kitchen closes 30 min before closing" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex gap-4 p-5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-0.5">{card.label}</p>
                  <p className="font-bold text-white">{card.value}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{card.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative h-52 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
            >
              {/* Grid pattern map */}
              <div className="absolute inset-0"
                style={{
                  backgroundImage: "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)",
                  backgroundSize: "32px 32px"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-900/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-orange-500/40">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500/30 mt-1 blur-sm" />
                </motion.div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-lg">123 Olive St</span>
              </div>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3"
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl text-sm text-zinc-400 hover:text-orange-400 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
