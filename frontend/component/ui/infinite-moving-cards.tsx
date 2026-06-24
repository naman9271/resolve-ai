"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { Star } from "lucide-react";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  rating?: number;
  avatar?: string;
}

interface InfiniteMovingCardsProps {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "right",
  speed = "slow",
  className = "",
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const { theme } = useTheme();

  const speedMap = {
    slow: "80s",
    normal: "50s",
    fast: "30s"
  };

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      
      // Duplicate items for seamless loop
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Set CSS variables for animation
      containerRef.current.style.setProperty("--animation-duration", prefersReducedMotion ? "0s" : speedMap[speed]);
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      setStart(!prefersReducedMotion);
    }
  }, [direction, speed]);

  // Theme-aware classes - neutral colors only
  const cardBg = theme === "dark" 
    ? "bg-neutral-900" 
    : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textQuote = theme === "dark" ? "text-neutral-300" : "text-neutral-700";
  const textName = theme === "dark" ? "text-neutral-100" : "text-neutral-900";
  const textTitle = theme === "dark" ? "text-neutral-500" : "text-neutral-500";
  const borderDivider = theme === "dark" ? "border-neutral-800" : "border-neutral-200";

  return (
    <div
      ref={containerRef}
      className={`scroller relative w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)] ${className}`}
    >
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 80s) linear infinite;
          animation-direction: var(--animation-direction, normal);
        }
        .scroller:hover .animate-scroll {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
          }
        }
      `}</style>
      <div
        ref={scrollerRef}
        className={`flex gap-6 w-max flex-nowrap ${start ? 'animate-scroll' : ''}`}
      >
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`flex-shrink-0 w-[340px] p-6 ${cardBg} border ${cardBorder} rounded-2xl transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Rating Stars */}
            {item.rating && (
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.rating! 
                        ? "text-neutral-400 fill-neutral-400" 
                        : theme === "dark" ? "text-neutral-700" : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
            )}
            <blockquote className={`${textQuote} text-sm leading-relaxed mb-4`}>
              "{item.quote}"
            </blockquote>
            <div className={`border-t ${borderDivider} pt-4 flex items-center gap-3`}>
              {item.avatar ? (
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  theme === "dark" 
                    ? "bg-neutral-800 text-neutral-300" 
                    : "bg-neutral-100 text-neutral-600"
                }`}>
                  {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div>
                <div className={`font-semibold ${textName} text-sm`}>{item.name}</div>
                <div className={`${textTitle} text-xs`}>{item.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Two-row testimonials component with opposite directions
export function TwoRowMovingCards({
  items,
  speed = "slow",
}: {
  items: Testimonial[];
  speed?: "slow" | "normal" | "fast";
}) {
  // Split items into two rows
  const firstRow = items.slice(0, Math.ceil(items.length / 2));
  const secondRow = items.slice(Math.ceil(items.length / 2));

  return (
    <div className="flex flex-col gap-6 py-4">
      <InfiniteMovingCards items={firstRow} direction="left" speed={speed} />
      <InfiniteMovingCards items={secondRow} direction="right" speed={speed} />
    </div>
  );
}