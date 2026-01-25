"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/component/ui/navbar";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      text: "Hi! I'm your AI study partner for JEE. Ask me anything about Physics, Chemistry, or Maths. I can explain concepts, solve problems, and help you with your doubts! 🎯",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will connect to actual backend later)
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        default: `Great question! Let me help you with that.

Based on your query about "${userMessage.text.slice(0, 50)}...", here's what you need to know:

This is a placeholder response. Once connected to the AI backend (Naman's LLM engine), you'll get detailed explanations with:
- Step-by-step solutions
- Conceptual explanations
- Related PYQ references
- Visual diagrams when needed

Would you like me to elaborate on any specific part?`,
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: aiResponses.default,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-medium">AI Doubt Solver</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-neutral-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-cyan-600 text-white rounded-2xl rounded-tr-md"
                      : "bg-neutral-800 text-neutral-100 rounded-2xl rounded-tl-md"
                  } px-4 py-3`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-cyan-200"
                        : "text-neutral-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-neutral-300" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-sm text-neutral-400">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-sm px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 transition-colors">
              <button className="text-neutral-500 hover:text-cyan-400 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your doubt... (e.g., Explain Newton's laws)"
                className="flex-1 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-neutral-500 hover:text-cyan-400 disabled:opacity-50 disabled:hover:text-neutral-500 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              AI can make mistakes. Verify important concepts from your study material.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
