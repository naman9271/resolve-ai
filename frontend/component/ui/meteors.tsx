"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MeteorsProps {
  number?: number;
}

export function Meteors({ number = 20 }: MeteorsProps) {
  const [meteors, setMeteors] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const newMeteors = Array.from({ length: number }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 2 + Math.random() * 3,
    }));
    setMeteors(newMeteors);
  }, [number]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute transform -rotate-20"
          style={{
            left: `${meteor.x}%`,
            top: "-20px",
          }}
          initial={{ y: -10, opacity: 0, x: 0 }}
          animate={{
            y: [ -10, 1200 ],
            x: [0, 60],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Meteor head */}
          <div className="w-2 h-2 bg-white rounded-full mb-1 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
          {/* Meteor trail */}
          <div className="w-0.5 h-28 bg-gradient-to-b from-cyan-300 via-blue-400 to-transparent opacity-100 blur-sm" />
        </motion.div>
      ))}
    </div>
  );
}