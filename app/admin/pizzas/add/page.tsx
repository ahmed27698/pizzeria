import { PizzaForm } from "@/components/admin/pizza-form";

export default function AddPizzaPage() {
  return (
    <div>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8">Add New Pizza</h1>
      <PizzaForm />
    </div>
  );
}
