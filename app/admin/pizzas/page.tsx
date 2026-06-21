"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminPizzasPage() {
  const [pizzas, setPizzas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pizzas?limit=50")
      .then((r) => r.json())
      .then((d) => { setPizzas(d.pizzas || []); setLoading(false); });
  }, []);

  async function deletePizza(id: string) {
    if (!confirm("Delete this pizza?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/pizzas/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPizzas((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pizza deleted");
    } else toast.error("Failed to delete");
    setDeletingId(null);
  }

  const filtered = pizzas.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Pizzas</h1>
          <p className="text-zinc-500 mt-1">{pizzas.length} total</p>
        </div>
        <Link href="/admin/pizzas/add">
          <AnimatedButton>
            <Plus className="w-4 h-4" /> Add Pizza
          </AnimatedButton>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pizzas..."
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:border-orange-500"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {["Pizza", "Category", "Price", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {(loading ? Array(8).fill(null) : filtered).map((pizza, i) => (
                  <motion.tr
                    key={pizza?.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {loading ? (
                      Array(6).fill(0).map((_, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                        </td>
                      ))
                    ) : (
                      <>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={pizza.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{pizza.name}</p>
                              <p className="text-xs text-zinc-400 truncate max-w-[180px]">{pizza.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{pizza.category?.name}</td>
                        <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-zinc-50">{formatPrice(pizza.basePrice)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${pizza.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {pizza.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {pizza.isFeatured ? <ToggleRight className="w-5 h-5 text-orange-500" /> : <ToggleLeft className="w-5 h-5 text-zinc-400" />}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <Link href={`/pizza/${pizza.slug}`} target="_blank">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </Link>
                            <Link href={`/admin/pizzas/${pizza.id}/edit`}>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => deletePizza(pizza.id)}
                              disabled={deletingId === pizza.id}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
