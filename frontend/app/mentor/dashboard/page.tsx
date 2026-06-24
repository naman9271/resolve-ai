"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  IndianRupee,
  Clock,
  Star,
  TrendingUp,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Settings,
  Bell,
  Wallet,
  BookOpen,
  BarChart3,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Home,
  MessageSquare,
  CreditCard,
  User,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { mentorApi, MentorSession } from "@/lib/api";
import { BlockBeams } from "@/component/ui/beam";

interface MentorDashboardData {
  id: number;
  user_id: number;
  display_name: string;
  profile_photo_url?: string;
  college_name: string;
  college_tier: string;
  branch: string;
  year_of_study: number;
  jee_advanced_qualified: boolean;
  verification_status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  bio?: string;
  expertise_subjects?: string;
  session_rate_30_min: number;
  session_rate_1_hour: number;
  is_available: boolean;
  available_slots?: string;
  total_sessions: number;
  total_earnings: number;
  pending_earnings: number;
  rating: number;
  total_reviews: number;
  phone_verified: boolean;
  created_at: string;
}

interface SessionData {
  id: number;
  student_name: string;
  scheduled_at: string;
  duration_minutes: number;
  amount: number;
  status: string;
  meeting_link?: string;
}

type TabType = "overview" | "sessions" | "students" | "earnings" | "settings";

