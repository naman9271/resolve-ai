"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

export function BackgroundRippleEffect() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
  const { theme } = useTheme();

  // Theme-aware colors
  const bgColor = theme === "dark" ? "bg-black" : "bg-cream-50";
  const borderColor = theme === "dark" ? "border-neutral-900" : "border-neutral-200/50";
  const hoverBg = theme === "dark" ? "rgba(34, 211, 238, 0.05)" : "rgba(34, 211, 238, 0.08)";
  const hoverBorder = theme === "dark" ? "rgba(34, 211, 238, 0.3)" : "rgba(34, 211, 238, 0.4)";
  const vignetteGradient = theme === "dark" 
    ? 'radial-gradient(circle at 50% 50%, transparent, rgba(0,0,0,0.4) 80%)'
    : 'radial-gradient(circle at 50% 50%, transparent, rgba(255,251,245,0.6) 80%)';
  const rippleBg = theme === "dark" ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.2)';
  const rippleShadow = theme === "dark" 
    ? '0 0 50px rgba(34, 211, 238, 0.3)' 
    : '0 0 50px rgba(34, 211, 238, 0.4)';

  useEffect(() => {
    const calculateGrid = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / 60),
        rows: Math.ceil(window.innerHeight / 60)
      });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: event.clientX,
        y: event.clientY,
      };

      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  const gridBlocks = useMemo(() => {
    return Array.from({ length: dimensions.cols * dimensions.rows });
  }, [dimensions.cols, dimensions.rows]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ripple-effect {
            0% {
              transform: scale(0);
              opacity: 0.8;
            }
            100% {
              transform: scale(12);
              opacity: 0;
            }
          }
        `
      }} />

      {/* The Interactive Background Grid Layer */}
      <div
        className={`fixed inset-0 overflow-hidden ${bgColor} flex flex-wrap content-start transition-colors duration-300`}
        style={{
          zIndex: 0,
        }}
      >
        {gridBlocks.map((_, i) => (
          <motion.div
            key={i}
            style={{
              width: "60px",
              height: "60px",
            }}
            className={`border-[0.5px] ${borderColor} flex-shrink-0 relative group transition-colors duration-300`}
            whileHover={{
              scale: 1.15,
              backgroundColor: hoverBg,
              borderColor: hoverBorder,
              zIndex: 50,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {/* Subtle inner glow for hovered block */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-cyan-500/10 blur-[2px]" />
            </div>
          </motion.div>
        ))}
        
        {/* Fixed Global Vignette/Glow to keep text readable */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: vignetteGradient,
            zIndex: 60
          }}
        />
      </div>

      {/* The Ripple Layer (Overlays everything non-blockingly) */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 9999,
        }}
      >
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute rounded-full border border-cyan-400/30"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              backgroundColor: rippleBg,
              animation: 'ripple-effect 1.2s cubic-bezier(0, 0, 0.2, 1) forwards',
              boxShadow: rippleShadow,
            }}
          />
        ))}
      </div>
    </>
  );
}
