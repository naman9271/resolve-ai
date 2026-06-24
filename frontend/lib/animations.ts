/**
 * Shared animation variants for consistent motion across the app
 * Uses Framer Motion - fade + slide, staggered entrances, subtle hover
 */

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

// Stagger container - use with staggerItem children
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// Hover effects - subtle lift
export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { y: 0 },
  transition: { duration: 0.15 },
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
  transition: { duration: 0.2 },
};

// Sidebar animations
export const sidebarExpand = {
  collapsed: { width: 68 },
  expanded: { width: 200 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

export const subSidebarSlide = {
  initial: { x: -240, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -240, opacity: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

// Card entrance animations
export const cardEntrance = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] },
  },
});

// Page transition
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.15 },
  },
};

// List item animations
export const listItem = (index: number) => ({
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3, 
      delay: index * 0.05,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

// Typing indicator dots
export const typingDot = (index: number) => ({
  animate: { 
    opacity: [0.3, 1, 0.3],
    transition: { 
      duration: 1.2, 
      repeat: Infinity, 
      delay: index * 0.2,
    },
  },
});

// Progress bar animation
export const progressBar = (width: number) => ({
  initial: { width: 0 },
  animate: { 
    width: `${width}%`,
    transition: { duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
});

// Subtle pulse for live indicators
export const livePulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
