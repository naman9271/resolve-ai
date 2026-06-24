"use client";
import { Github, Twitter, Mail, BookOpen, Brain, Users, TrendingUp, Calendar, MessageCircle, Zap, Target, Heart, CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  // Theme-aware classes
  const bgColor = theme === "dark" ? "bg-neutral-950" : "bg-cream-100";
  const borderColor = theme === "dark" ? "border-neutral-900/50" : "border-neutral-200/50";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const hoverText = theme === "dark" ? "hover:text-neutral-300" : "hover:text-neutral-800";
  const socialBorder = theme === "dark" ? "border-neutral-700" : "border-neutral-300";
  const socialHover = theme === "dark" ? "hover:border-neutral-600" : "hover:border-neutral-400";
  const badgeBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-200";
  const badgeText = theme === "dark" ? "text-neutral-300" : "text-neutral-600";
  const badgeBorder = theme === "dark" ? "border-neutral-700" : "border-neutral-300";

  return (
    <footer className={`w-full ${bgColor} border-t ${borderColor} relative overflow-hidden transition-colors duration-300`}>
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className={`${textPrimary} text-xl font-medium tracking-wide mb-3`}>
                Resolve AI
              </h3>
              <p className={`${textSecondary} text-sm leading-relaxed mb-6 max-w-xs`}>
                Your AI study partner for JEE preparation. Doubts, discipline, and direction.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full border ${socialBorder} flex items-center justify-center ${textSecondary} ${hoverText} ${socialHover} transition-all duration-200`}
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full border ${socialBorder} flex items-center justify-center ${textSecondary} ${hoverText} ${socialHover} transition-all duration-200`}
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="mailto:contact@resolveai.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full border ${socialBorder} flex items-center justify-center ${textSecondary} ${hoverText} ${socialHover} transition-all duration-200`}
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Column 2 - Programs */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={`${textPrimary} text-sm font-medium tracking-wider uppercase mb-6`}>
                Programs
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/pyq" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    JEE Main Preparation
                  </Link>
                </li>
                <li>
                  <Link href="/pyq" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    JEE Advanced Course
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    AI Doubt Solving
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${textSecondary} text-sm`}>
                    Mock Tests
                  </span>
                  <span className={`text-xs ${badgeBg} ${badgeText} px-2 py-0.5 rounded-full border ${badgeBorder}`}>
                    Soon
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`${textSecondary} text-sm`}>
                    Study Groups
                  </span>
                  <span className={`text-xs ${badgeBg} ${badgeText} px-2 py-0.5 rounded-full border ${badgeBorder}`}>
                    Soon
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Column 3 - Platform */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className={`${textPrimary} text-sm font-medium tracking-wider uppercase mb-6`}>
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/chat" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    AI Tutor
                  </Link>
                </li>
                <li>
                  <Link href="/pyq" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Practice Problems
                  </Link>
                </li>
                <li>
                  <Link href="/activity" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Progress Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Study Plans
                  </Link>
                </li>
                <li>
                  <Link href="/mentors" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Find Mentors
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Column 4 - Company */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className={`${textPrimary} text-sm font-medium tracking-wider uppercase mb-6`}>
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={`${textSecondary} ${hoverText} text-sm transition-all duration-300 hover:translate-x-1 transform inline-block`}>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={`mt-16 pt-8 border-t ${borderColor}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`${textMuted} text-sm`}>
              © {currentYear} Resolve AI. All rights reserved.
            </p>
            <p className={`${textMuted} text-sm`}>
              Made with <Heart className="w-3 h-3 inline mx-1 text-red-500/60" fill="currentColor" /> for JEE aspirants
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};