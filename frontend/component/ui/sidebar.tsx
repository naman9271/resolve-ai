"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Users,
  Calendar,
  TrendingUp,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { ResolveLogoMark } from "@/component/ui/resolve-logo";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "PYQs", href: "/pyq" },
  { icon: Brain, label: "AI Doubt Solver", href: "/chat", badge: "AI" },
  { icon: Users, label: "Mentors", href: "/mentors" },
  { icon: Calendar, label: "Study Planner", href: "/planner" },
  { icon: TrendingUp, label: "Performance", href: "/activity" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Theme-aware colors
  const bgColor = theme === "dark" ? "bg-black/40" : "bg-white/80";
  const borderColor = theme === "dark" ? "border-white/[0.08]" : "border-neutral-200/50";
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900";
  const textMuted = theme === "dark" ? "text-neutral-400" : "text-neutral-500";
  const hoverBg = theme === "dark" ? "hover:bg-white/[0.03]" : "hover:bg-neutral-100/50";
  const activeIndicator = theme === "dark" 
    ? "bg-neutral-800/50 border-neutral-600/50" 
    : "bg-neutral-200/50 border-neutral-300/50";

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Glass background */}
        <div className={`absolute inset-0 ${bgColor} backdrop-blur-xl border-r ${borderColor}`} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ResolveLogoMark size="xl" />
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`text-lg font-bold ${textColor}`}
                  >
                    RESOLVE AI
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? textColor
                          : `${textMuted} ${theme === "dark" ? "hover:text-white" : "hover:text-neutral-900"}`
                      }`}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute inset-0 ${activeIndicator} rounded-xl border`}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover glow */}
                      <motion.div
                        className={`absolute inset-0 rounded-xl ${theme === "dark" ? "bg-white/[0.03]" : "bg-neutral-100/50"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      <div className="relative z-10 flex items-center gap-3">
                        <div className={`relative ${isActive ? (theme === "dark" ? "text-neutral-200" : "text-neutral-700") : ""}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.15 }}
                              className="text-sm font-medium"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Badge */}
                        {item.badge && !isCollapsed && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-[10px] font-semibold ${theme === "dark" ? "bg-neutral-700 text-neutral-200" : "bg-neutral-300 text-neutral-700"} rounded-full`}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 ${theme === "dark" ? "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500" : "bg-white border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400"} border rounded-full flex items-center justify-center transition-colors z-50`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-3 h-3" />
            </motion.div>
          </motion.button>

          {/* User profile */}
          <div className={`mt-auto pt-4 border-t ${theme === "dark" ? "border-white/[0.06]" : "border-neutral-200/50"}`}>
            <Link href="/profile">
              <motion.div
                className={`flex items-center gap-3 p-3 rounded-xl ${hoverBg} transition-colors group`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="relative">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className={`w-10 h-10 rounded-xl object-cover border ${theme === "dark" ? "border-white/10" : "border-neutral-200"}`}
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-xl ${theme === "dark" ? "bg-neutral-700 text-neutral-200" : "bg-neutral-300 text-neutral-700"} flex items-center justify-center font-semibold border ${theme === "dark" ? "border-white/10" : "border-neutral-200"}`}>
                      {user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${theme === "dark" ? "border-black" : "border-white"}`} />
                </div>
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 min-w-0"
                    >
                      <p className={`text-sm font-medium ${textColor} truncate`}>
                        {user?.full_name || "Student"}
                      </p>
                      <p className={`text-xs ${textMuted} truncate`}>
                        {user?.email || "View profile"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Spacer to push content */}
      <div className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`} />
    </>
  );
}
