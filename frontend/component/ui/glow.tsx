"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";

export function GlowDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <GlowCard
        icon={<Box className="h-5 w-5 text-cyan-400" />}
        title="AI Doubt Solver"
        description="Get instant explanations for complex JEE problems with step-by-step solutions."
      />

      <GlowCard
        icon={<Settings className="h-5 w-5 text-cyan-400" />}
        title="Smart Study Plans"
        description="Personalized timetables that adapt to your learning pace and schedule."
      />

      <GlowCard
        icon={<Lock className="h-5 w-5 text-cyan-400" />}
        title="24/7 Access"
        description="Study anytime, anywhere with our mobile-friendly platform."
      />

      <GlowCard
        icon={<Sparkles className="h-5 w-5 text-cyan-400" />}
        title="Progress Tracking"
        description="Monitor your improvement with detailed analytics and insights."
      />

      <GlowCard
        icon={<Search className="h-5 w-5 text-cyan-400" />}
        title="Previous Year Papers"
        description="Practice with real JEE questions and understand exam patterns."
      />
    </div>
  );
}

interface GlowCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GlowCard = ({ icon, title, description }: GlowCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:border-cyan-500/50 hover:bg-neutral-900/80 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800/50 border border-neutral-700/50 group-hover:border-cyan-500/30 transition-colors duration-300">
          {icon}
        </div>

        <h3 className="mb-3 text-lg font-semibold text-white group-hover:text-cyan-100 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};
