"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Ordering", "Delivery", "Menu", "Account"];

const FAQS: Record<string, { q: string; a: string }[]> = {
  Ordering: [
    { q: "How do I place an order?", a: "Browse our menu, add items to your cart, proceed to checkout, enter your delivery address and payment details, then confirm. It takes less than 2 minutes!" },
    { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and cash on delivery." },
    { q: "Can I cancel or modify my order?", a: "You can cancel or modify an order within 5 minutes of placing it. After that, our kitchen begins preparation and changes may not be possible." },
    { q: "Is there a minimum order value?", a: "There is no minimum order value for pick-up. For delivery, the minimum is $12 to ensure your pizza arrives in optimal condition." },
    { q: "Can I schedule an order in advance?", a: "Yes! When checking out, select 'Schedule for later' and pick your preferred delivery time up to 7 days in advance." },
  ],
  Delivery: [
    { q: "How long does delivery take?", a: "Our average delivery time is 25–35 minutes. During peak hours (evenings & weekends) it may take up to 45 minutes. We always aim to beat the estimate!" },
    { q: "What areas do you deliver to?", a: "We deliver within a 5-mile radius of each of our 4 locations. Enter your address at checkout to confirm availability in your area." },
    { q: "How can I track my delivery?", a: "Once your order is confirmed, you'll receive a tracking link via SMS and email. You can also track it from the Order Tracking page in your account." },
    { q: "What if my pizza arrives cold?", a: "That should never happen, but if it does, contact us immediately. We'll send a replacement or issue a full refund — no questions asked." },
    { q: "Do you offer contactless delivery?", a: "Yes! Select 'Contactless Delivery' at checkout. Your driver will leave the order at your door and notify you via SMS." },
  ],
  Menu: [
    { q: "Are your ingredients fresh?", a: "Absolutely. We source fresh ingredients daily from local farms and specialty suppliers. Nothing in our kitchen is frozen or pre-made." },
    { q: "Do you cater to allergens?", a: "Each pizza page lists all ingredients and common allergens (gluten, dairy, nuts, etc.). Please inform us of severe allergies when ordering and we'll take extra precautions." },
    { q: "Can I customize my pizza?", a: "Yes! You can add or remove toppings, choose your size (Small, Medium, Large), and request extra sauce or cheese. Use the customization panel on each pizza's page." },
    { q: "Do you have vegan options?", a: "We have several vegan-friendly bases and toppings. Filter by 'Vegan' on our menu page to see all available options. Our vegan cheese is creamy and delicious!" },
    { q: "How often does the menu change?", a: "Our core menu stays consistent, but we introduce seasonal specials every 8–10 weeks to reflect the best ingredients of the season." },
  ],
  Account: [
    { q: "How do I create an account?", a: "Click 'Sign Up' in the top navigation, enter your name, email, and a password. That's it — takes about 20 seconds." },
    { q: "I forgot my password. What do I do?", a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a reset link within 2 minutes." },
    { q: "How does the loyalty points system work?", a: "You earn 1 point for every $1 spent. Accumulate 100 points and redeem them for $5 off your next order. Points never expire!" },
    { q: "Is my personal data safe?", a: "We take privacy seriously. Your data is encrypted, never sold to third parties, and you can request deletion at any time from your profile settings." },
    { q: "Can I have multiple delivery addresses?", a: "Yes! Save up to 5 delivery addresses in your profile for quick checkout. Perfect for ordering to home, work, or a friend's place." },
  ],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Ordering");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const allFaqs = useMemo(() =>
    Object.entries(FAQS).flatMap(([cat, items]) => items.map((item) => ({ ...item, category: cat }))),
    []
  );

  const displayItems = search.trim()
    ? allFaqs.filter((f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : FAQS[activeCategory];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.12),transparent_65%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">
            Help Center
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl sm:text-6xl font-black">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-zinc-400 text-lg mt-4">
            Everything you need to know about ordering, delivery, and our menu.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder="Search questions…"
              className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      {!search && (
        <section className="sticky top-16 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3">
          <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                    : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Accordion */}
      <section className="py-12 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {search && (
            <p className="text-zinc-500 text-sm mb-6">
              {displayItems.length} result{displayItems.length !== 1 ? "s" : ""} for &quot;{search}&quot;
            </p>
          )}

          <div className="space-y-3">
            <AnimatePresence>
              {(displayItems as { q: string; a: string; category?: string }[]).map((faq, i) => (
                <motion.div
                  key={`${faq.q}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${openIndex === i ? "border-orange-500/50" : "border-zinc-800 hover:border-zinc-600"}`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <div>
                      {faq.category && search && (
                        <span className="text-xs text-orange-400 font-medium mb-1 block">{faq.category}</span>
                      )}
                      <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {displayItems.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-zinc-500">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>No results for &quot;{search}&quot;</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl">
            <MessageCircle className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
            <p className="text-zinc-400 mb-6">Our team is available 7 days a week, 10am–11pm to help with anything you need.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
