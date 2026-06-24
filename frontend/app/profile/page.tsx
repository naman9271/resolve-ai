"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  BookOpen,
  Flame,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Crown,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { studentApi, StudentProfile } from "@/lib/api";
import { AppShell } from "@/components/layout/app-shell";
import { BlockBeams } from "@/component/ui/beam";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    target_score: 0,
    current_score: 0,
  });

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
          setEditForm({
            target_score: profile.target_score || 0,
            current_score: profile.current_score || 0,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
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
  }, [user]);

  const handleSave = async () => {
    try {
      const updated = await studentApi.updateProfile(editForm);
      setStudentProfile(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading || profileLoading) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${theme === "dark" ? "border-white border-t-transparent" : "border-neutral-900 border-t-transparent"} rounded-full animate-spin`} />
      </div>
    );
  }

  if (!user) return null;

  const categoryLabels: Record<string, string> = {
    "11th": "Class 11",
    "12th": "Class 12",
    dropper: "Dropper",
    partial_dropper: "Partial Dropper",
    PARTIAL_DROPPER: "Partial Dropper",
    DROPPER: "Dropper",
  };

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: `${studentProfile?.streak_days || 0} days`,
      color: "text-orange-500",
    },
    {
      icon: BookOpen,
      label: "Questions Solved",
      value: studentProfile?.total_questions_solved || 0,
      color: "text-blue-500",
    },
    {
      icon: Target,
      label: "Target Score",
      value: studentProfile?.target_score || "Not set",
      color: "text-green-500",
    },
    {
      icon: Award,
      label: "Current Score",
      value: studentProfile?.current_score || "Not set",
      color: "text-purple-500",
    },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative ${cardBg} border ${cardBorder} rounded-2xl p-8 mb-8 overflow-hidden`}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full ${theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white"} flex items-center justify-center text-3xl font-bold`}>
                {user.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              {studentProfile?.is_premium && (
                <div className={`absolute -top-1 -right-1 ${theme === "dark" ? "bg-white" : "bg-yellow-400"} rounded-full p-1`}>
                  <Crown className={`w-4 h-4 ${theme === "dark" ? "text-black" : "text-yellow-900"}`} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl font-bold ${textPrimary}`}>
                  {user.full_name}
                </h1>
                {studentProfile?.is_premium && (
                  <span className={`px-2 py-1 ${theme === "dark" ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"} text-xs rounded-full font-medium`}>
                    Premium
                  </span>
                )}
              </div>
              <div className={`space-y-1 ${textSecondary}`}>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                {user.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </p>
                )}
                {studentProfile && (
                  <p className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {categoryLabels[studentProfile.category] || studentProfile.category} •{" "}
                    {studentProfile.target_exam} {studentProfile.target_year}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-neutral-100 hover:bg-neutral-200"} transition-colors`}
              >
                {isEditing ? (
                  <X className={`w-5 h-5 ${textSecondary}`} />
                ) : (
                  <Edit2 className={`w-5 h-5 ${textSecondary}`} />
                )}
              </button>
              <button
                onClick={handleLogout}
                className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-neutral-100 hover:bg-neutral-200"} transition-colors`}
              >
                <LogOut className={`w-5 h-5 ${textSecondary}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 text-center overflow-hidden`}
            >
              <div className="relative z-10">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className={`text-xl font-bold ${textPrimary}`}>{stat.value}</p>
                <p className={`text-sm ${textSecondary}`}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`relative ${cardBg} border ${cardBorder} rounded-xl p-6 mb-8 overflow-hidden`}
          >
            <div className="relative z-10">
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>
                Edit Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${textSecondary} mb-2`}>
                    Current Score
                  </label>
                  <input
                    type="number"
                    value={editForm.current_score}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        current_score: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${textSecondary} mb-2`}>
                    Target Score
                  </label>
                  <input
                    type="number"
                    value={editForm.target_score}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        target_score: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className={`mt-4 px-6 py-3 ${theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-neutral-900 text-white hover:bg-neutral-800"} rounded-lg font-medium transition-colors flex items-center gap-2`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Membership Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative ${cardBg} border ${cardBorder} rounded-xl p-6 mb-8 overflow-hidden`}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-1`}>
                {studentProfile?.is_premium ? "Premium Member" : "Free Plan"}
              </h3>
              <p className={`${textSecondary} text-sm`}>
                {studentProfile?.is_premium
                  ? `Valid until ${new Date(studentProfile.subscription_end || "").toLocaleDateString()}`
                  : "Upgrade to unlock all features"}
              </p>
            </div>
            {!studentProfile?.is_premium && (
              <button className={`px-6 py-3 ${theme === "dark" ? "bg-white text-black hover:bg-white/90" : "bg-neutral-900 text-white hover:bg-neutral-800"} rounded-lg font-medium transition-colors`}>
                Upgrade to Premium
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <button
            onClick={() => router.push("/planner")}
            className={`relative flex items-center gap-4 p-4 ${cardBg} border ${cardBorder} rounded-xl hover:border-blue-500/50 transition-colors text-left overflow-hidden`}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"}`}>
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className={`font-medium ${textPrimary}`}>Study Planner</h4>
                <p className={`text-sm ${textSecondary}`}>Manage your schedule</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => router.push("/chat")}
            className={`relative flex items-center gap-4 p-4 ${cardBg} border ${cardBorder} rounded-xl hover:border-purple-500/50 transition-colors text-left overflow-hidden`}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h4 className={`font-medium ${textPrimary}`}>AI Doubt Solver</h4>
                <p className={`text-sm ${textSecondary}`}>Get instant help</p>
              </div>
            </div>
          </button>
        </motion.div>
        </div>
    </AppShell>
  );
}
