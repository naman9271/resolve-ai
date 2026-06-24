"use client";
import { motion } from "framer-motion";
import { Send, Paperclip, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export const ChatInterface = () => {
  const { theme } = useTheme();

  // Theme-aware classes
  const cardBg = theme === "dark" ? "bg-neutral-900/95" : "bg-white/95";
  const cardBorder = theme === "dark" ? "border-neutral-700" : "border-neutral-200";
  const headerBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const messageAreaBg = theme === "dark" ? "bg-neutral-950" : "bg-cream-50";
  const userMsgBg = theme === "dark" ? "bg-cyan-600 text-white border-cyan-500/30" : "bg-cyan-600 text-white border-cyan-500/30";
  const aiMsgBg = theme === "dark" ? "bg-neutral-800 text-neutral-100 border-neutral-600" : "bg-white text-neutral-800 border-neutral-200";
  const footerBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const statusText = theme === "dark" ? "text-neutral-300" : "text-neutral-600";

  const sampleMessages = [
    {
      type: "user",
      text: "Can you explain the concept of equilibrium in thermodynamics?",
    },
    {
      type: "ai",
      text: "Of course. Thermodynamic equilibrium occurs when a system reaches a state where its macroscopic properties remain constant over time. There are three types: thermal (same temperature), mechanical (same pressure), and chemical (no net reactions). Would you like me to go deeper into any specific type?",
    },
  ];

  return (
    <div className="w-full">
      <div className={`border ${cardBorder} ${cardBg} rounded-lg overflow-hidden transition-colors duration-300`}>
        {/* Chat header */}
        <div className={`px-6 py-4 border-b ${cardBorder} ${headerBg} transition-colors duration-300`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className={`text-sm font-medium ${statusText}`}>Ask anything about JEE</span>
          </div>
        </div>

        {/* Messages */}
        <div className={`p-6 space-y-6 min-h-[380px] ${messageAreaBg} transition-colors duration-300`}>
          {sampleMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.4 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.type === "user" ? userMsgBg : aiMsgBg
                } px-4 py-3 rounded-lg border transition-colors duration-300`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input / CTA */}
        <div className={`p-4 border-t ${cardBorder} ${footerBg} transition-colors duration-300`}>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all"
          >
            Start Asking Your Doubts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
};