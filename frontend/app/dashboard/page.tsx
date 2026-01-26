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
  MessageCircle,
  Target,
  Flame,
  Trophy,
  Clock,
  ChevronRight,
  AlertCircle,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { studentApi, StudentProfile, activityApi, StreakData } from "@/lib/api";
import { Navbar } from "@/component/ui/navbar";
import { SolvedBurst, CelebrationOverlay } from "@/component/ui/activity-heatmap";

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
          
          // Fetch streak data
          try {
            const streak = await activityApi.getStreak();
            setStreakData(streak);
            if (streak.is_new_milestone && streak.current_milestone) {
              setShowCelebration(true);
            }
          } catch (err) {
            // Activity data not available yet
          }
        } catch (error) {
          // Profile doesn't exist, redirect to onboarding
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    {
      icon: BookOpen,
      title: "PYQ Practice",
      description: "Previous year questions by chapter",
      href: "/pyq",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI Doubt Solver",
      description: "Get instant answers to your doubts",
      href: "/chat",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Find Mentor",
      description: "Connect with IIT/NIT mentors",
      href: "/mentors",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Calendar,
      title: "Study Planner",
      description: "AI-generated study timetable",
      href: "/planner",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: studentProfile?.streak_days || 0,
      color: "text-orange-500",
    },
    {
      icon: Target,
      label: "Questions Solved",
      value: studentProfile?.total_questions_solved || 0,
      color: "text-cyan-500",
    },
    {
      icon: Trophy,
      label: "Current Score",
      value: studentProfile?.current_score || "-",
      color: "text-yellow-500",
    },
    {
      icon: TrendingUp,
      label: "Target Score",
      value: studentProfile?.target_score || "-",
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Celebration overlay for streak milestones */}
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
      
      <main className="pt-20 px-6 md:px-12 lg:px-20 pb-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Profile Completion Banner */}
          {studentProfile && !studentProfile.is_profile_complete && showProfileBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Complete your profile</p>
                  <p className="text-sm text-amber-200/80">
                    Add your current and target scores to get personalized recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors text-sm"
                >
                  Complete Now
                </Link>
                <button
                  onClick={() => setShowProfileBanner(false)}
                  className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user.full_name.split(" ")[0]}! 👋
            </h1>
            <p className="text-neutral-400">
              {studentProfile
                ? `${studentProfile.category} | Target: JEE ${studentProfile.target_year}`
                : "Let's continue your JEE preparation"}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-neutral-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Activity Tracker Card */}
              <Link
                href="/activity"
                className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-5 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-3xl"
                  >
                    🔥
                  </motion.span>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {streakData?.current_streak || studentProfile?.streak_days || 0}
                    </p>
                    <p className="text-xs text-orange-300">Day Streak</p>
                  </div>
                </div>
                {streakData?.next_milestone && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                      <span>{streakData.next_milestone.emoji} Next: {streakData.next_milestone.name}</span>
                      <span>{streakData.days_to_next_milestone}d</span>
                    </div>
                    <div className="bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{
                          width: `${((streakData.next_milestone.days - streakData.days_to_next_milestone) / streakData.next_milestone.days) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-neutral-400 group-hover:text-orange-300 transition-colors flex items-center gap-1">
                  View Activity Graph <ChevronRight className="w-3 h-3" />
                </p>
              </Link>

              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all hover:scale-[1.02]"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-neutral-400">{action.description}</p>
                  <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 mt-3 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity & AI Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { action: "Solved 5 Physics questions", time: "2 hours ago", icon: BookOpen },
                  { action: "Completed Chapter: Thermodynamics", time: "Yesterday", icon: Trophy },
                  { action: "Asked AI about Organic Chemistry", time: "2 days ago", icon: Brain },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                Have a doubt? Ask our AI instantly.
              </p>
              <Link
                href="/chat"
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-center font-medium py-3 rounded-lg transition-all"
              >
                Start Chatting
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
