"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Send,
  Sparkles,
  Moon,
  Sun,
  Coffee,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { AppShell } from "@/components/layout/app-shell";

/* ----------------------------- Types ----------------------------- */

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface MoodOption {
  icon: React.ElementType;
  label: string;
  value: string;
}

/* ----------------------------- Support Responses ----------------------------- */

const supportResponses: Record<string, string[]> = {
  stress: [
    "I hear you. JEE preparation can feel overwhelming at times. Remember, it's okay to take breaks and breathe.",
    "Stress is a natural part of this journey. What helps is focusing on one small task at a time. What's one thing you can do in the next 30 minutes?",
    "You're handling a lot right now. That takes strength. Would you like to talk about what's specifically making you feel stressed?",
  ],
  anxiety: [
    "Feeling anxious before exams is very common. You're not alone in this. Let's take a deep breath together.",
    "Anxiety often comes from uncertainty. Try focusing on what you can control - your preparation, your routine, your rest.",
    "It's okay to feel this way. Many successful students have felt exactly what you're feeling right now.",
  ],
  motivation: [
    "Every great achievement starts with the decision to try. You've already taken that step by being here.",
    "Think about why you started this journey. That 'why' is still there, waiting for you to reconnect with it.",
    "Small progress is still progress. What's one chapter or topic you could review today?",
  ],
  burnout: [
    "Your well-being comes first. If you're feeling burnt out, that's your mind telling you to rest.",
    "Taking a day off to recharge isn't giving up - it's preparing yourself to come back stronger.",
    "Burnout happens when we push too hard for too long. Let's think about adding some balance to your routine.",
  ],
  default: [
    "I'm here to listen. Whatever you're going through, you don't have to face it alone.",
    "It's brave of you to reach out. How are you really feeling today?",
    "Remember, your worth isn't defined by a single exam. You're so much more than your JEE score.",
  ],
};

const moodOptions: MoodOption[] = [
  { icon: Smile, label: "Doing okay", value: "okay" },
  { icon: Meh, label: "Feeling low", value: "low" },
  { icon: Frown, label: "Really struggling", value: "struggling" },
];

const quickPrompts = [
  "I'm feeling stressed about my preparation",
  "I can't focus on studies lately",
  "I'm scared about the exam results",
  "I feel like giving up sometimes",
  "I'm not sleeping well these days",
  "My parents expect too much from me",
];

/* ----------------------------- Component ----------------------------- */

export default function SupportPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme classes
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm") || lowerMessage.includes("pressure")) {
      return supportResponses.stress[Math.floor(Math.random() * supportResponses.stress.length)];
    }
    if (lowerMessage.includes("anxi") || lowerMessage.includes("scared") || lowerMessage.includes("worry") || lowerMessage.includes("fear")) {
      return supportResponses.anxiety[Math.floor(Math.random() * supportResponses.anxiety.length)];
    }
    if (lowerMessage.includes("motivation") || lowerMessage.includes("give up") || lowerMessage.includes("can't do") || lowerMessage.includes("hopeless")) {
      return supportResponses.motivation[Math.floor(Math.random() * supportResponses.motivation.length)];
    }
    if (lowerMessage.includes("tired") || lowerMessage.includes("exhaust") || lowerMessage.includes("burnout") || lowerMessage.includes("sleep")) {
      return supportResponses.burnout[Math.floor(Math.random() * supportResponses.burnout.length)];
    }
    
    return supportResponses.default[Math.floor(Math.random() * supportResponses.default.length)];
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay for a more calming experience
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: getResponse(messageText),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    
    let response = "";
    switch (mood) {
      case "okay":
        response = "I'm glad to hear you're doing okay. Remember, even on good days, it's important to take care of yourself. Is there anything you'd like to talk about?";
        break;
      case "low":
        response = "Thank you for sharing that with me. It's okay to have low days - they're part of the journey. Would you like to tell me more about what's on your mind?";
        break;
      case "struggling":
        response = "I'm really glad you reached out. When we're struggling, talking about it can help. I'm here to listen without any judgment. Take your time and share what you're comfortable with.";
        break;
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      text: response,
      timestamp: new Date(),
    };
    setMessages([botMessage]);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className={`w-6 h-6 ${theme === "dark" ? "text-rose-400" : "text-rose-500"}`} />
            <h1 className={`text-2xl font-semibold ${textPrimary}`}>Emotional Support</h1>
          </div>
          <p className={`${textSecondary} max-w-md mx-auto`}>
            A safe space to talk about how you're feeling. No judgment, just support.
          </p>
        </motion.div>

        {/* Mood Selection (shown initially) */}
        {messages.length === 0 && !selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <p className={`${textSecondary} mb-6`}>How are you feeling today?</p>
            <div className="flex gap-4 mb-8">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                return (
                  <motion.button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${cardBg} border ${cardBorder} rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:border-neutral-500`}
                  >
                    <Icon className={`w-10 h-10 ${textSecondary}`} />
                    <span className={`text-sm ${textSecondary}`}>{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className={`${cardBg} border ${cardBorder} rounded-xl p-5 max-w-md`}>
              <p className={`text-sm ${textSecondary} text-center`}>
                💡 This is not a substitute for professional mental health support. 
                If you're in crisis, please reach out to a counselor or helpline.
              </p>
            </div>
          </motion.div>
        )}

        {/* Chat Interface */}
        {(messages.length > 0 || selectedMood) && (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"
                          : `${cardBg} border ${cardBorder}`
                      }`}
                    >
                      {message.type === "bot" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className={`w-4 h-4 ${theme === "dark" ? "text-rose-400" : "text-rose-500"}`} />
                          <span className={`text-xs ${textSecondary}`}>Support Companion</span>
                        </div>
                      )}
                      <p className={`${textPrimary} text-sm leading-relaxed`}>{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`${cardBg} border ${cardBorder} rounded-2xl px-4 py-3`}>
                    <div className="flex items-center gap-2">
                      <Heart className={`w-4 h-4 ${theme === "dark" ? "text-rose-400" : "text-rose-500"}`} />
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-neutral-500" : "bg-neutral-400"}`}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <p className={`text-xs ${textSecondary} mb-2`}>You might want to talk about:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className={`px-3 py-1.5 rounded-full text-xs ${inputBg} ${textSecondary} hover:${textPrimary} transition-colors`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-2 flex items-center gap-2`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Share what's on your mind..."
                className={`flex-1 bg-transparent ${textPrimary} placeholder:${textSecondary} px-3 py-2 focus:outline-none text-sm`}
              />
              <motion.button
                onClick={() => handleSend()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim()}
                className={`p-2.5 rounded-lg transition-colors ${
                  input.trim()
                    ? theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white"
                    : `${inputBg} ${textSecondary}`
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Disclaimer */}
            <p className={`text-[10px] ${textSecondary} text-center mt-3`}>
              This is a supportive companion, not a replacement for professional help. 
              For emergencies, contact iCall: 9152987821
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
