"use client";

import React from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface ResolveLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
}

// SVG paths for the logo mark
const logoPaths = {
  top: "M0.32 0C0.20799 0 0.151984 0 0.109202 0.0217987C0.0715695 0.0409734 0.0409734 0.0715695 0.0217987 0.109202C0 0.151984 0 0.20799 0 0.32V6.68C0 6.79201 0 6.84801 0.0217987 6.8908C0.0409734 6.92843 0.0715695 6.95902 0.109202 6.9782C0.151984 7 0.207989 7 0.32 7L3.68 7C3.79201 7 3.84802 7 3.8908 6.9782C3.92843 6.95903 3.95903 6.92843 3.9782 6.8908C4 6.84801 4 6.79201 4 6.68V4.32C4 4.20799 4 4.15198 4.0218 4.1092C4.04097 4.07157 4.07157 4.04097 4.1092 4.0218C4.15198 4 4.20799 4 4.32 4L19.68 4C19.792 4 19.848 4 19.8908 4.0218C19.9284 4.04097 19.959 4.07157 19.9782 4.1092C20 4.15198 20 4.20799 20 4.32V6.68C20 6.79201 20 6.84802 20.0218 6.8908C20.041 6.92843 20.0716 6.95903 20.1092 6.9782C20.152 7 20.208 7 20.32 7L23.68 7C23.792 7 23.848 7 23.8908 6.9782C23.9284 6.95903 23.959 6.92843 23.9782 6.8908C24 6.84802 24 6.79201 24 6.68V0.32C24 0.20799 24 0.151984 23.9782 0.109202C23.959 0.0715695 23.9284 0.0409734 23.8908 0.0217987C23.848 0 23.792 0 23.68 0H0.32Z",
  bottom: "M0.32 16C0.20799 16 0.151984 16 0.109202 15.9782C0.0715695 15.959 0.0409734 15.9284 0.0217987 15.8908C0 15.848 0 15.792 0 15.68V9.32C0 9.20799 0 9.15198 0.0217987 9.1092C0.0409734 9.07157 0.0715695 9.04097 0.109202 9.0218C0.151984 9 0.207989 9 0.32 9H3.68C3.79201 9 3.84802 9 3.8908 9.0218C3.92843 9.04097 3.95903 9.07157 3.9782 9.1092C4 9.15198 4 9.20799 4 9.32V11.68C4 11.792 4 11.848 4.0218 11.8908C4.04097 11.9284 4.07157 11.959 4.1092 11.9782C4.15198 12 4.20799 12 4.32 12L19.68 12C19.792 12 19.848 12 19.8908 11.9782C19.9284 11.959 19.959 11.9284 19.9782 11.8908C20 11.848 20 11.792 20 11.68V9.32C20 9.20799 20 9.15199 20.0218 9.1092C20.041 9.07157 20.0716 9.04098 20.1092 9.0218C20.152 9 20.208 9 20.32 9H23.68C23.792 9 23.848 9 23.8908 9.0218C23.9284 9.04098 23.959 9.07157 23.9782 9.1092C24 9.15199 24 9.20799 24 9.32V15.68C24 15.792 24 15.848 23.9782 15.8908C23.959 15.9284 23.9284 15.959 23.8908 15.9782C23.848 16 23.792 16 23.68 16H0.32Z",
  middle: "M6.32 10C6.20799 10 6.15198 10 6.1092 9.9782C6.07157 9.95903 6.04097 9.92843 6.0218 9.8908C6 9.84802 6 9.79201 6 9.68V6.32C6 6.20799 6 6.15198 6.0218 6.1092C6.04097 6.07157 6.07157 6.04097 6.1092 6.0218C6.15198 6 6.20799 6 6.32 6L17.68 6C17.792 6 17.848 6 17.8908 6.0218C17.9284 6.04097 17.959 6.07157 17.9782 6.1092C18 6.15198 18 6.20799 18 6.32V9.68C18 9.79201 18 9.84802 17.9782 9.8908C17.959 9.92843 17.9284 9.95903 17.8908 9.9782C17.848 10 17.792 10 17.68 10H6.32Z",
};

const sizeMap = {
  sm: { icon: 20, text: "text-sm" },
  md: { icon: 24, text: "text-base" },
  lg: { icon: 28, text: "text-lg" },
  xl: { icon: 32, text: "text-xl" },
};

// Logo Mark Only Component
export function ResolveLogoMark({ 
  size = "md", 
  className = "" 
}: { 
  size?: "sm" | "md" | "lg" | "xl"; 
  className?: string;
}) {
  const { theme } = useTheme();
  const iconSize = sizeMap[size].icon;
  
  // Theme-adaptive colors - grey in dark, dark grey in light
  const fillColor = theme === "dark" ? "#d4d4d4" : "#404040";

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: iconSize, height: iconSize }}
    >
      <svg 
        className="block w-full h-full" 
        fill="none" 
        viewBox="0 0 24 16"
      >
        <g>
          <path d={logoPaths.top} fill={fillColor} />
          <path d={logoPaths.bottom} fill={fillColor} />
          <path d={logoPaths.middle} fill={fillColor} />
        </g>
      </svg>
    </div>
  );
}

// Full Logo with Text
export function ResolveLogo({
  size = "md",
  showText = true,
  href,
  className = "",
}: ResolveLogoProps) {
  const { theme } = useTheme();
  const { text: textSize } = sizeMap[size];
  
  // Theme-adaptive text color
  const textColor = theme === "dark" ? "text-neutral-200" : "text-neutral-800";

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <ResolveLogoMark size={size} />
      {showText && (
        <span className={`font-semibold ${textSize} ${textColor} tracking-tight transition-colors duration-300`}>
          RESOLVE AI
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="flex items-center hover:opacity-80 transition-opacity duration-200"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

// Compact Logo for Sidebar (icon rail)
export function ResolveLogoCompact({ 
  href = "/dashboard",
  className = "" 
}: { 
  href?: string;
  className?: string;
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-center hover:opacity-80 transition-opacity duration-200 ${className}`}
    >
      <ResolveLogoMark size="md" />
    </Link>
  );
}

// Logo for Header/Navbar
export function ResolveLogoHeader({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-neutral-100" : "text-neutral-900";

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 ${className}`}
    >
      <ResolveLogoMark size="md" />
      <span className={`font-bold text-xl ${textColor} tracking-tight transition-colors duration-300`}>
        RESOLVE AI
      </span>
    </Link>
  );
}

export default ResolveLogo;
