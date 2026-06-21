"use client";

import { motion } from "framer-motion";

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function CategoryChip({ label, active = false, onClick, icon }: CategoryChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border whitespace-nowrap cursor-pointer ${
        active
          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg shadow-orange-500/30"
          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-orange-400 hover:text-orange-500"
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
