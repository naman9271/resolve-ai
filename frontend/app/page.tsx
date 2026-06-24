"use client";
import { TextHoverEffect } from "../component/ui/text-hover-effect";
import { ChatInterface } from "../component/ui/chat-interface";
import { Navbar } from "../component/ui/navbar";
import { TextReveal } from "../component/ui/text-reveal";
import { Background } from "../component/ui/background";
import { Footer } from "../component/ui/footer";
import { InfiniteMovingCardsDemo } from "../component/ui/moving-cards";
import { WhatsAppChatRecordings } from "../component/ui/whatsapp-chat-recording";
import { BookOpen, Brain, Users, TrendingUp, Calendar, MessageCircle, Zap, Target, CheckCircle, Pencil, Sparkles, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { CreativePricing, type PricingTier } from "@/components/ui/creative-pricing";
import { FAQ } from "@/components/ui/faq-section";

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Theme-aware classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const textPrimary = theme === "dark" ? "text-neutral-100" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const textMuted = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const cardBg = theme === "dark" ? "bg-neutral-950" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const lineAccent = theme === "dark" 
    ? "from-neutral-800 via-neutral-700 to-transparent" 
    : "from-neutral-300 via-neutral-200 to-transparent";
  const iconColor = theme === "dark" ? "text-neutral-600" : "text-neutral-400";
  const iconHover = theme === "dark" ? "group-hover:text-neutral-400" : "group-hover:text-neutral-600";
  const numberColor = theme === "dark" ? "text-neutral-700" : "text-neutral-400";
  const borderSection = theme === "dark" ? "border-neutral-900" : "border-neutral-200";
  const ctaBg = theme === "dark" ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-900 text-white hover:bg-neutral-800";
  const ctaSecondary = theme === "dark" 
    ? "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white hover:bg-neutral-800/50" 
    : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-100";

  // Pricing tiers for JEE preparation - Free for April 2026 aspirants
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      icon: <Pencil className="w-6 h-6" />,
      price: 0,
      description: "For April 2026 JEE Aspirants",
      color: "green",
      features: [
        "WhatsApp Bot (10 messages)",
        "Lily Emotional Support (10 chats)",
        "Resolve AI (5 doubts)",
        "Daily Planner",
        "Performance Analysis & Streaks",
        "1 Week Full Access Trial",
        "Formula Sheets (11th + 12th)",
        "Mentor Sessions @ ₹200/30min",
      ],
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-6 h-6" />,
      price: 500,
      description: "Unlimited access for serious aspirants",
      color: "purple",
      features: [
        "All Free Features Included",
        "Unlimited WhatsApp Chatbot",
        "Unlimited Lily (Emotional Support)",
        "Unlimited Resolve AI Doubts",
        "2 Free Mentor Sessions + ₹100/30min",
        "Group Study Rooms (Unlimited)",
        "Multilingual Support",
        "Paid College Counselling Access",
      ],
      popular: true,
    },
  ];

  return (
    <div className={`min-h-screen ${bgMain} relative transition-colors duration-300`}>
      <Background />
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section   Dominant & Emotional */}
      <section className="relative min-h-[60vh] flex flex-col justify-start px-6 md:px-12 lg:px-20 pt-28 pb-4">
        {/* Asymmetric positioning   not centered */}
        <div className="max-w-none">
          <TextReveal
            text={t.hero.tagline}
            className={`${textSecondary} text-lg md:text-xl tracking-wide mb-8 ml-1 font-semibold font-sans`}
          />
          <div className="h-40 md:h-48 lg:h-56 w-full flex items-center justify-start">
            <TextHoverEffect text="RESOLVE AI" />
          </div>
        </div>
        
        {/* Subtle line accent */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
          className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${lineAccent} origin-left`}
        />
      </section>

      {/* Chatbot Section — Immediately Below Hero */}
      <section className="px-6 md:px-12 lg:px-20 py-8 md:py-12 -mt-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left side — Entry point */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4 lg:sticky lg:top-24"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className={`${textSecondary} text-xs tracking-widest uppercase font-medium`}>{t.chat.startHere}</p>
                  <h2 className={`text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight ${textPrimary} tracking-tight`}>
                    {t.chat.askFirstDoubt}
                  </h2>
                  <div className={`w-8 h-px bg-gradient-to-r ${lineAccent}`}></div>
                </div>
                <p className={`${textSecondary} text-base leading-relaxed`}>
                  {t.chat.noSignUp}
                </p>
              </div>
            </motion.div>

            {/* Right side — Chatbot */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-8 flex justify-center items-center"
            >
              <div className="w-full max-w-3xl">
                <ChatInterface />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chatbot Recordings Section */}
      <WhatsAppChatRecordings />

      {/* Features Section — Clean Grid */}
      <section id="features" className="px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight max-w-4xl tracking-tight ${textPrimary}`}>
            {t.features.title}
          </h2>
        </motion.div>

        {/* Feature grid — NO meteors, NO glow */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* AI Doubt Solver — Large card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`md:col-span-7 ${cardBg} border ${cardBorder} p-8 md:p-10 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-16">
              <Brain className={`w-6 h-6 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>01</span>
            </div>
            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 ${textPrimary}`}>{t.features.aiDoubtSolver}</h3>
            <p className={`${textSecondary} text-base leading-relaxed max-w-md`}>
              {t.features.aiDoubtSolverDesc}
            </p>
          </motion.div>

          {/* PYQs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className={`md:col-span-5 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <BookOpen className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>02</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>{t.features.pyq}</h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              {t.features.pyqDesc}
            </p>
          </motion.div>

          {/* AI Mentor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className={`md:col-span-4 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <Zap className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>03</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>
              {t.features.aiMentor} <span className={`${textSecondary} text-sm font-medium`}>({t.common.free})</span>
            </h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              {t.features.aiMentorDesc}
            </p>
          </motion.div>

          {/* Human Mentors */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className={`md:col-span-4 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <Users className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>04</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>
              {t.features.humanMentors} <span className={`${textSecondary} text-sm font-medium`}>({t.common.paid})</span>
            </h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              {t.features.humanMentorsDesc}
            </p>
          </motion.div>

          {/* Performance Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={`md:col-span-4 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <TrendingUp className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>05</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>{t.features.performance}</h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              {t.features.performanceDesc}
            </p>
          </motion.div>

          {/* Smart Timetable */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className={`md:col-span-6 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <Calendar className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>06</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>{t.features.timetable}</h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              {t.features.timetableDesc}
            </p>
          </motion.div>

          {/* WhatsApp Bot — NEW CARD */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className={`md:col-span-6 ${cardBg} border ${cardBorder} p-8 rounded-sm hover:border-neutral-500 transition-all duration-300 group hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-12">
              <Smartphone className={`w-5 h-5 ${iconColor} ${iconHover} transition-colors`} />
              <span className={`${numberColor} text-xs tracking-widest`}>07</span>
            </div>
            <h3 className={`text-xl md:text-2xl lg:text-3xl font-semibold mb-3 ${textPrimary}`}>WhatsApp Bot</h3>
            <p className={`${textSecondary} text-base leading-relaxed`}>
              Daily reminders, instant doubt solving, and emotional check-ins — all on WhatsApp. No app downloads needed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Resolve AI Section — NO glow, clean cards */}
      <section id="how-it-works" className={`px-6 md:px-12 lg:px-20 py-20 md:py-32 border-t ${borderSection}`}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight ${textPrimary}`}>
              {t.why.title}
            </h2>
            <p className={`${textSecondary} mt-4 text-base leading-relaxed`}>
              {t.why.subtitle || "Join thousands of students who've transformed their JEE preparation"}
            </p>
          </motion.div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className={`h-full ${cardBg} border ${cardBorder} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center mb-4`}>
                  <Target className={`w-6 h-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>{t.why.card1Title || "Built for JEE"}</h3>
                <p className={`${textSecondary} text-sm leading-relaxed`}>{t.why.reason1}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              viewport={{ once: true }}
            >
              <div className={`h-full ${cardBg} border ${cardBorder} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center mb-4`}>
                  <Users className={`w-6 h-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>{t.why.card2Title || "AI + Human Mentors"}</h3>
                <p className={`${textSecondary} text-sm leading-relaxed`}>{t.why.reason2}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`h-full ${cardBg} border ${cardBorder} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center mb-4`}>
                  <CheckCircle className={`w-6 h-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>{t.why.card3Title || "Consistency Focus"}</h3>
                <p className={`${textSecondary} text-sm leading-relaxed`}>{t.why.reason3}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <div className={`h-full ${cardBg} border ${cardBorder} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center mb-4`}>
                  <Smartphone className={`w-6 h-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>WhatsApp Bots</h3>
                <p className={`${textSecondary} text-sm leading-relaxed`}>
                  Mentor support and emotional check-ins right on WhatsApp — available 24/7 when you need guidance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight ${textPrimary} mb-4`}>
              {t.testimonials.title}
            </h2>
            <p className={`${textSecondary} text-lg max-w-2xl mx-auto`}>
              {t.testimonials.subtitle}
            </p>
          </div>
          <InfiniteMovingCardsDemo />
        </motion.div>
      </section>

      {/* WhatsApp Support Section */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`border ${cardBorder} ${theme === "dark" ? "bg-neutral-950" : "bg-white"} p-8 md:p-12 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-8`}
        >
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center flex-shrink-0`}>
              <MessageCircle className={`w-7 h-7 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`} />
            </div>
            <div>
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 ${textPrimary}`}>
                {t.whatsapp.title}
              </h2>
              <p className={`${textSecondary} text-base leading-relaxed max-w-lg`}>
                {t.whatsapp.description}
              </p>
            </div>
          </div>
          <a href="https://wa.me/your_number" target="_blank" rel="noopener noreferrer" className={`px-6 py-3 border ${ctaSecondary} transition-all duration-300 rounded-sm whitespace-nowrap inline-block text-center`}>
            {t.whatsapp.connect}
          </a>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`px-6 md:px-12 lg:px-20 py-20 md:py-32 border-t ${borderSection}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CreativePricing
            tag="JEE Preparation Plans"
            title="Start Your JEE Journey"
            description="Choose the plan that fits your preparation needs"
            tiers={pricingTiers}
          />
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className={`px-6 md:px-12 lg:px-20 border-t ${borderSection}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FAQ />
        </motion.div>
      </section>

      {/* Footer line */}
      <div className={`h-px ${theme === "dark" ? "bg-neutral-900" : "bg-neutral-200"}`} />
      </div>
      <Footer />
    </div>
  );
}
