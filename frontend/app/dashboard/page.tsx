"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Users,
  TrendingUp,
  Calendar,
  Target,
  Flame,
  Trophy,
  ChevronRight,
  AlertCircle,
  X,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { studentApi, StudentProfile, activityApi, StreakData } from "@/lib/api";
import { AppShell } from "@/components/layout/app-shell";
import { CelebrationOverlay } from "@/component/ui/activity-heatmap";
import { BentoCard, BentoGrid } from "@/component/ui/bento-grid";
import { BlockBeams } from "@/component/ui/beam";


export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role === "student") {
        try {
          const profile = await studentApi.getProfile();
          setStudentProfile(profile);
          
          try {
            const streak = await activityApi.getStreak();
            setStreakData(streak);
            if (streak.is_new_milestone && streak.current_milestone) {
              setShowCelebration(true);
            }
          } catch (err) {}
        } catch (error) {
          router.push("/onboarding/student");
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, router]);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 border-2 border-neutral-500/20 rounded-full"
            />
            <motion.div 
              className="absolute inset-0 border-2 border-transparent border-t-neutral-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="theme-text-secondary text-sm">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const currentStreak = streakData?.current_streak || studentProfile?.streak_days || 0;

  return (
    <AppShell>
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
      
      <div className="relative z-10 px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          {/* Profile Completion Banner */}
          <AnimatePresence>
            {studentProfile && !studentProfile.is_profile_complete && showProfileBanner && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="rounded-2xl p-5 theme-card">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 rounded-xl theme-border border"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertCircle className="w-5 h-5 theme-text" />
                      </motion.div>
                      <div>
                        <p className="theme-text font-semibold">Complete your profile</p>
                        <p className="theme-text-secondary text-sm">
                          Add your current and target scores to get personalized recommendations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/profile"
                        className="px-5 py-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold rounded-xl text-sm hover:opacity-90 transition-all"
                      >
                        Complete Now
                      </Link>
                      <button
                        onClick={() => setShowProfileBanner(false)}
                        className="p-2 theme-text-secondary hover:theme-text rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="theme-text-muted text-sm uppercase tracking-wider mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold theme-text tracking-tight mb-3">
              Welcome back, <span className="theme-text">{user.full_name.split(" ")[0]}</span>!
            </h1>
            <p className="theme-text-secondary text-lg">
              {studentProfile
                ? `${studentProfile.category} • Target: JEE ${studentProfile.target_year}`
                : "Let's continue your JEE preparation"}
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Flame, label: "Day Streak", value: currentStreak },
              { icon: Target, label: "Questions Solved", value: studentProfile?.total_questions_solved || 0 },
              { icon: Trophy, label: "Current Score", value: studentProfile?.current_score || "-" },
              { icon: TrendingUp, label: "Target Score", value: studentProfile?.target_score || "-" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative p-5 rounded-2xl theme-card overflow-hidden group cursor-default"
              >
                <BlockBeams />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-5 h-5 theme-text" />
                    <span className="theme-text-secondary text-sm">{stat.label}</span>
                  </div>
                  <p className="text-3xl font-bold theme-text">{stat.value}</p>
                </div>
                <div className="absolute inset-0 bg-neutral-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BentoGrid className="lg:grid-rows-3 auto-rows-[18rem] md:auto-rows-[20rem]">
              {/* AI Doubt Solver - Large Feature Card */}
              <BentoCard
                name="AI Doubt Solver"
                className="col-span-3 lg:col-span-2 lg:row-span-2"
                background={<BlockBeams />}
                Icon={Brain}
                description="Get instant answers to your JEE doubts. Our AI understands Physics, Chemistry, and Mathematics at the JEE Advanced level."
                href="/chat"
                cta="Start Asking"
              />

              {/* Streak Card */}
              <div className="col-span-3 lg:col-span-1 row-span-1">
                <Link href="/activity" className="block h-full">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full rounded-xl overflow-hidden theme-card group"
                  >
                    <BlockBeams />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold theme-text">{currentStreak}</span>
                        <span className="theme-text-secondary font-medium">day streak</span>
                      </div>
                      {streakData?.next_milestone && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs theme-text-secondary mb-1">
                            <span>{streakData.next_milestone.emoji} {streakData.next_milestone.name}</span>
                            <span className="theme-text">{streakData.days_to_next_milestone}d left</span>
                          </div>
                          <div className="h-1.5 bg-neutral-800 dark:bg-neutral-200/10 border theme-border rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-neutral-400 dark:bg-neutral-300 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${((streakData.next_milestone.days - streakData.days_to_next_milestone) / streakData.next_milestone.days) * 100}%`
                              }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-sm theme-text-secondary group-hover:theme-text transition-colors flex items-center gap-1">
                        View Activity <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>

              {/* PYQ Practice */}
              <BentoCard
                name="PYQ Practice"
                className="col-span-3 md:col-span-1"
                background={<BlockBeams />}
                Icon={BookOpen}
                description="Previous year questions organized by chapter and difficulty."
                href="/pyq"
                cta="Start Practice"
              />

              {/* Find Mentor */}
              <BentoCard
                name="Find Mentor"
                className="col-span-3 md:col-span-1"
                background={<BlockBeams />}
                Icon={Users}
                description="Connect with IIT/NIT toppers for personalized guidance."
                href="/mentors"
                cta="Find Mentors"
              />

              {/* Study Planner */}
              <BentoCard
                name="Study Planner"
                className="col-span-3 md:col-span-1"
                background={<BlockBeams />}
                Icon={Calendar}
                description="AI-generated study timetable tailored to your goals."
                href="/planner"
                cta="View Planner"
              />

              {/* Performance Analytics */}
              <BentoCard
                name="Performance"
                className="col-span-3 lg:col-span-2"
                background={<BlockBeams />}
                Icon={BarChart3}
                description="Track your progress across subjects. Identify strengths and areas for improvement with detailed analytics."
                href="/activity"
                cta="View Analytics"
              />

              {/* Recent Activity */}
              <div className="col-span-3 lg:col-span-1">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full rounded-xl overflow-hidden theme-card p-6"
                >
                  <BlockBeams />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold theme-text">Recent Activity</h3>
                      <Link href="/activity" className="text-xs theme-text-secondary hover:theme-text transition-colors">
                        View all
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {[
                        { text: "Solved 5 Physics questions", time: "2h ago", icon: BookOpen },
                        { text: "Completed Thermodynamics", time: "Yesterday", icon: Trophy },
                        { text: "Asked AI about Organic", time: "2d ago", icon: Brain },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg theme-border border theme-bg hover:bg-neutral-500/5 transition-colors cursor-pointer group"
                        >
                          <item.icon className="w-4 h-4 theme-text" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm theme-text truncate transition-colors">{item.text}</p>
                            <p className="text-xs theme-text-muted">{item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </BentoGrid>
          </motion.div>
        </div>
    </AppShell>
  );
}
