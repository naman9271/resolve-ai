"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dashboard,
  Calendar as CalendarIcon,
  UserMultiple,
  Analytics,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  AddLarge,
  Filter,
  CheckmarkOutline,
  View,
  Report,
  StarFilled,
  ChartBar,
  Security,
  Notification,
  Book,
  Chat,
  Events,
  ChevronRight,
} from "@carbon/icons-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme, ThemeToggle } from "@/lib/theme-context";
import { ResolveLogoMark } from "@/component/ui/resolve-logo";

/* ----------------------------- Types ----------------------------- */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
  href?: string;
}

interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}

interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

/* ----------------------------- Content Map ----------------------------- */

function getSidebarContent(activeSection: string, theme: string): SidebarContent {
  const iconColor = theme === "dark" ? "text-neutral-300" : "text-neutral-600";
  
  const contentMap: Record<string, SidebarContent> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "Overview",
          items: [
            { icon: <View size={18} className={iconColor} />, label: "Home", isActive: true, href: "/dashboard" },
            { icon: <ChartBar size={18} className={iconColor} />, label: "Progress Analytics", href: "/activity" },
          ],
        },
        {
          title: "Quick Stats",
          items: [
            {
              icon: <Report size={18} className={iconColor} />,
              label: "Weekly Summary",
              hasDropdown: true,
              children: [
                { label: "Questions Solved: 45" },
                { label: "Streak: 7 days 🔥" },
                { label: "Hours Studied: 28" },
              ],
            },
            {
              icon: <StarFilled size={18} className={iconColor} />,
              label: "Achievements",
              hasDropdown: true,
              children: [
                { label: "Physics Master 🏆" },
                { label: "7-Day Streak 🔥" },
              ],
            },
          ],
        },
      ],
    },
    pyq: {
      title: "PYQ Practice",
      sections: [
        {
          title: "Quick Actions",
          items: [
            { icon: <AddLarge size={18} className={iconColor} />, label: "Start Practice", href: "/pyq" },
            { icon: <Filter size={18} className={iconColor} />, label: "Filter by Year" },
          ],
        },
        {
          title: "Subjects",
          items: [
            { icon: <Book size={18} className={iconColor} />, label: "Physics", hasDropdown: true, children: [{ label: "Mechanics" }, { label: "Thermodynamics" }] },
            { icon: <Book size={18} className={iconColor} />, label: "Chemistry", hasDropdown: true, children: [{ label: "Organic" }, { label: "Inorganic" }] },
            { icon: <Book size={18} className={iconColor} />, label: "Mathematics", hasDropdown: true, children: [{ label: "Calculus" }, { label: "Algebra" }] },
          ],
        },
      ],
    },
    chat: {
      title: "AI Doubt Solver",
      sections: [
        {
          title: "Start New",
          items: [
            { icon: <AddLarge size={18} className={iconColor} />, label: "New Chat", href: "/chat" },
          ],
        },
        {
          title: "Recent Chats",
          items: [
            { icon: <Chat size={18} className={iconColor} />, label: "Physics Doubts", hasDropdown: true, children: [{ label: "Projectile motion" }, { label: "Electric field" }] },
            { icon: <Chat size={18} className={iconColor} />, label: "Chemistry Doubts", hasDropdown: true, children: [{ label: "Organic reactions" }] },
          ],
        },
      ],
    },
    mentors: {
      title: "Mentors",
      sections: [
        {
          title: "Find Mentors",
          items: [
            { icon: <UserMultiple size={18} className={iconColor} />, label: "Browse All", href: "/mentors" },
            { icon: <Filter size={18} className={iconColor} />, label: "Filter by Subject" },
          ],
        },
        {
          title: "My Sessions",
          items: [
            { icon: <CalendarIcon size={18} className={iconColor} />, label: "Upcoming" },
            { icon: <CheckmarkOutline size={18} className={iconColor} />, label: "Completed" },
          ],
        },
      ],
    },
    planner: {
      title: "Study Planner",
      sections: [
        {
          title: "Views",
          items: [
            { icon: <View size={18} className={iconColor} />, label: "Today's Plan", href: "/planner" },
            { icon: <CalendarIcon size={18} className={iconColor} />, label: "Weekly View" },
            { icon: <Events size={18} className={iconColor} />, label: "Monthly View" },
          ],
        },
        {
          title: "Quick Actions",
          items: [
            { icon: <AddLarge size={18} className={iconColor} />, label: "Add Task" },
            { icon: <Report size={18} className={iconColor} />, label: "Generate AI Plan" },
          ],
        },
      ],
    },
    activity: {
      title: "Performance",
      sections: [
        {
          title: "Analytics",
          items: [
            { icon: <ChartBar size={18} className={iconColor} />, label: "Overview", href: "/activity" },
            { icon: <Analytics size={18} className={iconColor} />, label: "Subject-wise" },
          ],
        },
        {
          title: "Progress",
          items: [
            { icon: <StarFilled size={18} className={iconColor} />, label: "Key Metrics", hasDropdown: true, children: [{ label: "Accuracy: 76%" }, { label: "Streak: 7 days" }] },
          ],
        },
      ],
    },
    profile: {
      title: "Profile",
      sections: [
        {
          title: "Account",
          items: [
            { icon: <UserIcon size={18} className={iconColor} />, label: "My Profile", href: "/profile" },
            { icon: <Security size={18} className={iconColor} />, label: "Settings" },
            { icon: <Notification size={18} className={iconColor} />, label: "Notifications" },
          ],
        },
      ],
    },
    "group-study": {
      title: "Group Study",
      sections: [
        {
          title: "Study Rooms",
          items: [
            { icon: <AddLarge size={18} className={iconColor} />, label: "Create Room", href: "/group-study" },
            { icon: <Events size={18} className={iconColor} />, label: "Join Room" },
          ],
        },
        {
          title: "Active Sessions",
          items: [
            { icon: <UserMultiple size={18} className={iconColor} />, label: "Physics Study Group" },
            { icon: <UserMultiple size={18} className={iconColor} />, label: "JEE Advanced Prep" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.dashboard;
}

/* ----------------------------- Hover-Expandable Sidebar ----------------------------- */

export function ResolveSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Determine active section from pathname
  useEffect(() => {
    if (pathname.startsWith("/pyq")) setActiveSection("pyq");
    else if (pathname.startsWith("/chat")) setActiveSection("chat");
    else if (pathname.startsWith("/mentors")) setActiveSection("mentors");
    else if (pathname.startsWith("/planner")) setActiveSection("planner");
    else if (pathname.startsWith("/activity")) setActiveSection("activity");
    else if (pathname.startsWith("/profile")) setActiveSection("profile");
    else if (pathname.startsWith("/group-study")) setActiveSection("group-study");
    else setActiveSection("dashboard");
  }, [pathname]);

  const content = getSidebarContent(activeSection, theme);

  // Theme-aware classes
  const bgColor = theme === "dark" ? "bg-black/95" : "bg-cream-50/95";
  const borderColor = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textColor = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const hoverBg = theme === "dark" ? "hover:bg-neutral-800/50" : "hover:bg-neutral-200/50";
  const activeBg = theme === "dark" ? "bg-neutral-800/70" : "bg-neutral-200/70";
  const iconBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-200";

  const navItems = [
    { id: "dashboard", icon: <Dashboard size={20} />, label: "Dashboard", href: "/dashboard" },
    { id: "pyq", icon: <Book size={20} />, label: "PYQ Practice", href: "/pyq" },
    { id: "chat", icon: <Chat size={20} />, label: "AI Doubts", href: "/chat" },
    { id: "mentors", icon: <UserMultiple size={20} />, label: "Mentors", href: "/mentors" },
    { id: "planner", icon: <CalendarIcon size={20} />, label: "Planner", href: "/planner" },
    { id: "activity", icon: <Analytics size={20} />, label: "Performance", href: "/activity" },
    { id: "group-study", icon: <Events size={20} />, label: "Group Study", href: "/group-study" },
  ];

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 280 : 72 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 h-screen ${bgColor} backdrop-blur-xl border-r ${borderColor} z-40 flex flex-col overflow-hidden transition-colors duration-300`}
    >
      {/* Header - Logo */}
      <div className={`flex items-center h-16 px-4 border-b ${borderColor}`}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <motion.div 
            className="flex items-center justify-center w-10 h-10"
            whileHover={{ scale: 1.05 }}
          >
            <ResolveLogoMark size="md" />
          </motion.div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={`font-bold text-lg ${textColor} whitespace-nowrap`}
              >
                RESOLVE AI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || activeSection === item.id;
            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive ? activeBg : hoverBg
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isActive ? iconBg : ""} ${isActive ? textColor : textSecondary}`}>
                    {item.icon}
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm font-medium whitespace-nowrap ${isActive ? textColor : textSecondary}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isExpanded && isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="ml-auto"
                      >
                        <ChevronRight size={16} className={textMuted} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Expanded Content - Section Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-6 border-t ${borderColor} pt-4`}
            >
              <h3 className={`px-3 mb-3 text-xs font-semibold tracking-wider uppercase ${textMuted}`}>
                {content.title}
              </h3>
              
              {content.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <p className={`px-3 mb-2 text-[10px] font-medium tracking-wider uppercase ${textMuted}`}>
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item, itemIndex) => {
                      const itemKey = `${sectionIndex}-${itemIndex}`;
                      const isItemExpanded = expandedItems.has(itemKey);
                      
                      return (
                        <div key={itemKey}>
                          {item.href ? (
                            <Link href={item.href}>
                              <motion.div
                                whileHover={{ x: 2, backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${textSecondary} transition-colors`}
                              >
                                {item.icon}
                                <span className="text-sm">{item.label}</span>
                              </motion.div>
                            </Link>
                          ) : (
                            <>
                              <motion.div
                                whileHover={{ x: 2, backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                                onClick={() => item.hasDropdown && toggleExpanded(itemKey)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${textSecondary} transition-colors`}
                              >
                                {item.icon}
                                <span className="text-sm flex-1">{item.label}</span>
                                {item.hasDropdown && (
                                  <ChevronDownIcon 
                                    size={14} 
                                    className={`transition-transform duration-200 ${isItemExpanded ? "rotate-180" : ""}`} 
                                  />
                                )}
                              </motion.div>
                              
                              {/* Dropdown Children */}
                              <AnimatePresence>
                                {item.hasDropdown && isItemExpanded && item.children && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`ml-6 pl-3 border-l ${borderColor}`}
                                  >
                                    {item.children.map((child, childIndex) => (
                                      <div
                                        key={childIndex}
                                        className={`py-1.5 px-2 text-xs ${textMuted} hover:${textSecondary} cursor-pointer rounded transition-colors`}
                                      >
                                        {child.label}
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom Section - Theme Toggle & Profile */}
      <div className={`border-t ${borderColor} p-3`}>
        <div className="flex items-center justify-between mb-2">
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-xs ${textMuted}`}
              >
                Theme
              </motion.span>
            )}
          </AnimatePresence>
          <ThemeToggle className={isExpanded ? "" : "mx-auto"} />
        </div>

        {/* User Profile */}
        <Link href="/profile">
          <motion.div
            whileHover={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors"
          >
            <div className={`relative w-9 h-9 rounded-full ${iconBg} flex items-center justify-center overflow-hidden`}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={18} className={textSecondary} />
              )}
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className={`text-sm font-medium ${textColor} truncate`}>{user?.full_name || "Student"}</p>
                  <p className={`text-xs ${textMuted} truncate`}>{user?.email || "View profile"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}

export default ResolveSidebar;

// Also export the dual sidebar
export { DualSidebar } from "./dual-sidebar";
