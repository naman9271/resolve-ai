import React, { useState, useEffect } from "react";
import { Home, Terminal, Plus, Github, Twitter, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  mobileClassName?: string;
}

export function FloatingDock({ items, mobileClassName }: FloatingDockProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 800, 
            damping: 15,
            duration: 0.2,
            delay: 0.05 
          }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${mobileClassName || ""}`}
        >
          <motion.div 
            className="flex items-center gap-2 p-2 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 rounded-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.15 }}
          >
            {items.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 1000, 
                  damping: 12,
                  delay: 0.15 + index * 0.02 
                }}
                whileHover={{ 
                  scale: 1.25,
                  y: -8,
                  transition: { 
                    type: "spring", 
                    stiffness: 1200, 
                    damping: 10,
                    duration: 0.1
                  }
                }}
                whileTap={{ 
                  scale: 0.9,
                  transition: { duration: 0.05 }
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-700/90 transition-all duration-100 group relative overflow-hidden"
                title={item.title}
              >
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.1 }}
                />
                
                <motion.div 
                  className="w-5 h-5 text-neutral-400 group-hover:text-cyan-300 transition-all duration-100 relative z-10"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 5,
                    transition: { 
                      type: "spring", 
                      stiffness: 1500, 
                      damping: 8,
                      duration: 0.08
                    }
                  }}
                >
                  {item.icon}
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: <Home className="w-full h-full" />,
      href: "/",
    },
    {
      title: "Dashboard",
      icon: <Terminal className="w-full h-full" />,
      href: "/dashboard",
    },
    {
      title: "AI Chat",
      icon: <Plus className="w-full h-full" />,
      href: "/chat",
    },
    {
      title: "GitHub",
      icon: <Github className="w-full h-full" />,
      href: "https://github.com",
    },
    {
      title: "Twitter",
      icon: <Twitter className="w-full h-full" />,
      href: "https://twitter.com",
    },
    {
      title: "Scroll to Top",
      icon: <RotateCcw className="w-full h-full" />,
      href: "#",
    },
  ];

  return <FloatingDock items={links} />;
}
