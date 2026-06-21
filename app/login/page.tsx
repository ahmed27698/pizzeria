"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Pizza, Mail, Lock } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/menu";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30"
        >
          <Pizza className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-black text-white">Welcome Back</h1>
        <p className="text-zinc-400 text-sm mt-1">Sign in to order your favourite pizza</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCredentials} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatedButton type="submit" loading={loading} fullWidth className="mt-2 py-3.5">
          Sign In
        </AnimatedButton>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-5 p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <p className="text-xs font-semibold text-orange-400 mb-1.5">Demo accounts (after seeding)</p>
        <p className="text-xs text-zinc-400">Admin: <span className="text-zinc-300">admin@pizzeria.com / admin123456</span></p>
        <p className="text-xs text-zinc-400 mt-0.5">User: <span className="text-zinc-300">user@pizzeria.com / user123456</span></p>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-orange-400 hover:text-orange-300 font-semibold">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(249,115,22,0.1),transparent_65%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative w-full max-w-md"
      >
        <Suspense fallback={<div className="h-96 rounded-3xl bg-white/5 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
