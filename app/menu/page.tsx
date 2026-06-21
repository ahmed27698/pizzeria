"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Pizza as PizzaIcon } from "lucide-react";
import { PizzaCard } from "@/components/ui/pizza-card";
import { PizzaCardSkeleton } from "@/components/ui/skeleton";
import { CategoryChip } from "@/components/ui/category-chip";
import { SearchBar } from "@/components/ui/search-bar";
import { AnimatedButton } from "@/components/ui/animated-button";
import type { Pizza, Category } from "@/types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low" },
  { value: "price-desc", label: "Price: High" },
  { value: "rating", label: "Top Rated" },
];

export default function MenuPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const fetchPizzas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (search) params.set("search", search);

    let data: { pizzas?: any[]; pages?: number; total?: number } = {};
    try {
      const r = await fetch(`/api/pizzas?${params}`);
      if (r.ok) data = await r.json();
    } catch {
      setLoading(false);
      return;
    }
    let sorted = [...(data.pizzas || [])];
    if (sort === "price-asc") sorted.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === "price-desc") sorted.sort((a, b) => b.basePrice - a.basePrice);
    else if (sort === "rating") sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

    setPizzas(sorted);
    setTotalPages(data.pages || 1);
    setTotal(data.total || 0);
    setLoading(false);

    if (search) setSuggestions(sorted.slice(0, 5).map((p) => ({ id: p.id, name: p.name, slug: p.slug, image: p.image })));
    else setSuggestions([]);
  }, [activeCategory, search, sort, page]);

  useEffect(() => {
    const t = setTimeout(fetchPizzas, 300);
    return () => clearTimeout(t);
  }, [fetchPizzas]);

  useEffect(() => { setPage(1); }, [activeCategory, search, sort]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-white mb-3"
          >
            Our <span className="text-orange-500">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mb-8"
          >
            {total} handcrafted pizzas to choose from
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <SearchBar value={search} onChange={setSearch} suggestions={suggestions} />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <CategoryChip label="All" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.name}
                active={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              />
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sort === opt.value
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700"
              >
                <X className="w-3.5 h-3.5" /> Clear search
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {Array(12).fill(0).map((_, i) => <PizzaCardSkeleton key={i} />)}
            </motion.div>
          ) : pizzas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 mb-4 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center"><PizzaIcon className="w-8 h-8 text-orange-500" /></div>
              <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-2">No pizzas found</h3>
              <p className="text-zinc-500">Try adjusting your filters or search.</p>
              <AnimatedButton variant="secondary" className="mt-6" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                Clear Filters
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {pizzas.map((pizza, i) => (
                <PizzaCard key={pizza.id} pizza={pizza} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </AnimatedButton>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    p === page
                      ? "bg-orange-500 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight className="w-4 h-4" />
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
}
