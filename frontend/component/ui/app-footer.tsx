"use client";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { Heart } from "lucide-react";

export function AppFooter() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  // Theme-aware classes
  const bgColor = theme === "dark" ? "bg-neutral-900/50" : "bg-neutral-50/80";
  const borderColor = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const hoverText = theme === "dark" ? "hover:text-neutral-300" : "hover:text-neutral-700";

  return (
    <footer className={`${bgColor} border-t ${borderColor} py-4 px-6 mt-auto`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p className={`${textMuted} text-xs`}>
          © {currentYear} Resolve AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className={`${textMuted} ${hoverText} text-xs transition-colors`}>
            Privacy
          </Link>
          <Link href="/terms" className={`${textMuted} ${hoverText} text-xs transition-colors`}>
            Terms
          </Link>
          <span className={`${textMuted} text-xs flex items-center gap-1`}>
            Made with <Heart className="w-3 h-3 text-red-500/60 fill-current" /> for JEE
          </span>
        </div>
      </div>
    </footer>
  );
}
