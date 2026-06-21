"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  pizzaId: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  quantity: number;
  price: number;
  pizza: {
    id: string;
    name: string;
    image: string;
    slug: string;
  };
  toppings: { topping: { id: string; name: string; price: number } }[];
}

export function useCart() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, itemCount, total, loading, refresh: fetchCart };
}
