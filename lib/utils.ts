import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PizzaSize } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getPizzaPrice(
  pizza: { basePrice: number; smallPrice?: number | null; mediumPrice?: number | null; largePrice?: number | null },
  size: PizzaSize
): number {
  if (size === "SMALL") return pizza.smallPrice ?? pizza.basePrice * 0.8;
  if (size === "LARGE") return pizza.largePrice ?? pizza.basePrice * 1.3;
  return pizza.mediumPrice ?? pizza.basePrice;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export const ORDER_STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "BAKING", label: "Baking" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

export function getStatusStep(status: string): number {
  return ORDER_STATUS_STEPS.findIndex((s) => s.key === status);
}
