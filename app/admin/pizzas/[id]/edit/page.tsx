"use client";

import { useEffect, useState, use } from "react";
import { PizzaForm } from "@/components/admin/pizza-form";

export default function EditPizzaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pizza, setPizza] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pizzas/${id}`).then((r) => r.json()).then((d) => { setPizza(d); setLoading(false); });
  }, [id]);

  if (loading) return <div className="h-64 flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!pizza) return <div>Pizza not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8">Edit Pizza</h1>
      <PizzaForm initialData={pizza} pizzaId={id} />
    </div>
  );
}
