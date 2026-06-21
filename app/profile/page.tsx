"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then((user) => {
      setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("Profile updated!"); await update(); }
    else toast.error("Failed to save");
  }

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "Your name" },
    { key: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+1 234 567 8900" },
    { key: "address", label: "Default Address", icon: MapPin, type: "text", placeholder: "Your delivery address" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8">My Profile</h1>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                  {form.name?.[0] || "?"}
                </div>
              )}
              <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <h2 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">{form.name || "User"}</h2>
              <p className="text-zinc-500 text-sm">{session?.user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={save}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-5"
        >
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Edit Profile</h2>

          {/* Email (readonly) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              value={session?.user?.email || ""}
              disabled
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 cursor-not-allowed opacity-70"
            />
          </div>

          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <field.icon className="w-3.5 h-3.5" /> {field.label}
              </label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            </div>
          ))}

          <AnimatedButton type="submit" loading={saving} fullWidth>
            <Save className="w-4 h-4" /> Save Changes
          </AnimatedButton>
        </motion.form>
      </div>
    </div>
  );
}
