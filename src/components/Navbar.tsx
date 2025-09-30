"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white/80 dark:bg-[#0C0A09]/80 backdrop-blur-xl shadow-lg px-4 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative animate-calendar-flip w-8 h-8 md:w-10 md:h-10">
          <Image 
            src="https://i.pinimg.com/736x/6a/1e/c2/6a1ec2ff8488209f3185ed2711fe40d9.jpg"
            alt="Calendar Logo"
            width={40}
            height={40}
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-[#0C0A09] dark:text-white">
          Kalendar
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
