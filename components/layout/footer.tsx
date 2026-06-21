"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pizza, Camera, Hash, Share2, Play, ArrowUp, Mail, MapPin, Phone, Clock } from "lucide-react";

const LINKS_EXPLORE = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
];

const LINKS_SERVICES = [
  { href: "/catering", label: "Catering" },
  { href: "/locations", label: "Locations" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/order-history", label: "My Orders" },
];

const SOCIALS = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Hash, href: "#", label: "Twitter / X" },
  { icon: Share2, href: "#", label: "Facebook" },
  { icon: Play, href: "#", label: "YouTube" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Pizza className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Pizzeria
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Handcrafted pizzas made with passion, baked in stone-fired ovens, and delivered fresh to your door since 2015.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-orange-500 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Explore</h3>
            <ul className="space-y-3">
              {LINKS_EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-400 hover:text-orange-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Services</h3>
            <ul className="space-y-3">
              {LINKS_SERVICES.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-400 hover:text-orange-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact + Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Stay in Touch</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                123 Olive Street, Naples District
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                +1 (555) PIZZA-NOW
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                Mon–Sun: 10am – 11pm
              </div>
            </div>
            <p className="text-xs text-zinc-500 mb-2">Get deals &amp; updates in your inbox</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-3 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white text-sm font-semibold"
              >
                Join
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <p className="text-zinc-500 text-xs">© 2025 Pizzeria. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
              <span key={p} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 text-[10px] font-medium">
                {p}
              </span>
            ))}
          </div>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-orange-500 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
