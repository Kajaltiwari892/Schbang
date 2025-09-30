"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white/80 dark:bg-[#0C0A09]/80 backdrop-blur-xl shadow-lg px-6 py-4 flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-3">
        <div className="relative animate-calendar-flip">
          <svg
            className="w-10 h-10 text-[#AAA995] dark:text-[#AAA995]/80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="3"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#0C0A09] dark:text-white">
          Schbang Meeting Calendar
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </nav>
  );
}
