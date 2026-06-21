"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PizzaCard } from "@/components/ui/pizza-card";
import { PizzaCardSkeleton } from "@/components/ui/skeleton";
import type { Pizza } from "@/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        setFavorites(data.map((f: any) => ({
          ...f.pizza,
          avgRating: f.pizza.reviews?.length
            ? f.pizza.reviews.reduce((s: number, r: any) => s + r.rating, 0) / f.pizza.reviews.length
            : 0,
        })));
        setLoading(false);
      });
  }, []);

  function handleUnfav(pizzaId: string) {
    setFavorites((prev) => prev.filter((p) => p.id !== pizzaId));
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Favorites
        </h1>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => <PizzaCardSkeleton key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto mb-4 text-zinc-200 dark:text-zinc-700" />
            <h2 className="text-xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">No favorites yet</h2>
            <p className="text-zinc-500 mb-8">Heart a pizza to save it here</p>
            <Link href="/menu"><AnimatedButton>Browse Menu</AnimatedButton></Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((pizza, i) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                index={i}
                isFavorite
                onFavoriteToggle={(id, isFav) => { if (!isFav) handleUnfav(id); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
