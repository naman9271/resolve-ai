"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}

export function InfiniteMovingCards({
  items,
  direction = "right",
  speed = "slow"
}: InfiniteMovingCardsProps) {
  const [isPaused, setIsPaused] = useState(false);

  const speedMap = {
    slow: 5,
    normal: 3,
    fast: 2
  };

  const duplicatedItems = [...items, ...items]; // Duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={isPaused ? {} : {
          x: direction === "right" ? [-100 * items.length, 0] : [0, -100 * items.length]
        }}
        transition={{
          duration: speedMap[speed],
          repeat: isPaused ? 0 : Infinity,
          ease: "linear"
        }}
        style={{ width: `${200 * duplicatedItems.length}%` }}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            className="flex-shrink-0 w-80 p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg backdrop-blur-sm cursor-pointer"
            whileHover={{
              scale: 1.05,
              y: -5
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut"
            }}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
          >
            <blockquote className="text-neutral-300 text-sm leading-relaxed mb-4 italic">
              "{item.quote}"
            </blockquote>
            <div className="border-t border-neutral-700 pt-4">
              <div className="font-semibold text-white text-sm">{item.name}</div>
              <div className="text-neutral-400 text-xs">{item.title}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}