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
import { studentApi, StudentProfile } from "@/lib/api";
import { Navbar } from "@/component/ui/navbar";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
      color: "text-orange-400",
    },
    {
      icon: BookOpen,
      label: "Questions Solved",
      value: studentProfile?.total_questions_solved || 0,
      color: "text-blue-400",
    },
    {
      icon: Target,
      label: "Target Score",
      value: studentProfile?.target_score || "Not set",
      color: "text-green-400",
    },
    {
      icon: Award,
      label: "Current Score",
      value: studentProfile?.current_score || "Not set",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                {user.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              {studentProfile?.is_premium && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Crown className="w-4 h-4 text-black" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {user.full_name}
                </h1>
                {studentProfile?.is_premium && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="space-y-1 text-neutral-400">
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
                className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                {isEditing ? (
                  <X className="w-5 h-5 text-neutral-300" />
                ) : (
                  <Edit2 className="w-5 h-5 text-neutral-300" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400" />
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
              className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-neutral-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Edit Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
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
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
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
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </motion.div>
        )}

        {/* Membership Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {studentProfile?.is_premium ? "Premium Member" : "Free Plan"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {studentProfile?.is_premium
                  ? `Valid until ${new Date(studentProfile.subscription_end || "").toLocaleDateString()}`
                  : "Upgrade to unlock all features"}
              </p>
            </div>
            {!studentProfile?.is_premium && (
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
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
            className="flex items-center gap-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors text-left"
          >
            <div className="p-3 rounded-lg bg-green-500/10">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Study Planner</h4>
              <p className="text-sm text-neutral-400">Manage your schedule</p>
            </div>
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors text-left"
          >
            <div className="p-3 rounded-lg bg-purple-500/10">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">AI Doubt Solver</h4>
              <p className="text-sm text-neutral-400">Get instant help</p>
            </div>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
