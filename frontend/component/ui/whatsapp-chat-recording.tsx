"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  delay: number;
}

const mentorMessages: ChatMessage[] = [
  { id: 1, text: "Hi! I'm your JEE mentor. How can I help you today?", sender: "bot", delay: 0 },
  { id: 2, text: "I'm struggling with organic chemistry mechanisms", sender: "user", delay: 1.5 },
  { id: 3, text: "No worries! Let's break it down step by step. Which reaction type are you finding difficult?", sender: "bot", delay: 3 },
  { id: 4, text: "SN1 vs SN2 - I always confuse them", sender: "user", delay: 5 },
  { id: 5, text: "Great question! Here's a simple way to remember:\n\n🔹 SN1: Slow step first (carbocation forms)\n🔹 SN2: Simultaneous attack (backside)\n\nShall I explain with examples?", sender: "bot", delay: 7 },
  { id: 6, text: "Yes please! That would really help", sender: "user", delay: 9.5 },
  { id: 7, text: "Perfect! Let's start with a common JEE question pattern...", sender: "bot", delay: 11 },
];

const emotionalSupportMessages: ChatMessage[] = [
  { id: 1, text: "Hey, how are you feeling today?", sender: "bot", delay: 0 },
  { id: 2, text: "Honestly, really stressed. Mocks aren't going well 😔", sender: "user", delay: 2 },
  { id: 3, text: "I hear you. JEE prep can feel overwhelming. Remember, one bad mock doesn't define you.", sender: "bot", delay: 4.5 },
  { id: 4, text: "But everyone else seems to be doing so well", sender: "user", delay: 7 },
  { id: 5, text: "Comparison is the thief of joy. Focus on YOUR progress. You've already come so far! 💪", sender: "bot", delay: 9 },
  { id: 6, text: "Would you like some quick breathing exercises to calm down?", sender: "bot", delay: 11.5 },
  { id: 7, text: "Yes, that would help. Thank you for listening.", sender: "user", delay: 14 },
];

interface WhatsAppChatProps {
  title: string;
  subtitle: string;
  messages: ChatMessage[];
  accentColor?: string;
}

function WhatsAppChatCard({ title, subtitle, messages, accentColor = "green" }: WhatsAppChatProps) {
  const { theme } = useTheme();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || hasStarted) return;
    setHasStarted(true);

    messages.forEach((msg) => {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, prefersReducedMotion ? 0 : msg.delay * 1000);
      return () => clearTimeout(timeout);
    });
  }, [isInView, messages, hasStarted, prefersReducedMotion]);

  const cardBg = theme === "dark" ? "bg-neutral-900/80" : "bg-white/80";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const headerBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";
  const textPrimary = theme === "dark" ? "text-neutral-100" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const chatBg = theme === "dark" ? "bg-neutral-950" : "bg-neutral-50";
  const botBubble = theme === "dark" ? "bg-neutral-800 text-neutral-100" : "bg-white text-neutral-900 border border-neutral-200";
  const userBubble = theme === "dark" ? "bg-neutral-700 text-neutral-100" : "bg-neutral-200 text-neutral-900";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`${cardBg} backdrop-blur-md border ${cardBorder} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      {/* Header */}
      <div className={`${headerBg} px-4 py-3 flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          accentColor === "green" ? "bg-green-500" : "bg-neutral-500"
        }`}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <h3 className={`font-semibold ${textPrimary} text-sm`}>{title}</h3>
          <p className={`${textSecondary} text-xs`}>{subtitle}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${chatBg} p-4 h-[320px] overflow-y-auto space-y-3`}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={visibleMessages.includes(msg.id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                msg.sender === "user" ? userBubble : botBubble
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function WhatsAppChatRecordings() {
  const { theme } = useTheme();
  const textPrimary = theme === "dark" ? "text-neutral-100" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";

  return (
    <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className={`${textSecondary} text-xs tracking-widest uppercase font-medium mb-3`}>
            Always Available on WhatsApp
          </p>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight ${textPrimary} mb-4`}>
            Your AI Companions, 24/7
          </h2>
          <p className={`${textSecondary} text-base max-w-2xl mx-auto`}>
            Get instant mentorship and emotional support right on WhatsApp — no app downloads needed.
          </p>
        </motion.div>

        {/* Chat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <WhatsAppChatCard
            title="Mentor WhatsApp Bot"
            subtitle="JEE guidance & strategy"
            messages={mentorMessages}
            accentColor="green"
          />
          <WhatsAppChatCard
            title="Emotional Support Bot"
            subtitle="Stress & burnout support"
            messages={emotionalSupportMessages}
            accentColor="green"
          />
        </div>
      </div>
    </section>
  );
}
