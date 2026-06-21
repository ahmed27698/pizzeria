"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => { setCategories(d); setLoading(false); });
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: slugify(form.name) }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, cat]);
      setForm({ name: "", description: "" });
      toast.success("Category created!");
    } else toast.error("Failed to create");
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8">Categories</h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        {/* List */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50">{categories.length} Categories</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <AnimatePresence>
              {loading
                ? Array(4).fill(0).map((_, i) => (
                    <div key={i} className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3 animate-pulse" />
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))
                : categories.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{cat.name}</p>
                        <p className="text-xs text-zinc-500">{cat._count?.pizzas ?? 0} pizzas · /{cat.slug}</p>
                      </div>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Form */}
        <form onSubmit={addCategory} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 h-fit">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" /> Add Category
          </h2>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Vegan Specials" required
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description..." rows={3}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:border-orange-500 resize-none" />
          </div>
          <AnimatedButton type="submit" loading={saving} fullWidth>
            <Plus className="w-4 h-4" /> Create Category
          </AnimatedButton>
        </form>
      </div>
    </div>
  );
}
