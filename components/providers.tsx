"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid #27272a",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
