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
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { BlockBeams } from "@/component/ui/beam";

export default function ActivityPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

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
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-8 h-8 border-2 ${theme === "dark" ? "border-white border-t-transparent" : "border-neutral-900 border-t-transparent"} rounded-full`}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className="text-center">
          <p className={textSecondary + " mb-4"}>{error}</p>
          <button
            onClick={fetchActivityData}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            {t.common?.tryAgain || "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
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

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>{t.activity?.title || "Your Activity"}</h1>
            <p className={textSecondary}>
              {t.activity?.subtitle || "Track your JEE preparation journey"}
            </p>
          </motion.div>

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
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}
            >
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Target className={`w-5 h-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                  <span className={`text-sm ${textSecondary}`}>{t.activity?.totalQuestions || "Total Questions"}</span>
                </div>
                <p className={`text-3xl font-bold ${textPrimary}`}>{heatmapData?.total_questions || 0}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}
            >
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className={`w-5 h-5 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
                  <span className={`text-sm ${textSecondary}`}>{t.activity?.currentStreak || "Current Streak"}</span>
                </div>
                <p className={`text-3xl font-bold ${textPrimary}`}>{streakData?.current_streak || 0}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}
            >
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                  <span className={`text-sm ${textSecondary}`}>{t.activity?.longestStreak || "Longest Streak"}</span>
                </div>
                <p className={`text-3xl font-bold ${textPrimary}`}>{streakData?.longest_streak || 0}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}
            >
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className={`w-5 h-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  <span className={`text-sm ${textSecondary}`}>{t.activity?.activeDays || "Active Days"}</span>
                </div>
                <p className={`text-3xl font-bold ${textPrimary}`}>{heatmapData?.total_active_days || 0}</p>
              </div>
            </motion.div>
          </div>

          {/* Next milestone */}
          {streakData?.next_milestone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-6 overflow-hidden`}
            >
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondary} mb-1`}>{t.activity?.nextMilestone || "Next Milestone"}</p>
                    <p className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
                      <span className="text-2xl">{streakData.next_milestone.emoji}</span>
                      {streakData.next_milestone.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${textPrimary}`}>
                      {streakData.days_to_next_milestone}
                    </p>
                    <p className={`text-sm ${textSecondary}`}>{t.activity?.daysToGo || "days to go"}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className={`mt-4 ${inputBg} border ${cardBorder} rounded-full h-2 overflow-hidden`}>
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
                    className="h-full bg-cyan-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity heatmap */}
          {heatmapData && <ActivityHeatmap data={heatmapData} />}

          {/* Quick tips */}
          <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-6 overflow-hidden`}>
            {theme === "dark" && <BlockBeams />}
            <div className="relative z-10">
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                💡 {t.activity?.streakTips || "Streak Tips"}
              </h3>
              <ul className={`space-y-2 ${textSecondary}`}>
                <li className="flex items-start gap-2">
                  <span className={textPrimary}>•</span>
                  {t.activity?.tip1 || "Solve at least 1 question daily to maintain your streak"}
                </li>
                <li className="flex items-start gap-2">
                  <span className={textPrimary}>•</span>
                  {t.activity?.tip2 || "PYQ practice counts towards your activity level"}
                </li>
                <li className="flex items-start gap-2">
                  <span className={textPrimary}>•</span>
                  {t.activity?.tip3 || "Morning study sessions boost retention by 20%"}
                </li>
                <li className="flex items-start gap-2">
                  <span className={textPrimary}>•</span>
                  {t.activity?.tip4 || "Reach 21 days to form a lasting habit"}
                </li>
              </ul>
            </div>
          </div>
        </div>
    </AppShell>
  );
}
