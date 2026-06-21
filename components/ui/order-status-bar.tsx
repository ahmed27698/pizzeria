"use client";

import { motion } from "framer-motion";
import { Check, Clock, ChefHat, Flame, Bike, CheckCircle2 } from "lucide-react";
import { ORDER_STATUS_STEPS, getStatusStep } from "@/lib/utils";

const icons = [Clock, ChefHat, Flame, Bike, CheckCircle2];

interface OrderStatusBarProps {
  status: string;
}

export function OrderStatusBar({ status }: OrderStatusBarProps) {
  const currentStep = getStatusStep(status);

  return (
    <div className="relative">
      {/* Track */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-zinc-200 dark:bg-zinc-700 z-0">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.max(0, (currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100)}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="relative z-10 flex justify-between">
        {ORDER_STATUS_STEPS.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          const Icon = icons[i];
          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  active
                    ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 0px rgba(249,115,22,0)", "0 0 0 8px rgba(249,115,22,0.2)", "0 0 0 0px rgba(249,115,22,0)"] }
                    : {}
                }
                transition={{ duration: 2, repeat: active ? Infinity : 0 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  done
                    ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                {done && i < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
              <span
                className={`text-xs font-medium text-center ${
                  done ? "text-orange-500" : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
