"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * AI Context Handler
 * Provides page-aware AI interactions
 * Different AI behaviors based on context (dashboard ≠ chatbot ≠ emotional support)
 */

export type AIContextType = 
  | "dashboard"
  | "pyq"
  | "chat"
  | "mentors"
  | "planner"
  | "activity"
  | "resources"
  | "support"
  | "counselling";

interface AIContextConfig {
  systemPrompt: string;
  placeholder: string;
  welcomeMessage: string;
  tone: "academic" | "supportive" | "professional" | "casual";
  allowsTechnicalQuestions: boolean;
}

const contextConfigs: Record<AIContextType, AIContextConfig> = {
  dashboard: {
    systemPrompt: "You are a helpful JEE preparation assistant. Provide concise, encouraging responses. Focus on productivity and study tips.",
    placeholder: "Ask about your study plan...",
    welcomeMessage: "How can I help you today?",
    tone: "casual",
    allowsTechnicalQuestions: true,
  },
  pyq: {
    systemPrompt: "You are an expert JEE tutor helping with Previous Year Questions. Provide step-by-step solutions and explain concepts clearly.",
    placeholder: "Ask about this question...",
    welcomeMessage: "Need help understanding a question? I'm here to explain.",
    tone: "academic",
    allowsTechnicalQuestions: true,
  },
  chat: {
    systemPrompt: "You are Resolve AI, an expert JEE preparation tutor. You excel in Physics, Chemistry, and Mathematics. Provide detailed explanations with examples. Use markdown formatting.",
    placeholder: "Ask your doubt... (e.g., Explain Newton's laws)",
    welcomeMessage: "Welcome! I can help with Physics, Chemistry, and Mathematics concepts, solve problems, and explain PYQs.",
    tone: "academic",
    allowsTechnicalQuestions: true,
  },
  mentors: {
    systemPrompt: "You help students find the right mentor for their needs. Provide guidance on choosing mentors based on their goals.",
    placeholder: "What kind of mentor are you looking for?",
    welcomeMessage: "Looking for guidance on choosing a mentor?",
    tone: "professional",
    allowsTechnicalQuestions: false,
  },
  planner: {
    systemPrompt: "You are a study planning assistant. Help create effective study schedules, manage time, and optimize learning strategies.",
    placeholder: "Need help planning your studies?",
    welcomeMessage: "Let me help you plan your study schedule.",
    tone: "professional",
    allowsTechnicalQuestions: false,
  },
  activity: {
    systemPrompt: "You provide insights on study performance and suggest improvements based on activity patterns.",
    placeholder: "Ask about your progress...",
    welcomeMessage: "Want insights on your study patterns?",
    tone: "casual",
    allowsTechnicalQuestions: false,
  },
  resources: {
    systemPrompt: "You help students find the right study resources - notes, videos, and practice tests for their preparation.",
    placeholder: "What topic do you need resources for?",
    welcomeMessage: "Looking for specific study materials?",
    tone: "casual",
    allowsTechnicalQuestions: false,
  },
  support: {
    systemPrompt: "You are a supportive companion for JEE students dealing with stress, anxiety, or burnout. Be empathetic, calm, and non-judgmental. Never provide academic help - focus only on emotional well-being. Suggest breaks, breathing exercises, and self-care.",
    placeholder: "Share what's on your mind...",
    welcomeMessage: "I'm here to listen. How are you feeling today?",
    tone: "supportive",
    allowsTechnicalQuestions: false,
  },
  counselling: {
    systemPrompt: "You provide guidance on college selection after JEE. Help with understanding ranks, branches, and college types. Be factual and avoid making false promises.",
    placeholder: "Ask about colleges or branches...",
    welcomeMessage: "Need help understanding your options after JEE?",
    tone: "professional",
    allowsTechnicalQuestions: false,
  },
};

interface AIContextValue {
  currentContext: AIContextType;
  setContext: (context: AIContextType) => void;
  getConfig: () => AIContextConfig;
  generateResponse: (message: string) => Promise<string>;
}

const AIContext = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [currentContext, setCurrentContext] = useState<AIContextType>("dashboard");

  const setContext = useCallback((context: AIContextType) => {
    setCurrentContext(context);
  }, []);

  const getConfig = useCallback(() => {
    return contextConfigs[currentContext];
  }, [currentContext]);

  // Frontend-only response generation
  // In production, this would call the actual AI backend
  const generateResponse = useCallback(async (message: string): Promise<string> => {
    const config = contextConfigs[currentContext];
    
    // Simulate response delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For emotional support context, provide supportive responses
    if (currentContext === "support") {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
        return "I hear you. JEE preparation can feel overwhelming at times. Remember, it's okay to take breaks. Would you like to talk about what's specifically making you feel stressed?";
      }
      
      if (lowerMessage.includes("anxi") || lowerMessage.includes("scared")) {
        return "Feeling anxious is completely normal before exams. Let's take a deep breath together. What's one small thing you can do right now to feel a bit more in control?";
      }
      
      if (lowerMessage.includes("tired") || lowerMessage.includes("burnout")) {
        return "Your well-being comes first. If you're feeling burnt out, it's your mind telling you to rest. Taking a break isn't giving up - it's preparing yourself to come back stronger.";
      }
      
      return "Thank you for sharing that with me. Remember, you're not alone in this journey. Is there anything specific you'd like to talk about?";
    }
    
    // For counselling context
    if (currentContext === "counselling") {
      return "Based on typical JEE patterns, I'd recommend researching both IITs and NITs for your rank range. The best approach is to prioritize branch choice over college brand for most students. Would you like more specific information?";
    }
    
    // Default response for other contexts
    return `I understand you're asking about: "${message}". For detailed help on this topic, please use the AI Doubt Solver in the main chat section.`;
  }, [currentContext]);

  return (
    <AIContext.Provider value={{
      currentContext,
      setContext,
      getConfig,
      generateResponse,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}

export { contextConfigs };
