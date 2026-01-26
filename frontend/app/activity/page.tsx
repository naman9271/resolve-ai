"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Calendar, Zap, Target } from "lucide-react";
import Link from "next/link";
import {
  ActivityHeatmap,
  StreakDisplay,
  CelebrationOverlay,
} from "@/component/ui/activity-heatmap";
import { activityApi, ActivityHeatmapData, StreakData } from "@/lib/api";

export default function ActivityPage() {
  const [heatmapData, setHeatmapData] = useState<ActivityHeatmapData | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const [heatmap, streak] = await Promise.all([
        activityApi.getHeatmap(365),
        activityApi.getStreak(),
      ]);
      setHeatmapData(heatmap);
      setStreakData(streak);

      // Check if there's a new milestone to celebrate
      if (streak.is_new_milestone && streak.current_milestone) {
        setShowCelebration(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchActivityData}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && streakData?.current_milestone && (
          <CelebrationOverlay
            milestone={streakData.current_milestone.days}
            message={streakData.current_milestone.message}
            emoji={streakData.current_milestone.emoji}
            celebrationType={streakData.current_milestone.celebration_type}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Your Activity</h1>
            <p className="text-sm text-neutral-400">Track your JEE preparation journey</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Streak display */}
        {streakData && (
          <StreakDisplay
            currentStreak={streakData.current_streak}
            longestStreak={streakData.longest_streak}
            encouragement={streakData.encouragement}
          />
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-neutral-400">Total Questions</span>
            </div>
            <p className="text-3xl font-bold">{heatmapData?.total_questions || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-sm text-neutral-400">Current Streak</span>
            </div>
            <p className="text-3xl font-bold">{streakData?.current_streak || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-neutral-400">Longest Streak</span>
            </div>
            <p className="text-3xl font-bold">{streakData?.longest_streak || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm text-neutral-400">Active Days</span>
            </div>
            <p className="text-3xl font-bold">{heatmapData?.total_active_days || 0}</p>
          </motion.div>
        </div>

        {/* Next milestone */}
        {streakData?.next_milestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Next Milestone</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">{streakData.next_milestone.emoji}</span>
                  {streakData.next_milestone.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-400">
                  {streakData.days_to_next_milestone}
                </p>
                <p className="text-sm text-neutral-400">days to go</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 bg-neutral-800 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((streakData.next_milestone.days - streakData.days_to_next_milestone) /
                      streakData.next_milestone.days) *
                    100
                  }%`,
                }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Activity heatmap */}
        {heatmapData && <ActivityHeatmap data={heatmapData} />}

        {/* Quick tips */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            💡 Streak Tips
          </h3>
          <ul className="space-y-2 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              Solve at least 1 question daily to maintain your streak
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              PYQ practice counts towards your activity level
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              Morning study sessions boost retention by 20%
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              Reach 21 days to form a lasting habit
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
