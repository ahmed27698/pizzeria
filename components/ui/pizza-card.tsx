"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import type { Pizza } from "@/types";

interface PizzaCardProps {
  pizza: Pizza;
  onFavoriteToggle?: (pizzaId: string, isFav: boolean) => void;
  isFavorite?: boolean;
  index?: number;
}

export function PizzaCard({ pizza, onFavoriteToggle, isFavorite = false, index = 0 }: PizzaCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [fav, setFav] = useState(isFavorite);
  const [favLoading, setFavLoading] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);

  const avgRating = pizza.avgRating ?? 0;
  const reviewCount = pizza._count?.reviews ?? 0;

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setFavLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: fav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pizzaId: pizza.id }),
      });
      if (res.ok) {
        setFav(!fav);
        onFavoriteToggle?.(pizza.id, !fav);
        toast.success(fav ? "Removed from favorites" : "Added to favorites");
      }
    } finally {
      setFavLoading(false);
    }
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pizzaId: pizza.id, size: "MEDIUM", quantity: 1, toppingIds: [] }),
      });
      if (res.ok) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-shadow"
    >
      <Link href={`/pizza/${pizza.slug}`}>
        {/* Image */}
        <div
          className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-zinc-800 dark:to-zinc-900"
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <motion.img
            src={pizza.image}
            alt={pizza.name}
            animate={{ scale: imageHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {pizza.isFeatured && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-md"
              >
                FEATURED
              </motion.span>
            )}
            {!pizza.isAvailable && (
              <span className="px-2.5 py-0.5 bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-full">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Favorite */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleFavorite}
            disabled={favLoading}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center shadow-md disabled:opacity-50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-zinc-500"}`}
            />
          </motion.button>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: imageHovered ? 1 : 0, y: imageHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 inset-x-3 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </motion.button>
            <span className="flex items-center justify-center w-9 h-9 bg-white/90 dark:bg-zinc-800/90 rounded-xl text-zinc-700 dark:text-zinc-300">
              <Eye className="w-4 h-4" />
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          {pizza.category && (
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">
              {pizza.category.name}
            </span>
          )}
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg leading-tight mt-0.5 group-hover:text-orange-500 transition-colors">
            {pizza.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{pizza.description}</p>

          <div className="flex items-center justify-between mt-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
                />
              ))}
              <span className="text-[10px] text-zinc-500 ml-1">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {formatPrice(pizza.basePrice)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
