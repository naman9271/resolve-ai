"use client";

import React from "react";
import { Meteors } from "./meteors";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export function MeteorsDemo() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const cardBg = theme === "dark" ? "bg-neutral-950" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const iconColor = theme === "dark" ? "text-neutral-600" : "text-neutral-400";
  const iconHover = theme === "dark" ? "group-hover:text-neutral-400" : "group-hover:text-neutral-600";
  const numberColor = theme === "dark" ? "text-neutral-700" : "text-neutral-400";
  const hoverBorder = theme === "dark" ? "hover:border-neutral-700" : "hover:border-neutral-400";
  const glowEffect = theme === "dark" 
    ? "from-cyan-500/5 via-transparent to-blue-500/5" 
    : "from-cyan-500/10 via-transparent to-blue-500/10";

  return (
    <div className={`${cardBg} border ${cardBorder} p-8 rounded-sm ${hoverBorder} transition-colors duration-500 group relative overflow-hidden`}>
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowEffect} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-12">
          <Sparkles className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
          <span className={`${numberColor} text-xs tracking-widest`}>07</span>
        </div>
        <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary} group-hover:opacity-90 transition-colors duration-300`}>
          {t.features?.groupStudy || "Live Study Sessions"}
        </h3>
        <p className={`${textSecondary} text-base leading-relaxed group-hover:opacity-90 transition-colors duration-300`}>
          {t.features?.groupStudyDesc || "Join live doubt-solving sessions and group study rooms."}
        </p>
      </div>
      {/* Meteor effect */}
      <Meteors number={20} />
    </div>
  );
}
