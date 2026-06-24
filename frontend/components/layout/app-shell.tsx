"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  User,
  ChevronRight,
  X,
  Folder,
  Heart,
  GraduationCap,
  Home,
  Settings,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

/* ----------------------------- Types ----------------------------- */

interface SubSidebarItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: { label: string; href?: string; value?: string }[];
  isExpanded?: boolean;
}

interface SubSidebarSection {
  title: string;
  items: SubSidebarItem[];
}

interface SubSidebarContent {
  title: string;
  sections: SubSidebarSection[];
}

interface SidebarContextType {
  isSubSidebarOpen: boolean;
  openSubSidebar: (content: SubSidebarContent) => void;
  closeSubSidebar: () => void;
  subSidebarContent: SubSidebarContent | null;
  activeNavItem: string;
}

/* ----------------------------- Context ----------------------------- */

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within AppShell");
  }
  return context;
}

/* ----------------------------- Nav Items ----------------------------- */

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { id: "pyq", icon: BookOpen, label: "PYQs", href: "/pyq", hasSubSidebar: true },
  { id: "chat", icon: MessageSquare, label: "AI Doubts", href: "/chat" },
  { id: "mentors", icon: Users, label: "Mentors", href: "/mentors" },
  { id: "planner", icon: Calendar, label: "Planner", href: "/planner" },
  { id: "activity", icon: TrendingUp, label: "Performance", href: "/activity" },
  { id: "resources", icon: Folder, label: "Resources", href: "/resources", hasSubSidebar: true },
  { id: "support", icon: Heart, label: "Support", href: "/support" },
  { id: "counselling", icon: GraduationCap, label: "Counselling", href: "/counselling", hasSubSidebar: true },
];

/* ----------------------------- Main Sidebar ----------------------------- */

function MainSidebar({ 
  activeNavItem,
  onNavClick 
}: { 
  activeNavItem: string;
  onNavClick: (id: string) => void;
}) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = theme === "dark" ? "bg-neutral-950" : "bg-white";
  const borderColor = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const hoverBg = theme === "dark" ? "hover:bg-neutral-800/60" : "hover:bg-neutral-100";
  const activeBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isHovered ? 200 : 68 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 h-screen ${bgColor} border-r ${borderColor} z-50 flex flex-col overflow-hidden`}
    >
      {/* Logo */}
      <div className={`flex items-center h-14 px-4 border-b ${borderColor}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-neutral-900 font-bold text-sm">R</span>
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className={`font-semibold text-sm ${textColor} whitespace-nowrap overflow-hidden`}
              >
                RESOLVE AI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeNavItem === item.id;
            const Icon = item.icon;
            
            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  onClick={() => onNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive ? activeBg : hoverBg
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-md ${
                    isActive ? (theme === "dark" ? "text-white" : "text-neutral-900") : textMuted
                  }`}>
                    <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                  </div>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-[13px] font-medium whitespace-nowrap ${
                          isActive ? textColor : textMuted
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isHovered && item.hasSubSidebar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-auto"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 ${textMuted}`} />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={`border-t ${borderColor} p-2`}>
        {/* Home Link */}
        <Link href="/">
          <motion.div
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer ${hoverBg} mb-1`}
            whileHover={{ x: 2 }}
          >
            <Home className={`w-[18px] h-[18px] ${textMuted}`} />
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-[13px] font-medium ${textMuted}`}
                >
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer ${hoverBg} w-full mb-1`}
          whileHover={{ x: 2 }}
        >
          {theme === "dark" ? (
            <Sun className={`w-[18px] h-[18px] ${textMuted}`} />
          ) : (
            <Moon className={`w-[18px] h-[18px] ${textMuted}`} />
          )}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-[13px] font-medium ${textMuted}`}
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile */}
        <Link href="/profile">
          <motion.div
            className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer ${hoverBg}`}
            whileHover={{ x: 2 }}
          >
            <div className={`w-7 h-7 rounded-full ${theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"} flex items-center justify-center overflow-hidden`}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className={`w-4 h-4 ${textMuted}`} />
              )}
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className={`text-[13px] font-medium ${textColor} truncate`}>
                    {user?.full_name || "Student"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}

/* ----------------------------- Sub Sidebar ----------------------------- */

