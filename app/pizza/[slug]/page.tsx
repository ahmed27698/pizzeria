"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, Star, ChefHat, Leaf, Plus, Minus,
  CheckCircle2, ArrowLeft, Share2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/components/ui/animated-button";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatPrice, getPizzaPrice } from "@/lib/utils";
import type { Pizza, PizzaSize } from "@/types";

const SIZES: { key: PizzaSize; label: string; desc: string }[] = [
  { key: "SMALL", label: 'Small', desc: '8"' },
  { key: "MEDIUM", label: 'Medium', desc: '12"' },
  { key: "LARGE", label: 'Large', desc: '16"' },
];

export default function PizzaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<PizzaSize>("MEDIUM");
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/pizzas/${slug}`)
      .then((r) => r.json())
      .then((data) => { setPizza(data); setLoading(false); })
      .catch(() => setLoading(false));

    if (session) {
      fetch("/api/favorites").then((r) => r.json()).then((favs) => {
        setIsFav(favs.some((f: any) => f.pizza?.slug === slug));
      });
    }
  }, [slug, session]);

  async function handleAddToCart() {
    if (!session) { router.push("/login"); return; }
    setAddingToCart(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizzaId: pizza!.id, size, quantity, toppingIds: [] }),
    });
    setAddingToCart(false);
    if (res.ok) {
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2500);
    } else toast.error("Failed to add");
  }

  async function handleFavorite() {
    if (!session) { router.push("/login"); return; }
    const method = isFav ? "DELETE" : "POST";
    await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizzaId: pizza!.id }),
    });
    setIsFav(!isFav);
    toast.success(isFav ? "Removed from favorites" : "Saved to favorites");
  }

  async function submitReview() {
    if (!session || !userRating) return;
    setSubmittingReview(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizzaId: pizza!.id, rating: userRating, comment: reviewComment }),
    });
    if (res.ok) {
      toast.success("Review submitted!");
      setUserRating(0);
      setReviewComment("");
      const updated = await fetch(`/api/pizzas/${slug}`).then((r) => r.json());
      setPizza(updated);
    }
    setSubmittingReview(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <ChefHat className="w-10 h-10 text-orange-500" />
      </motion.div>
    </div>
  );

  if (!pizza) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold">Pizza not found</p>
      <Link href="/menu"><AnimatedButton>Back to Menu</AnimatedButton></Link>
    </div>
  );

  const price = getPizzaPrice(pizza, size);
  const totalPrice = price * quantity;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/menu" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-zinc-800 dark:to-zinc-900 aspect-square shadow-2xl">
              {!imgLoaded && (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800" />
              )}
              <motion.img
                src={pizza.image}
                alt={pizza.name}
                onLoad={() => setImgLoaded(true)}
                animate={{ scale: imgLoaded ? 1 : 1.05 }}
                className="w-full h-full object-cover"
              />
              {pizza.isFeatured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold rounded-full">
                  FEATURED
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center"
              >
                <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
              </motion.button>
            </div>

            {/* Thumbnail strip */}
            {pizza.reviews && pizza.reviews.length > 0 && (
              <div className="flex gap-2 mt-4">
                {[pizza.image, pizza.image].map((src, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-orange-400">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {pizza.category && (
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{pizza.category.name}</span>
            )}

            <div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">{pizza.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <RatingStars value={Math.round(pizza.avgRating ?? 0)} readonly size="sm" />
                <span className="text-sm text-zinc-500">
                  {(pizza.avgRating ?? 0).toFixed(1)} ({pizza._count?.reviews ?? 0} reviews)
                </span>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{pizza.description}</p>

            {/* Size Selector */}
            <div>
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">Choose Size</p>
              <div className="flex gap-3">
                {SIZES.map((s) => (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSize(s.key)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all ${
                      size === s.key
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <p className={`font-bold text-sm ${size === s.key ? "text-orange-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
                    <p className={`text-sm font-semibold mt-1 ${size === s.key ? "text-orange-500" : "text-zinc-600 dark:text-zinc-400"}`}>
                      {formatPrice(getPizzaPrice(pizza, s.key))}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Quantity</p>
              <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="w-8 text-center font-bold text-zinc-900 dark:text-zinc-50"
                >
                  {quantity}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.1, color: "#f97316" }}
                animate={{ scale: 1 }}
                className="ml-auto text-2xl font-black text-zinc-900 dark:text-zinc-50"
              >
                {formatPrice(totalPrice)}
              </motion.span>
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-2">
              <AnimatedButton
                onClick={handleAddToCart}
                loading={addingToCart}
                fullWidth
                className="text-base py-3.5"
              >
                {added ? (
                  <><CheckCircle2 className="w-5 h-5" /> Added!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </AnimatedButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.share?.({ title: pizza.name, url: window.location.href })}
                className="w-14 h-14 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-orange-500 hover:border-orange-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Tags */}
            {pizza.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {pizza.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8">
            {(["details", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab ? "text-orange-500" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab} {tab === "reviews" && `(${pizza._count?.reviews ?? 0})`}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" ? (
              <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-500" /> Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pizza.ingredients?.map((ing) => (
                        <span key={ing} className="px-3 py-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full text-sm border border-green-200 dark:border-green-800">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Submit Review */}
                {session && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-8">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4">Write a Review</h3>
                    <RatingStars value={userRating} onChange={setUserRating} size="lg" />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={3}
                      className="w-full mt-4 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 resize-none"
                    />
                    <AnimatedButton onClick={submitReview} loading={submittingReview} className="mt-3" disabled={!userRating}>
                      Submit Review
                    </AnimatedButton>
                  </div>
                )}

                <div className="space-y-4">
                  {pizza.reviews?.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {review.user?.image ? (
                          <img src={review.user.image} alt="" className="w-9 h-9 rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-sm font-bold">
                            {review.user?.name?.[0] ?? "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{review.user?.name}</p>
                          <RatingStars value={review.rating} readonly size="sm" />
                        </div>
                        <span className="ml-auto text-xs text-zinc-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>}
                    </motion.div>
                  ))}
                  {(!pizza.reviews || pizza.reviews.length === 0) && (
                    <div className="text-center py-12 text-zinc-400">
                      <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No reviews yet. Be the first!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
