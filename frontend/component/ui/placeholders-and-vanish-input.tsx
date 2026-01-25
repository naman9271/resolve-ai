"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    let interval: any;
    const startAnimation = () => {
      interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };
    startAnimation();
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const vanishAndSubmit = () => {
    setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow transition duration-200",
        "focus-within:ring-2 focus-within:ring-cyan-500"
      )}
      onSubmit={onSubmit}
    >
      <input
        onChange={onChange}
        placeholder=""
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full pl-4 sm:pl-10 pr-20",
          "focus:ring-0 focus:outline-none"
        )}
      />

      <button
        disabled
        type="submit"
        className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPlaceholder}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-10 pr-12"
          >
            {placeholders[currentPlaceholder]}
          </motion.p>
        </AnimatePresence>
      </div>
    </form>
  );
}