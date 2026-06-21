"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X, Plus } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

interface PizzaFormProps {
  initialData?: any;
  pizzaId?: string;
}

export function PizzaForm({ initialData, pizzaId }: PizzaFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    basePrice: initialData?.basePrice || "",
    smallPrice: initialData?.smallPrice || "",
    mediumPrice: initialData?.mediumPrice || "",
    largePrice: initialData?.largePrice || "",
    categoryId: initialData?.categoryId || "",
    ingredients: initialData?.ingredients || [] as string[],
    tags: initialData?.tags || [] as string[],
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  function update(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "name" && !pizzaId) setForm((f) => ({ ...f, [key]: value, slug: slugify(value) }));
  }

  function addIngredient() {
    if (ingredientInput.trim() && !form.ingredients.includes(ingredientInput.trim())) {
      setForm((f) => ({ ...f, ingredients: [...f.ingredients, ingredientInput.trim()] }));
      setIngredientInput("");
    }
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, basePrice: Number(form.basePrice), smallPrice: form.smallPrice ? Number(form.smallPrice) : null, mediumPrice: form.mediumPrice ? Number(form.mediumPrice) : null, largePrice: form.largePrice ? Number(form.largePrice) : null };
    const res = await fetch(pizzaId ? `/api/pizzas/${pizzaId}` : "/api/pizzas", {
      method: pizzaId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) { toast.success(pizzaId ? "Pizza updated!" : "Pizza created!"); router.push("/admin/pizzas"); }
    else toast.error("Failed to save");
  }

  const inputCls = "w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all";

  return (
    <form onSubmit={submit} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-5">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Basic Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Name *</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Margherita Classic" required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Slug *</label>
            <input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="margherita-classic" required className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the pizza..." rows={3} required className={`${inputCls} resize-none`} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Image URL *</label>
          <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://images.unsplash.com/..." required className={inputCls} />
          {form.image && <img src={form.image} alt="" className="mt-2 w-24 h-24 rounded-xl object-cover" />}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Category *</label>
          <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} required className={inputCls}>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Pricing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ key: "basePrice", label: "Base Price *" }, { key: "smallPrice", label: "Small" }, { key: "mediumPrice", label: "Medium" }, { key: "largePrice", label: "Large" }].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">{f.label}</label>
              <input type="number" step="0.01" min="0" value={(form as any)[f.key]} onChange={(e) => update(f.key, e.target.value)}
                placeholder="0.00" required={f.key === "basePrice"} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Ingredients</h2>
        <div className="flex gap-2">
          <input value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
            placeholder="Add ingredient..." className={`${inputCls} flex-1`} />
          <button type="button" onClick={addIngredient} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.ingredients.map((ing: string) => (
            <span key={ing} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full text-sm border border-green-200 dark:border-green-800">
              {ing}
              <button type="button" onClick={() => setForm((f) => ({ ...f, ingredients: f.ingredients.filter((i: string) => i !== ing) }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Tags</h2>
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="e.g. spicy, veg, bestseller" className={`${inputCls} flex-1`} />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag: string) => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t: string) => t !== tag) }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Settings</h2>
        <div className="space-y-3">
          {[
            { key: "isAvailable", label: "Available for ordering" },
            { key: "isFeatured", label: "Feature on homepage" },
          ].map((s) => (
            <label key={s.key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => update(s.key, !(form as any)[s.key])}
                className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${(form as any)[s.key] ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-700"}`}
              >
                <motion.div
                  animate={{ x: (form as any)[s.key] ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <AnimatedButton type="button" variant="secondary" onClick={() => router.push("/admin/pizzas")}>
          Cancel
        </AnimatedButton>
        <AnimatedButton type="submit" loading={loading}>
          <Save className="w-4 h-4" /> {pizzaId ? "Update Pizza" : "Create Pizza"}
        </AnimatedButton>
      </div>
    </form>
  );
}
