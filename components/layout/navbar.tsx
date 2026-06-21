"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pizza,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChefHat,
  LogOut,
  Package,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/hooks/use-cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/offers", label: "Offers" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 20 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
            >
              <Pizza className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Pizzeria
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer block ${
                    pathname === link.href
                      ? "bg-orange-500 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Search className="w-4.5 h-4.5" />
              </motion.button>
            </Link>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4.5 h-4.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4.5 h-4.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {session && (
              <>
                {/* Favorites */}
                <Link href="/favorites">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Heart className="w-4.5 h-4.5" />
                  </motion.button>
                </Link>

                {/* Cart */}
                <Link href="/cart">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                    <AnimatePresence>
                      {itemCount > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        >
                          {itemCount > 9 ? "9+" : itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-orange-400 transition-colors"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                      >
                        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                          <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-1.5">
                          {[
                            { href: "/profile", icon: User, label: "Profile" },
                            { href: "/order-history", icon: Package, label: "My Orders" },
                            ...(isAdmin
                              ? [{ href: "/admin", icon: LayoutDashboard, label: "Admin Panel" }]
                              : []),
                          ].map((item) => (
                            <Link key={item.href} href={item.href}>
                              <motion.div
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <item.icon className="w-4 h-4 text-orange-500" />
                                {item.label}
                              </motion.div>
                            </Link>
                          ))}
                          <motion.button
                            whileHover={{ x: 3 }}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {!session && (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                >
                  <ChefHat className="w-4 h-4" />
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-orange-500 text-white"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!session && (
                <Link href="/login">
                  <span className="block px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-xl text-center mt-2">
                    Sign In
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
