"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Mail, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";

const TAGS = ["All", "Recipes", "Behind the Scenes", "Tips & Tricks", "History"];

const POSTS = [
  {
    title: "The Art of Neapolitan Pizza: A Deep Dive",
    excerpt: "True Neapolitan pizza is more than food — it's a UNESCO-protected cultural tradition. We explore what makes it iconic.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    tag: "History",
    author: "Chef Marco Rossi",
    authorImg: "https://i.pravatar.cc/40?img=52",
    readTime: "8 min",
    date: "Jun 12, 2025",
    featured: true,
  },
  {
    title: "5 Secrets to the Perfect Pizza Dough",
    excerpt: "From hydration levels to fermentation time, here's everything you need to know about dough that rises and bakes like a dream.",
    image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&q=80",
    tag: "Recipes",
    author: "Chef Sofia Chen",
    authorImg: "https://i.pravatar.cc/40?img=47",
    readTime: "5 min",
    date: "May 29, 2025",
    featured: true,
  },
  {
    title: "Wood-Fired vs. Conventional Oven: The Real Difference",
    excerpt: "Can a home oven replicate the magic of a 900°F wood-fired kiln? We put it to the test — the results surprised us.",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80",
    tag: "Tips & Tricks",
    author: "Chef Marco Rossi",
    authorImg: "https://i.pravatar.cc/40?img=52",
    readTime: "4 min",
    date: "May 18, 2025",
    featured: false,
  },
  {
    title: "Seasonal Ingredients: Why We Change Our Menu",
    excerpt: "Every season, our menu evolves. Here's the philosophy behind ingredient-driven cooking and why it makes your pizza better.",
    image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&q=80",
    tag: "Behind the Scenes",
    author: "Chef Priya Sharma",
    authorImg: "https://i.pravatar.cc/40?img=32",
    readTime: "3 min",
    date: "May 5, 2025",
    featured: false,
  },
  {
    title: "The History of Pizza: From Naples to Your Door",
    excerpt: "A journey from 18th-century street food in Naples to the global phenomenon that feeds billions. Pizza's story is incredible.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    tag: "History",
    author: "Team Pizzeria",
    authorImg: "https://i.pravatar.cc/40?img=11",
    readTime: "10 min",
    date: "Apr 22, 2025",
    featured: false,
  },
  {
    title: "How to Pair Wine with Pizza",
    excerpt: "Chianti with Margherita, Pinot Noir with BBQ Chicken — the sommelier's guide to elevating pizza night.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    tag: "Tips & Tricks",
    author: "Chef Ahmed Al-Rashid",
    authorImg: "https://i.pravatar.cc/40?img=65",
    readTime: "6 min",
    date: "Apr 10, 2025",
    featured: false,
  },
];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filtered = activeTag === "All" ? POSTS : POSTS.filter((p) => p.tag === activeTag);
  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.12),transparent_65%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">
            Pizza Knowledge
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-5xl sm:text-6xl font-black">
            The{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Kitchen
            </span>{" "}
            Blog
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-zinc-400 text-lg mt-4">
            Recipes, stories, secrets, and everything pizza from our kitchen to yours.
          </motion.p>
        </div>
      </section>

      {/* Tags */}
      <section className="sticky top-16 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {TAGS.map((tag) => (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Featured posts (2-col) */}
          {featured.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {featured.map((post, i) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-3xl overflow-hidden cursor-pointer transition-all"
                >
                  <div className="relative overflow-hidden h-56">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-600">
                      {post.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">{post.title}</h2>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <img src={post.authorImg} alt={post.author} className="w-6 h-6 rounded-full" />
                        <span className="text-zinc-400 text-xs">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 text-xs">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Regular posts (4-col) */}
          {regular.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {regular.map((post, i) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + featured.length) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all"
                >
                  <div className="relative overflow-hidden h-36">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-orange-500/90">
                      {post.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">{post.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <img src={post.authorImg} alt={post.author} className="w-5 h-5 rounded-full" />
                        <span className="text-zinc-500 text-xs">{post.author.split(" ")[0]}</span>
                      </div>
                      <span className="text-zinc-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-zinc-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No posts in this category yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-zinc-900 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Mail className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">Fresh Posts in Your Inbox</h2>
            <p className="text-zinc-400 mb-6">Get weekly recipes, chef tips, and exclusive offers delivered straight to you.</p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-green-400 font-medium">
                  <CheckCircle2 className="w-5 h-5" /> You&apos;re subscribed! Welcome to the Pizzeria family.
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <AnimatedButton type="submit">
                    Subscribe
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
