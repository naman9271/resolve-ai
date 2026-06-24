"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Bot,
  User,
  Loader2,
  ArrowLeft,
  BookOpen,
  Atom,
  FlaskConical,
  Calculator,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { chatApi, ChatMessage } from "@/lib/api";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const suggestedQuestions = [
  {
    icon: Atom,
    subject: "Physics",
    question: "Explain the concept of electromagnetic induction",
  },
  {
    icon: FlaskConical,
    subject: "Chemistry",
    question: "What is the difference between SN1 and SN2 reactions?",
  },
  {
    icon: Calculator,
    subject: "Maths",
    question: "How do I solve integration by parts problems?",
  },
  {
    icon: BookOpen,
    subject: "PYQ",
    question: "Show me JEE Main 2023 Physics questions on Mechanics",
  },
];

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800/50" : "bg-neutral-100";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      text: `# Welcome to Resolve AI! 🎯

I'm your **AI study partner** for JEE preparation. I can help you with:

- 📚 **Concept Explanations** - Deep dive into Physics, Chemistry, and Mathematics
- 🧮 **Problem Solving** - Step-by-step solutions with working
- 📝 **PYQs** - Previous Year Questions with detailed explanations
- 💡 **Doubt Clearing** - Ask anything related to JEE syllabus

**Try asking:**
- "Explain Newton's laws of motion"
- "Show me PYQs on Organic Chemistry"
- "Solve this integral: ∫x²e^x dx"

Let's start your JEE preparation journey! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (text: string) => {
    // Simple markdown-like formatting - theme aware
    const strongClass = theme === "dark" ? "text-cyan-400" : "text-cyan-600";
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-3">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold mt-3 mb-2">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br/>');
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: messageToSend,
      timestamp: new Date(),
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: "ai",
      text: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
    setIsLoading(true);

    const history: ChatMessage[] = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.text,
      }));

    try {
      let fullResponse = "";

      for await (const chunk of chatApi.sendMessageStream(
        messageToSend,
        history
      )) {
        fullResponse += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId ? { ...m, text: fullResponse } : m
          )
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? {
                ...m,
                text:
                  "I apologize, but I encountered an error. Please make sure the backend server is running and the Google API key is configured. Try again in a moment.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex <= 0) return;

    const userMessage = messages[messageIndex - 1];
    if (userMessage.type !== "user") return;

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    await handleSend(userMessage.text);
  };

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen">
        {/* Chat Header */}
        <div className={`border-b ${cardBorder} ${cardBg}/80 backdrop-blur-lg px-6 py-4 sticky top-0 z-10`}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`${textPrimary} font-semibold flex items-center gap-2`}>
                  {t.chat?.title || "Resolve AI"}
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className={`text-xs ${textSecondary}`}>
                    {t.chat?.poweredBy || "Powered by Gemini"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] group ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl rounded-tr-md"
                        : `${cardBg} border ${cardBorder} ${textPrimary} rounded-2xl rounded-tl-md`
                    } px-4 py-3 relative`}
                  >
                    {message.type === "ai" ? (
                      <div className="prose prose-sm max-w-none">
                        <div
                          className={`${theme === "dark" ? "text-white/90" : "text-neutral-800"} leading-relaxed whitespace-pre-wrap`}
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(message.text),
                          }}
                        />
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}

                    {message.type === "ai" && !message.isStreaming && message.id !== "welcome" && (
                      <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${cardBorder} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button
                          onClick={() => handleCopy(message.text, message.id)}
                          className={`${textSecondary} hover:${textPrimary} transition-colors p-1 rounded`}
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRegenerate(message.id)}
                          className={`${textSecondary} hover:${textPrimary} transition-colors p-1 rounded`}
                          title="Regenerate response"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-white/70"
                          : textSecondary
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <div className={`w-8 h-8 rounded-full ${inputBg} flex items-center justify-center flex-shrink-0 mt-1`}>
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className={`w-4 h-4 ${textSecondary}`} />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.text === "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className={`${cardBg} border ${cardBorder} rounded-2xl rounded-tl-md px-4 py-3`}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                    <span className={`text-sm ${textSecondary}`}>{t.chat?.thinking || "Thinking..."}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <p className={`${textSecondary} text-sm mb-3`}>{t.chat?.tryAsking || "Try asking"}:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestionClick(item.question)}
                    className={`flex items-center gap-3 ${cardBg} hover:${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} border ${cardBorder} hover:border-cyan-500/50 rounded-xl px-4 py-3 text-left transition-all group`}
                  >
                    <div className={`p-2 rounded-lg ${inputBg} group-hover:bg-cyan-500/10 transition-colors`}>
                      <item.icon className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-xs text-cyan-500 font-medium">
                        {item.subject}
                      </p>
                      <p className={`text-sm ${textSecondary}`}>{item.question}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`border-t ${cardBorder} ${cardBg}/80 backdrop-blur-lg px-4 py-4 sticky bottom-0`}>
          <div className="max-w-4xl mx-auto">
            <div className={`flex items-center gap-3 ${inputBg} border ${cardBorder} rounded-xl px-4 py-3 focus-within:border-cyan-500/50 transition-all`}>
              <button className={`${textSecondary} hover:${textPrimary} transition-colors`}>
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.chat?.placeholder || "Ask your doubt... (e.g., Explain Newton's laws)"}
                className={`flex-1 bg-transparent ${textPrimary} placeholder:${textSecondary} focus:outline-none text-sm`}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className={`text-xs ${textSecondary} mt-2 text-center`}>
              {t.chat?.disclaimer || "Verify important concepts from your study material"}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
