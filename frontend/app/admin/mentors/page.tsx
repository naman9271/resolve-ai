"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  School,
  Phone,
  Calendar,
  Award,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface MentorApplication {
  id: number;
  user_id: number;
  display_name: string;
  profile_photo_url?: string;
  college_name: string;
  college_tier: string;
  branch: string;
  year_of_study: number;
  jee_advanced_qualified: boolean;
  jee_roll_number?: string;
  jee_rank?: number;
  date_of_birth?: string;
  phone_number?: string;
  verification_status: string;
  bio?: string;
  expertise_subjects?: string;
  created_at: string;
}

export default function AdminMentorsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("resolve_ai_access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/mentors/admin/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchApplications();
    }
  }, [isAuthenticated, user]);

  const handleVerification = async (mentorId: number, approve: boolean, reason?: string) => {
    setActionLoading(mentorId);
    try {
      const token = localStorage.getItem("resolve_ai_access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/mentors/admin/${mentorId}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            approve,
            rejection_reason: reason || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process verification");
      }

      // Remove from list
      setApplications((prev) => prev.filter((app) => app.id !== mentorId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Mentor Applications</h1>
              <p className="text-white/60 mt-1">
                Review and approve mentor applications
              </p>
            </div>
          </div>
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60">No pending applications</h3>
            <p className="text-white/40 mt-2">All mentor applications have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                      {app.profile_photo_url ? (
                        <img
                          src={app.profile_photo_url}
                          alt={app.display_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{app.display_name}</h3>
                      <p className="text-white/60 flex items-center gap-2">
                        <School className="w-4 h-4" />
                        {app.college_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {app.branch}
                        </span>
                        <span>Year {app.year_of_study}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            app.college_tier === "iit"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {app.college_tier.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVerification(app.id, false, "Application rejected by admin")}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerification(app.id, true)}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">JEE Advanced</p>
                    <p className="font-medium">
                      {app.jee_advanced_qualified ? "✓ Qualified" : "✗ Not Qualified"}
                    </p>
                  </div>
                  {app.jee_roll_number && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/40 text-xs mb-1">JEE Roll Number</p>
                      <p className="font-medium">{app.jee_roll_number}</p>
                    </div>
                  )}
                  {app.jee_rank && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/40 text-xs mb-1">JEE Rank</p>
                      <p className="font-medium">{app.jee_rank}</p>
                    </div>
                  )}
                  {app.phone_number && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </p>
                      <p className="font-medium">{app.phone_number}</p>
                    </div>
                  )}
                  {app.date_of_birth && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> DOB
                      </p>
                      <p className="font-medium">
                        {new Date(app.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Applied</p>
                    <p className="font-medium">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {app.bio && (
                  <div className="mt-4">
                    <p className="text-white/40 text-xs mb-1">Bio</p>
                    <p className="text-white/80 text-sm">{app.bio}</p>
                  </div>
                )}

                {app.expertise_subjects && (
                  <div className="mt-4">
                    <p className="text-white/40 text-xs mb-2">Expertise Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(app.expertise_subjects).map((subject: string) => (
                        <span
                          key={subject}
                          className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
