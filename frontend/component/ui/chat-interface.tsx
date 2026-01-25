"use client";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { AIButton } from "./ai-button";

export const ChatInterface = () => {

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
      <div className="border border-neutral-700 bg-neutral-900/95 rounded-lg overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-neutral-700 bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-neutral-300">Ask anything about JEE</span>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-6 min-h-[380px] bg-neutral-950">
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
                  msg.type === "user"
                    ? "bg-cyan-600 text-white border border-cyan-500/30"
                    : "bg-neutral-800 text-neutral-100 border border-neutral-600"
                } px-4 py-3 rounded-lg`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-700 bg-neutral-900">
          <div className="flex items-center gap-3">
            <button className="text-neutral-500 hover:text-cyan-400 transition-colors p-2 rounded-md hover:bg-neutral-800">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <AIButton />
            </div>
            <button className="text-neutral-500 hover:text-cyan-400 transition-colors p-2 rounded-md hover:bg-neutral-800">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};