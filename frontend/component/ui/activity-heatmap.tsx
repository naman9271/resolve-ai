"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Star, Zap, Crown, Target } from "lucide-react";

interface DailyActivity {
  date: string;
  questions_solved: number;
  pyq_solved: number;
  study_minutes: number;
  chat_queries: number;
  activity_level: number;
}

interface ActivityHeatmapData {
  activities: DailyActivity[];
  total_questions: number;
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
}

interface ActivityHeatmapProps {
  data?: ActivityHeatmapData;
  onCelebration?: (type: string) => void;
}

const ACTIVITY_COLORS = [
  "bg-neutral-800", // 0 - no activity
  "bg-green-900/60", // 1 - low
  "bg-green-700/70", // 2 - medium
  "bg-green-500/80", // 3 - high
  "bg-green-400", // 4 - max
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function ActivityHeatmap({ data, onCelebration }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Generate last 365 days
  const generateDateGrid = useCallback(() => {
    const today = new Date();
    const grid: { date: string; activity?: DailyActivity }[][] = [];
    let currentWeek: { date: string; activity?: DailyActivity }[] = [];

    // Start from 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Pad to start on Sunday
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: "" });
    }

    // Fill in all days
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const activity = data?.activities.find((a) => a.date === dateStr);
      currentWeek.push({ date: dateStr, activity });

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "" });
      }
      grid.push(currentWeek);
    }

    return grid;
  }, [data]);

  const grid = generateDateGrid();

  const handleMouseEnter = (
    e: React.MouseEvent,
    day: { date: string; activity?: DailyActivity }
  ) => {
    if (!day.date || !day.activity) return;
    setHoveredDay(day.activity);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const getMonthLabels = () => {
    const labels: { month: string; week: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, weekIndex) => {
      const firstValidDay = week.find((d) => d.date);
      if (firstValidDay?.date) {
        const month = new Date(firstValidDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], week: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            {data?.total_questions || 0} questions solved in the last year
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>Less</span>
          {ACTIVITY_COLORS.map((color, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${color}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex mb-2 ml-8 text-xs text-neutral-500">
        {(() => {
          const labels = getMonthLabels();
          // Each cell is 12px + 3px gap = 15px per week
          const weekWidth = 15;
          return labels.map(({ month, week }, i) => {
            const nextWeek = labels[i + 1]?.week ?? grid.length;
            const width = (nextWeek - week) * weekWidth;
            // Only show label if there's enough space (at least 3 weeks)
            if (width < 45) return null;
            return (
              <div
                key={i}
                style={{ width: `${width}px` }}
                className="shrink-0"
              >
                {month}
              </div>
            );
          });
        })()}
      </div>

      {/* Grid */}
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-2 text-xs text-neutral-500">
          {DAYS.map((day, i) => (
            <div key={i} className="h-[12px] flex items-center">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="flex gap-[3px] overflow-x-auto">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => {
                const level = day.activity?.activity_level || 0;
                return (
                  <motion.div
                    key={dayIndex}
                    className={`w-[12px] h-[12px] rounded-sm cursor-pointer ${
                      day.date ? ACTIVITY_COLORS[level] : "bg-transparent"
                    }`}
                    whileHover={{ scale: 1.3 }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 80,
            }}
          >
            <p className="text-white font-medium mb-1">{hoveredDay.date}</p>
            <p className="text-sm text-neutral-300">
              {hoveredDay.questions_solved} questions solved
            </p>
            {hoveredDay.pyq_solved > 0 && (
              <p className="text-sm text-cyan-400">
                {hoveredDay.pyq_solved} PYQs practiced
              </p>
            )}
            {hoveredDay.study_minutes > 0 && (
              <p className="text-sm text-green-400">
                {Math.round(hoveredDay.study_minutes / 60)}h {hoveredDay.study_minutes % 60}m studied
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Streak display with fire animation
interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  encouragement: string;
}

export function StreakDisplay({ currentStreak, longestStreak, encouragement }: StreakDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Animated fire */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-5xl"
          >
            🔥
          </motion.div>
          <div>
            <p className="text-3xl font-bold text-white">
              {currentStreak}
              <span className="text-lg text-neutral-400 ml-2">day streak</span>
            </p>
            <p className="text-sm text-neutral-400">
              Longest: {longestStreak} days
            </p>
          </div>
        </div>
        <div className="hidden md:block max-w-xs">
          <p className="text-orange-300 italic">&ldquo;{encouragement}&rdquo;</p>
        </div>
      </div>
    </motion.div>
  );
}

// Celebration overlay for milestones
interface CelebrationProps {
  milestone: number;
  message: string;
  emoji: string;
  celebrationType: string;
  onClose: () => void;
}

export function CelebrationOverlay({
  milestone,
  message,
  emoji,
  celebrationType,
  onClose,
}: CelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Confetti/Stars particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {celebrationType === "confetti" &&
          Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "50vw",
                y: "50vh",
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: [0, 1, 0],
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3"
              style={{
                backgroundColor: ["#ff0", "#0ff", "#f0f", "#0f0", "#f00"][
                  Math.floor(Math.random() * 5)
                ],
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}

        {celebrationType === "fireworks" &&
          Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "50vw",
                y: "100vh",
                scale: 0,
              }}
              animate={{
                x: `${30 + Math.random() * 40}vw`,
                y: `${20 + Math.random() * 30}vh`,
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 1,
                ease: "easeOut",
              }}
              className="absolute text-2xl"
            >
              {["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}

        {celebrationType === "stars" &&
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: 2,
              }}
              className="absolute text-3xl"
            >
              ⭐
            </motion.div>
          ))}
      </div>

      {/* Main celebration card */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl p-8 max-w-md text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: 3,
          }}
          className="text-7xl mb-4"
        >
          {emoji}
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {milestone} Day Streak!
        </h2>
        <p className="text-xl text-yellow-300 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-black font-bold hover:opacity-90 transition-opacity"
        >
          Continue Crushing It! 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}

// Mini dopamine burst for solving a question
export function SolvedBurst({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 2], opacity: [1, 0] }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-green-500/30 rounded-full blur-xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl"
        >
          ✅
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-xl font-bold text-green-400 whitespace-nowrap"
        >
          +1 Question Solved!
        </motion.p>
      </div>
    </motion.div>
  );
}
