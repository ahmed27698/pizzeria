"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

export function RatingStars({ value, onChange, readonly = false, size = "md" }: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const active = s <= (hovered || value);
        return (
          <motion.button
            key={s}
            type="button"
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.85 } : {}}
            onClick={() => !readonly && onChange?.(s)}
            onMouseEnter={() => !readonly && setHovered(s)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={readonly ? "cursor-default" : "cursor-pointer"}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                active ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-600"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