function SubSidebar({ 
  content, 
  isOpen, 
  onClose 
}: { 
  content: SubSidebarContent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const bgColor = theme === "dark" ? "bg-neutral-900/95" : "bg-neutral-50/95";
  const borderColor = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const hoverBg = theme === "dark" ? "hover:bg-neutral-800/60" : "hover:bg-neutral-100";

  const toggleItem = (key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
          
          {/* Sub Sidebar */}
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed left-[68px] top-0 h-screen w-[240px] ${bgColor} backdrop-blur-xl border-r ${borderColor} z-40 flex flex-col`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between h-14 px-4 border-b ${borderColor}`}>
              <h3 className={`font-medium text-sm ${textColor}`}>{content.title}</h3>
              <button 
                onClick={onClose}
                className={`p-1 rounded-md ${hoverBg} transition-colors`}
              >
                <X className={`w-4 h-4 ${textMuted}`} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 py-3 px-3 overflow-y-auto">
              {content.sections.map((section, sIdx) => (
                <div key={sIdx} className="mb-5">
                  <p className={`px-2 mb-2 text-[10px] font-medium tracking-wider uppercase ${textMuted}`}>
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item, iIdx) => {
                      const itemKey = `${sIdx}-${iIdx}`;
                      const isExpanded = expandedItems.has(itemKey);
                      
                      return (
                        <div key={itemKey}>
                          {item.href ? (
                            <Link href={item.href}>
                              <motion.div
                                whileHover={{ x: 2 }}
                                className={`px-2 py-1.5 rounded-md cursor-pointer ${hoverBg} ${textMuted} text-sm transition-colors`}
                              >
                                {item.label}
                              </motion.div>
                            </Link>
                          ) : item.children ? (
                            <>
                              <motion.div
                                whileHover={{ x: 2 }}
                                onClick={() => toggleItem(itemKey)}
                                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${hoverBg} ${textMuted} text-sm transition-colors`}
                              >
                                <span>{item.label}</span>
                                <ChevronRight 
                                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                />
                              </motion.div>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`ml-3 pl-2 border-l ${borderColor} mt-0.5`}
                                  >
                                    {item.children.map((child, cIdx) => (
                                      child.href ? (
                                        <Link key={cIdx} href={child.href}>
                                          <div className={`py-1 px-2 text-xs ${textMuted} ${hoverBg} rounded cursor-pointer`}>
                                            {child.label}
                                          </div>
                                        </Link>
                                      ) : (
                                        <div 
                                          key={cIdx}
                                          className={`py-1 px-2 text-xs ${textMuted}`}
                                        >
                                          {child.label}
                                        </div>
                                      )
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <motion.div
                              whileHover={{ x: 2 }}
                              onClick={item.onClick}
                              className={`px-2 py-1.5 rounded-md cursor-pointer ${hoverBg} ${textMuted} text-sm transition-colors`}
                            >
                              {item.label}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- App Shell ----------------------------- */

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [subSidebarContent, setSubSidebarContent] = useState<SubSidebarContent | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");

  // Determine active nav item from pathname
  useEffect(() => {
    const path = pathname.split("/")[1];
    const matchedItem = navItems.find(item => item.href.includes(path));
    if (matchedItem) {
      setActiveNavItem(matchedItem.id);
    }
  }, [pathname]);

  const openSubSidebar = useCallback((content: SubSidebarContent) => {
    setSubSidebarContent(content);
    setIsSubSidebarOpen(true);
  }, []);

  const closeSubSidebar = useCallback(() => {
    setIsSubSidebarOpen(false);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveNavItem(id);
    // Close sub-sidebar when navigating to a different section
    if (id !== activeNavItem) {
      setIsSubSidebarOpen(false);
    }
  };

  const bgColor = theme === "dark" ? "bg-black" : "bg-neutral-50";

  return (
    <SidebarContext.Provider value={{
      isSubSidebarOpen,
      openSubSidebar,
      closeSubSidebar,
      subSidebarContent,
      activeNavItem,
    }}>
      <div className={`min-h-screen ${bgColor} transition-colors duration-200`}>
        <MainSidebar 
          activeNavItem={activeNavItem}
          onNavClick={handleNavClick}
        />
        <SubSidebar 
          content={subSidebarContent}
          isOpen={isSubSidebarOpen}
          onClose={closeSubSidebar}
        />
        
        {/* Main Content */}
        <main 
          className={`transition-all duration-200 min-h-screen ${
            isSubSidebarOpen ? "pl-[308px]" : "pl-[68px]"
          }`}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export default AppShell;
