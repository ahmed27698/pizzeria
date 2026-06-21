"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const CATEGORIES = ["All", "Classics", "Specials", "Behind the Scenes"];

const PHOTOS = [
  { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", category: "Classics", label: "Margherita Classic" },
  { url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", category: "Specials", label: "Chef's Special" },
  { url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", category: "Classics", label: "New York Style" },
  { url: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600&q=80", category: "Behind the Scenes", label: "Fresh Dough" },
  { url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=80", category: "Specials", label: "Truffle Mushroom" },
  { url: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80", category: "Classics", label: "Pepperoni Feast" },
  { url: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80", category: "Behind the Scenes", label: "Stone Oven" },
  { url: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80", category: "Specials", label: "BBQ Chicken" },
  { url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80", category: "Classics", label: "Four Cheese" },
  { url: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80", category: "Behind the Scenes", label: "Ingredient Prep" },
  { url: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&q=80", category: "Specials", label: "Veggie Supreme" },
  { url: "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=600&q=80", category: "Classics", label: "Traditional Slice" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? PHOTOS : PHOTOS.filter((p) => p.category === activeCategory);

  function prev() {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }

  function next() {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % filtered.length);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 px-4">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">Visual Feast</p>
          <h1 className="text-5xl sm:text-6xl font-black">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto">
            A glimpse into our kitchen, our craft, and every mouth-watering creation.
          </p>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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

      {/* Masonry Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            <AnimatePresence>
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.url}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative group break-inside-avoid cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "16/9" : "1/1" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-orange-400 bg-orange-500/20 px-2.5 py-1 rounded-full">{photo.category}</span>
                        <p className="text-white font-semibold mt-1.5">{photo.label}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="max-w-4xl max-h-[85vh] mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].url.replace("w=600", "w=1200")}
                alt={filtered[lightbox].label}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center mt-4">
                <span className="text-xs text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">{filtered[lightbox].category}</span>
                <p className="text-white font-semibold mt-2">{filtered[lightbox].label}</p>
                <p className="text-zinc-500 text-sm mt-1">{lightbox + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
