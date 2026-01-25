"use client";
import { Github, Twitter, Mail, BookOpen, Brain, Users, TrendingUp, Calendar, MessageCircle, Zap, Target, Heart, CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900/50 relative overflow-hidden">
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
              <h3 className="text-white text-xl font-medium tracking-wide mb-3">
                Resolve AI
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-xs">
                Your AI study partner for JEE preparation. Doubts, discipline, and direction.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 transition-all duration-200"
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
              <h4 className="text-white text-sm font-medium tracking-wider uppercase mb-6">
                Programs
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    JEE Main Preparation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    JEE Advanced Course
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Crash Course
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Mock Tests
                  </a>
                  <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                    Soon
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Study Groups
                  </a>
                  <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
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
              <h4 className="text-white text-sm font-medium tracking-wider uppercase mb-6">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    AI Tutor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Practice Problems
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Progress Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Study Plans
                  </a>
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
              <h4 className="text-white text-sm font-medium tracking-wider uppercase mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-neutral-300 text-sm transition-all duration-300 hover:translate-x-1 transform">
                    Terms of Service
                  </a>
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
          className="mt-16 pt-8 border-t border-neutral-900/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © {currentYear} Resolve AI. All rights reserved.
            </p>
            <p className="text-neutral-500 text-sm">
              Made with <Heart className="w-3 h-3 inline mx-1 text-red-500/60" fill="currentColor" /> for JEE aspirants
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};