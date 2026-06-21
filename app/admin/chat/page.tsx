"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bot, User } from "lucide-react";

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/chat").then((r) => r.json()).then((d) => {
      setConversations(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-orange-500" /> Chat Logs
      </h1>
      {loading ? (
        <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />)}</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No chat messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((msg: any, i: number) => (
            <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className={`flex gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-gradient-to-br from-orange-500 to-red-600" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-zinc-500" />}
              </div>
              <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                <p className="text-xs text-zinc-400 mb-1">{msg.role} · {msg.user?.email || ""} · {new Date(msg.createdAt).toLocaleString()}</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