export default function MentorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<MentorDashboardData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [upcomingSessions, setUpcomingSessions] = useState<SessionData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/mentor/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role === "mentor") {
        try {
          const profileData = await mentorApi.getProfile();
          setProfile(profileData as unknown as MentorDashboardData);
          
          // Check verification status
          if (profileData.verification_status === "pending") {
            router.push("/mentor/pending-verification");
            return;
          }
          
          // Fetch upcoming sessions
          try {
            const sessions = await mentorApi.getUpcomingSessions();
            setUpcomingSessions(sessions as unknown as SessionData[]);
          } catch (err) {
            console.error("Failed to fetch sessions");
          }
        } catch (error) {
          // No profile - redirect to onboarding
          router.push("/mentor/register");
        } finally {
          setProfileLoading(false);
        }
      } else if (user?.role === "student") {
        router.push("/dashboard");
      } else {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/mentor/login");
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 border-2 border-amber-500/20 rounded-full"
            />
            <motion.div 
              className="absolute inset-0 border-2 border-transparent border-t-amber-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-white/60 text-sm">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || !profile) return null;

  // Check if profile is rejected
  if (profile.verification_status === "rejected") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Rejected</h1>
          <p className="text-white/70 mb-4">
            Unfortunately, your mentor application was not approved.
          </p>
          {profile.rejection_reason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-400 text-sm font-medium mb-1">Reason:</p>
              <p className="text-white/70 text-sm">{profile.rejection_reason}</p>
            </div>
          )}
          <p className="text-white/50 text-sm mb-6">
            If you believe this was a mistake, please contact us at mentors@resolveai.in
          </p>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Home },
    { id: "sessions" as TabType, label: "Sessions", icon: Calendar },
    { id: "students" as TabType, label: "Students", icon: Users },
    { id: "earnings" as TabType, label: "Earnings", icon: Wallet },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      label: "Total Sessions",
      value: profile.total_sessions,
      icon: Video,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Earnings",
      value: `₹${profile.total_earnings.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pending Payout",
      value: `₹${profile.pending_earnings.toLocaleString()}`,
      icon: Wallet,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Rating",
      value: profile.rating > 0 ? profile.rating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      subtitle: profile.total_reviews > 0 ? `${profile.total_reviews} reviews` : undefined,
    },
  ];

  const renderSidebar = () => (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-full w-72 bg-black border-r border-amber-500/20 z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-amber-500" />
              <div>
                <h1 className="text-xl font-bold text-white">RESOLVE AI</h1>
                <p className="text-amber-500 text-xs">Mentor Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Profile Card */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                {profile.profile_photo_url ? (
                  <img 
                    src={profile.profile_photo_url} 
                    alt={profile.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{profile.display_name}</p>
                <p className="text-white/50 text-xs truncate">{profile.college_name}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                profile.is_available 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-red-500/20 text-red-400"
              }`}>
                {profile.is_available ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 text-amber-500"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/mentor/help"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Help & Support
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-black border border-white/10 rounded-xl p-6 overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-white/40 text-xs mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 transition-all">
              <Calendar className="w-6 h-6 text-amber-500" />
              <span className="text-white text-sm">Set Availability</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 transition-all">
              <IndianRupee className="w-6 h-6 text-green-500" />
              <span className="text-white text-sm">Update Rates</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all">
              <User className="w-6 h-6 text-blue-500" />
              <span className="text-white text-sm">Edit Profile</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 transition-all">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <span className="text-white text-sm">Payment Info</span>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Sessions</h3>
            <button 
              onClick={() => setActiveTab("sessions")}
              className="text-amber-500 text-sm hover:text-amber-400 transition-colors"
            >
              View All
            </button>
          </div>
          
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No upcoming sessions</p>
              <p className="text-white/30 text-sm mt-1">
                Sessions will appear here when students book
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{session.student_name}</p>
                    <p className="text-white/50 text-sm">
                      {new Date(session.scheduled_at).toLocaleDateString()} • {session.duration_minutes} mins
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">₹{session.amount}</p>
                    <button className="text-amber-500 text-xs hover:text-amber-400">
                      Join →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Profile Completion / Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <TrendingUp className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Tips to Get More Students</h3>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Complete your profile with a detailed bio</li>
              <li>• Add your expertise subjects</li>
              <li>• Set competitive session rates</li>
              <li>• Keep your availability updated</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Session Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm transition-all">
            Upcoming
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm transition-all">
            Completed
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm transition-all">
            Cancelled
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Sessions Yet</h3>
          <p className="text-white/50 text-sm mb-4">
            When students book sessions with you, they will appear here.
          </p>
          <p className="text-white/40 text-xs">
            Make sure your profile is complete and availability is set!
          </p>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Student Management</h2>
      
      <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Students Yet</h3>
          <p className="text-white/50 text-sm mb-4">
            Students who book sessions with you will be listed here.
          </p>
          <p className="text-white/40 text-xs">
            You can view their progress, notes, and session history.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Earnings & Payments</h2>
      
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-2">Total Earned</p>
          <p className="text-3xl font-bold text-white">₹{profile.total_earnings.toLocaleString()}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-2">Pending Payout</p>
          <p className="text-3xl font-bold text-amber-500">₹{profile.pending_earnings.toLocaleString()}</p>
        </div>
        <div className="bg-black border border-white/10 rounded-xl p-6">
          <p className="text-white/60 text-sm mb-2">This Month</p>
          <p className="text-3xl font-bold text-green-500">₹0</p>
        </div>
      </div>

      {/* Your Rates */}
      <div className="bg-black border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Session Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-white">30 Minutes Session</span>
            </div>
            <span className="text-xl font-bold text-white">₹{profile.session_rate_30_min}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-white">1 Hour Session</span>
            </div>
            <span className="text-xl font-bold text-white">₹{profile.session_rate_1_hour}</span>
          </div>
        </div>
        <button className="mt-4 text-amber-500 text-sm hover:text-amber-400 transition-colors">
          Update Rates →
        </button>
      </div>

      {/* Payment Info */}
      <div className="bg-black border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-medium text-sm">Add Payment Details</p>
              <p className="text-white/60 text-xs mt-1">
                Add your bank account or UPI ID to receive payouts
              </p>
            </div>
          </div>
        </div>
        <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-lg transition-all">
          Add Payment Method
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Settings</h2>
      
      {/* Profile Settings */}
      <div className="bg-black border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-white">Display Name</p>
                <p className="text-white/50 text-sm">{profile.display_name}</p>
              </div>
            </div>
            <button className="text-amber-500 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-white">Bio</p>
                <p className="text-white/50 text-sm">{profile.bio || "Not set"}</p>
              </div>
            </div>
            <button className="text-amber-500 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-white">Expertise Subjects</p>
                <p className="text-white/50 text-sm">
                  {profile.expertise_subjects ? JSON.parse(profile.expertise_subjects).join(", ") : "Not set"}
                </p>
              </div>
            </div>
            <button className="text-amber-500 text-sm">Edit</button>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-black border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Accept New Sessions</p>
            <p className="text-white/50 text-sm">Toggle to show/hide from student search</p>
          </div>
          <button 
            className={`w-14 h-7 rounded-full transition-all ${
              profile.is_available ? "bg-green-500" : "bg-white/20"
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-all ${
              profile.is_available ? "ml-8" : "ml-1"
            }`} />
          </button>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-black border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Verification Status</h3>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
          <Shield className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-green-400 font-medium">Verified Mentor</p>
            <p className="text-white/60 text-sm">{profile.college_name} • {profile.branch}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "sessions":
        return renderSessions();
      case "students":
        return renderStudents();
      case "earnings":
        return renderEarnings();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {renderSidebar()}
      
      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-white/50 text-sm">Welcome back, {profile.display_name}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all relative">
                <Bell className="w-5 h-5 text-white/70" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
