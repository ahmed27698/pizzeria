"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suggestions?: { id: string; name: string; slug: string; image: string }[];
}

export function SearchBar({ value, onChange, placeholder = "Search pizzas...", suggestions = [] }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <motion.div
        animate={{ scale: focused ? 1.01 : 1 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white dark:bg-zinc-900 transition-all ${
          focused
            ? "border-orange-500 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/20"
            : "border-zinc-200 dark:border-zinc-700"
        }`}
      >
        <Search className={`w-5 h-5 transition-colors ${focused ? "text-orange-500" : "text-zinc-400"}`} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 outline-none text-sm"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => { onChange(""); inputRef.current?.focus(); }}
              className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500"
            >
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden z-50"
          >
            {suggestions.slice(0, 5).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/pizza/${s.slug}`}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <img src={s.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{s.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
