"use client";
import { motion } from "framer-motion";

export const SlidingHeading = ({ text }: { text: string }) => {
  return (
    <div className="overflow-hidden w-full">
      <motion.h1
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{
          duration: 2.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="text-[12vw] md:text-[14vw] lg:text-[16vw] font-light tracking-[-0.04em] text-white leading-[0.85] select-none"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
};
