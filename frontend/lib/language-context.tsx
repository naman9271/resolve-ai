"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useTheme } from "./theme-context";

// Import JSON translation files
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";

// Supported languages based on JEE language options
export type Language = 
  | "en" // English
  | "hi" // Hindi
  | "as" // Assamese
  | "bn" // Bengali
  | "gu" // Gujarati
  | "kn" // Kannada
  | "ml" // Malayalam
  | "mr" // Marathi
  | "or" // Odia
  | "pa" // Punjabi
  | "ta" // Tamil
  | "te" // Telugu
  | "ur"; // Urdu

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
];

// Type for translations (derived from JSON structure)
export type Translations = typeof enMessages;

// All translations map
const TRANSLATIONS: Record<Language, Translations> = {
  en: enMessages,
  hi: hiMessages,
  // For other languages, fallback to English (in production, add full translations)
  as: enMessages,
  bn: enMessages,
  gu: enMessages,
  kn: enMessages,
  ml: enMessages,
  mr: enMessages,
  or: enMessages,
  pa: enMessages,
  ta: enMessages,
  te: enMessages,
  ur: enMessages,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languages: LanguageInfo[];
  currentLanguage: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved preference
    const savedLang = localStorage.getItem("resolve-language") as Language | null;
    if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Update localStorage and document lang
    localStorage.setItem("resolve-language", language);
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language] || enMessages;
  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ 
        language: "en", 
        setLanguage, 
        t: enMessages, 
        languages: SUPPORTED_LANGUAGES,
        currentLanguage: SUPPORTED_LANGUAGES[0]
      }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      languages: SUPPORTED_LANGUAGES,
      currentLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Language Switcher Component
export function LanguageSwitcher({ 
  className = "", 
  openUpward = false,
  isCompact = false 
}: { 
  className?: string;
  openUpward?: boolean;
  isCompact?: boolean;
}) {
  const { language, setLanguage, languages, currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const borderColor = theme === "dark" ? "border-neutral-700" : "border-neutral-200";
  const textColor = theme === "dark" ? "text-neutral-300" : "text-neutral-700";
  const hoverBg = theme === "dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-100";
  const buttonBg = theme === "dark" ? "bg-neutral-800/50" : "bg-neutral-100/80";
  const iconButtonBg = theme === "dark" ? "bg-neutral-800/50" : "bg-neutral-200/80";
  const iconButtonHover = theme === "dark" ? "hover:bg-neutral-700" : "hover:bg-neutral-300";

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={isCompact 
          ? `p-2 rounded-lg ${iconButtonBg} ${iconButtonHover} ${textColor} transition-all duration-200`
          : `w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg ${buttonBg} ${textColor} ${hoverBg} transition-all duration-200 font-mono`
        }
      >
        {isCompact ? (
          <span className="text-lg">{currentLanguage.flag}</span>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="text-xs font-medium">{currentLanguage.nativeName}</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className={`absolute ${isCompact ? 'left-0' : 'right-0'} ${openUpward ? 'bottom-full mb-2' : 'mt-2'} w-56 rounded-xl shadow-xl ${bgColor} border ${borderColor} z-50 overflow-hidden max-h-80 overflow-y-auto`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${hoverBg} transition-colors ${
                  language === lang.code ? (theme === "dark" ? "bg-neutral-800" : "bg-neutral-100") : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                    {lang.name}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                    {lang.nativeName}
                  </p>
                </div>
                {language === lang.code && (
                  <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
