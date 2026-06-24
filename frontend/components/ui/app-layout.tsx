"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DualSidebar } from "@/components/ui/sidebar-component";
import { Navbar } from "@/component/ui/navbar";
import { useTheme } from "@/lib/theme-context";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showNavbar?: boolean;
}

// Pages that should have sidebar
const SIDEBAR_PAGES = [
  "/dashboard",
  "/chat",
  "/pyq",
  "/mentors",
  "/planner",
  "/activity",
  "/profile",
  "/group-study",
];

// Pages that should NOT have navbar (auth pages)
const NO_NAVBAR_PAGES = [
  "/auth/login",
  "/auth/register",
  "/auth/callback",
  "/onboarding",
];

export function AppLayout({ children, showSidebar, showNavbar }: AppLayoutProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Determine if sidebar should be shown
  const shouldShowSidebar = showSidebar !== undefined 
    ? showSidebar 
    : SIDEBAR_PAGES.some(page => pathname.startsWith(page));

  // Determine if navbar should be shown
  const shouldShowNavbar = showNavbar !== undefined
    ? showNavbar
    : !NO_NAVBAR_PAGES.some(page => pathname.startsWith(page));

  // Theme-aware background
  const bgColor = theme === "dark" ? "bg-black" : "bg-cream-50";

  if (shouldShowSidebar) {
    return (
      <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
        <DualSidebar />
        <main className="pl-[72px] min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {shouldShowNavbar && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
