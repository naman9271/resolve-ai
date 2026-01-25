"use client";
import { TextHoverEffect } from "../component/ui/text-hover-effect";
import { ChatInterface } from "../component/ui/chat-interface";
import { Navbar } from "../component/ui/navbar";
import { TextReveal } from "../component/ui/text-reveal";
import { Background } from "../component/ui/background";
import { FloatingDockDemo } from "../component/ui/dock";
import { Footer } from "../component/ui/footer";
import { InfiniteMovingCardsDemo } from "../component/ui/moving-cards";
import { BookOpen, Brain, Users, TrendingUp, Calendar, MessageCircle, Zap, Target, Heart, CheckCircle } from "lucide-react";
import { MeteorsDemo } from "../component/ui/meteor";
import { Meteors } from "../component/ui/meteors";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative">
      <Background />
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section — Dominant & Emotional */}
      <section className="relative min-h-[60vh] flex flex-col justify-start px-6 md:px-12 lg:px-20 pt-28 pb-4">
        {/* Asymmetric positioning — not centered */}
        <div className="max-w-none">
          <TextReveal
            text="Your AI study partner for JEE — doubts, discipline, and direction."
            className="text-gray-300 text-lg md:text-xl tracking-wide mb-8 ml-1 font-semibold font-sans"
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
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neutral-800 via-neutral-700 to-transparent origin-left"
        />
      </section>

      {/* Chatbot Section — Immediately Below Hero */}
      <section className="px-6 md:px-12 lg:px-20 py-8 md:py-12 -mt-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left side — Entry point */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-4 lg:sticky lg:top-24"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-cyan-500/70 text-xs tracking-widest uppercase font-medium">Start here</p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-cyan-100 tracking-tight hover:text-white transition-colors duration-300">
                    Ask your first doubt.
                  </h2>
                  <div className="w-8 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                </div>
                <p className="text-neutral-400 text-base leading-relaxed hover:text-neutral-300 transition-colors duration-300">
                  No sign up required. Just type your question and get started with your preparation.
                </p>
              </div>
            </motion.div>

            {/* Right side — Chatbot */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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

      {/* Features Section — Asymmetric Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight max-w-4xl tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-blue-300 hover:via-cyan-300 hover:to-blue-400 transition-all duration-500">
            Everything a JEE Student Needs — In One Place
          </h2>
        </motion.div>

        {/* Asymmetric feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* AI Doubt Solver — Large card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-7 bg-neutral-950 border border-neutral-800 p-8 md:p-10 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-16">
                <Brain className="w-6 h-6 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">01</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-400 transition-all duration-300">AI Doubt Solver</h3>
              <p className="text-neutral-400 text-base leading-relaxed max-w-md group-hover:text-neutral-300 transition-colors duration-300">
                Ask doubts using text or images and get instant explanations.
              </p>
            </div>
            <Meteors number={12} />
          </motion.div>

          {/* PYQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-5 bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <BookOpen className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">02</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">Previous Year Questions (PYQs)</h3>
              <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                Chapter-wise and difficulty-wise PYQs for JEE Main & Advanced.
              </p>
            </div>
            <Meteors number={10} />
          </motion.div>

          {/* AI Mentor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <Zap className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">03</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">
                AI Mentor <span className="text-cyan-500 text-sm font-medium group-hover:text-cyan-400 transition-colors duration-300">(Free)</span>
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                Get guidance, motivation, and study help from an AI mentor.
              </p>
            </div>
            <Meteors number={8} />
          </motion.div>

          {/* Human Mentors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <Users className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">04</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">
                Human Mentors <span className="text-violet-400 text-sm font-medium group-hover:text-violet-300 transition-colors duration-300">(Paid)</span>
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                Talk to IIT/NIT students for real exam strategies and guidance.
              </p>
            </div>
            <Meteors number={8} />
          </motion.div>

          {/* Performance Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <TrendingUp className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">05</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">Performance Analysis</h3>
              <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                Know your weak chapters and track your progress visually.
              </p>
            </div>
            <Meteors number={10} />
          </motion.div>

          {/* Smart Timetable — wider card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-6 bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <Calendar className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                <span className="text-neutral-700 text-xs tracking-widest">06</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">Smart Timetable & Habit Tracker</h3>
              <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                Auto-generated study plans with daily habit tracking.
              </p>
            </div>
            <Meteors number={12} />
          </motion.div>

          {/* Live Study Sessions (meteors demo) */}
          <div className="hidden md:block md:col-span-6">
            <MeteorsDemo />
          </div>
        </div>
      </section>

      {/* Why Resolve AI Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-32 border-t border-neutral-900">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent hover:from-violet-300 hover:to-blue-400 transition-all duration-500">
              Why Students Choose Resolve AI
            </h2>
          </motion.div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="relative z-10 p-4 rounded-lg hover:bg-neutral-900/30 transition-colors duration-300">
                <Target className="w-5 h-5 text-neutral-700 mb-4 group-hover:text-neutral-500 transition-colors" />
                <p className="text-neutral-300 text-base leading-relaxed font-medium group-hover:text-white transition-colors duration-300">Built for JEE students only</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="relative z-10 p-4 rounded-lg hover:bg-neutral-900/30 transition-colors duration-300">
                <Users className="w-5 h-5 text-neutral-700 mb-4 group-hover:text-neutral-500 transition-colors" />
                <p className="text-neutral-300 text-base leading-relaxed font-medium group-hover:text-white transition-colors duration-300">Combines AI + real mentors</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="relative z-10 p-4 rounded-lg hover:bg-neutral-900/30 transition-colors duration-300">
                <CheckCircle className="w-5 h-5 text-neutral-700 mb-4 group-hover:text-neutral-500 transition-colors" />
                <p className="text-neutral-300 text-base leading-relaxed font-medium group-hover:text-white transition-colors duration-300">Focuses on consistency, not pressure</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="relative z-10 p-4 rounded-lg hover:bg-neutral-900/30 transition-colors duration-300">
                <Heart className="w-5 h-5 text-neutral-700 mb-4 group-hover:text-neutral-500 transition-colors" />
                <p className="text-neutral-300 text-base leading-relaxed font-medium group-hover:text-white transition-colors duration-300">Designed to reduce stress and confusion</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Moving Cards Section */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-4">
              What Students Are Saying
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Real feedback from JEE aspirants who've transformed their preparation with Resolve AI
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
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="border border-neutral-800 bg-neutral-950/30 p-8 md:p-12 rounded-sm flex flex-col md:flex-row md:items-center md:justify-between gap-8 group relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-start gap-5">
            <MessageCircle className="w-6 h-6 text-neutral-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-emerald-400 transition-all duration-300">
                Study Help on WhatsApp
              </h2>
              <p className="text-neutral-400 text-base leading-relaxed max-w-lg group-hover:text-neutral-300 transition-colors duration-300">
                Get reminders, daily questions, and quick doubt solving directly on WhatsApp.
              </p>
            </div>
          </div>
          <button className="px-6 py-3 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 hover:text-white hover:bg-neutral-800/50 transition-all duration-300 rounded-sm whitespace-nowrap relative z-10">
            Connect WhatsApp
          </button>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 md:px-12 lg:px-20 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl group relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          <div className="relative z-10 p-6 rounded-lg">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight tracking-tight mb-12 bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent hover:from-blue-300 hover:via-cyan-300 hover:to-violet-400 transition-all duration-500">
              Start Your JEE Preparation the Smart Way
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-black text-sm font-medium hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 rounded-sm">
                Create Free Account
              </button>
              <button className="px-8 py-4 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 hover:text-white hover:bg-neutral-800/50 transition-all duration-300 rounded-sm">
                Start for Free
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer line */}
      <div className="h-px bg-neutral-900" />
      <div className="h-20" />
      <FloatingDockDemo />
      </div>
      <Footer />
    </div>
  );
}
