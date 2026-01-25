"use client";

import React from "react";
import { Meteors } from "./meteors";
import { Sparkles } from "lucide-react";

export function MeteorsDemo() {
  return (
    <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-sm hover:border-neutral-700 transition-colors duration-500 group relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-12">
          <Sparkles className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
          <span className="text-neutral-700 text-xs tracking-widest">07</span>
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white group-hover:text-neutral-100 transition-colors duration-300">
          Live Study Sessions
        </h3>
        <p className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
          Join live doubt-solving sessions and group study rooms.
        </p>
      </div>
      {/* Meteor effect */}
      <Meteors number={20} />
    </div>
  );
}
