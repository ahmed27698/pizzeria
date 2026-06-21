"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => { setUsers(d); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">Users</h1>
        <p className="text-zinc-500 mt-1">{users.length} registered</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {["User", "Role", "Orders", "Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(8).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(4).fill(0).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" /></td>)}
                    </tr>
                  ))
                : users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">{user.name || "—"}</p>
                            <p className="text-xs text-zinc-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                          {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{user._count?.orders ?? 0}</td>
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
