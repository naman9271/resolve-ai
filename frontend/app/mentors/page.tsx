"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GraduationCap,
  Clock,
  CheckCircle,
  Filter,
  Search,
  MessageCircle,
  Video,
  Award,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { DualSidebar } from "@/components/ui/sidebar-component";
import { AppShell } from "@/components/layout/app-shell";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { mentorApi, MentorProfile } from "@/lib/api";
import { BlockBeams } from "@/component/ui/beam";

// Enhanced demo mentor data
const demoMentors: MentorProfile[] = [
  {
    id: 1,
    user_id: 101,
    display_name: "Rahul Sharma",
    college_name: "IIT Bombay",
    college_tier: "iit",
    branch: "Computer Science @ IIT Bombay",
    year_of_study: 3,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "JEE Advanced AIR 245. Passionate about teaching Physics and Mathematics. Helped 100+ students crack JEE in the last 2 years.",
    expertise_subjects: "Physics, Mathematics",
    session_rate_30_min: 99,
    session_rate_1_hour: 199,
    is_available: true,
    total_sessions: 150,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.9,
    total_reviews: 45,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 102,
    display_name: "Priya Patel",
    college_name: "IIT Delhi",
    college_tier: "iit",
    branch: "Chemical Engineering @ IIT Delhi",
    year_of_study: 4,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "Specialized in Organic Chemistry. My students have seen an average improvement of 30 marks in Chemistry.",
    expertise_subjects: "Chemistry, Physical Chemistry",
    session_rate_30_min: 99,
    session_rate_1_hour: 199,
    is_available: true,
    total_sessions: 230,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.95,
    total_reviews: 89,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 103,
    display_name: "Amit Kumar",
    college_name: "NIT Trichy",
    college_tier: "tier_1",
    branch: "Electrical Engineering @ NIT Trichy",
    year_of_study: 3,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "Focus on problem-solving techniques and time management. Expert in Modern Physics and Thermodynamics.",
    expertise_subjects: "Physics, Modern Physics",
    session_rate_30_min: 49,
    session_rate_1_hour: 99,
    is_available: true,
    total_sessions: 120,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.8,
    total_reviews: 56,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    user_id: 104,
    display_name: "Sneha Reddy",
    college_name: "IIT Kharagpur",
    college_tier: "iit",
    branch: "Aerospace Engineering @ IIT Kharagpur",
    year_of_study: 2,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "JEE Advanced AIR 178. Calculus and Coordinate Geometry specialist. Interactive teaching methodology.",
    expertise_subjects: "Mathematics, Calculus",
    session_rate_30_min: 99,
    session_rate_1_hour: 199,
    is_available: false,
    total_sessions: 85,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.85,
    total_reviews: 38,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    user_id: 105,
    display_name: "Vikram Singh",
    college_name: "IIIT Hyderabad",
    college_tier: "tier_1",
    branch: "Computer Science @ IIIT Hyderabad",
    year_of_study: 4,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "Expert in Inorganic Chemistry and Chemical Bonding. Made complex topics simple for 200+ students.",
    expertise_subjects: "Chemistry, Inorganic Chemistry",
    session_rate_30_min: 49,
    session_rate_1_hour: 99,
    is_available: true,
    total_sessions: 190,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.75,
    total_reviews: 72,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    user_id: 106,
    display_name: "Ananya Gupta",
    college_name: "IIT Madras",
    college_tier: "iit",
    branch: "Mechanical Engineering @ IIT Madras",
    year_of_study: 3,
    jee_advanced_qualified: true,
    verification_status: "approved",
    bio: "All-rounder mentor. JEE Advanced AIR 312. Can help with all three subjects with equal expertise.",
    expertise_subjects: "Physics, Chemistry, Mathematics",
    session_rate_30_min: 99,
    session_rate_1_hour: 199,
    is_available: true,
    total_sessions: 175,
    total_earnings: 0,
    pending_earnings: 0,
    rating: 4.88,
    total_reviews: 61,
    phone_verified: false,
    created_at: new Date().toISOString(),
  },
];

export default function MentorsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    tier: "all",
    subject: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorApi.listMentors();
        setMentors(data.length > 0 ? data : demoMentors);
      } catch (error) {
        // Use enhanced demo data if API fails
        setMentors(demoMentors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    if (filter.tier !== "all" && mentor.college_tier !== filter.tier) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mentor.display_name.toLowerCase().includes(query) ||
        mentor.expertise_subjects?.toLowerCase().includes(query) ||
        mentor.bio?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats calculation
  const totalMentors = mentors.length;
  const avgRating = (mentors.reduce((acc, m) => acc + (m.rating || 0), 0) / totalMentors).toFixed(1);
  const totalSessions = mentors.reduce((acc, m) => acc + (m.total_sessions || 0), 0);
  const availableMentors = mentors.filter(m => m.is_available).length;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-2`}>
              {t.mentors?.title || "Find Your Mentor"} 🎯
            </h1>
            <p className={textSecondary}>
              {t.mentors?.subtitle || "Connect with verified IIT/NIT students for personalized guidance"}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-cyan-500/10" : "bg-cyan-50"}`}>
                  <Users className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{totalMentors}</p>
                  <p className={`text-sm ${textSecondary}`}>{t.mentors?.totalMentors || "Total Mentors"}</p>
                </div>
              </div>
            </div>
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"}`}>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{avgRating}</p>
                  <p className={`text-sm ${textSecondary}`}>{t.mentors?.avgRating || "Avg Rating"}</p>
                </div>
              </div>
            </div>
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
                  <Video className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{totalSessions}+</p>
                  <p className={`text-sm ${textSecondary}`}>{t.mentors?.totalSessions || "Sessions Done"}</p>
                </div>
              </div>
            </div>
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"}`}>
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{availableMentors}</p>
                  <p className={`text-sm ${textSecondary}`}>{t.mentors?.available || "Available Now"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <div className={`flex items-center gap-2 ${cardBg} border ${cardBorder} rounded-xl px-4 py-3`}>
              <Filter className={`w-4 h-4 ${textSecondary}`} />
              <select
                value={filter.tier}
                onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
                className={`bg-transparent ${textPrimary} text-sm focus:outline-none`}
              >
                <option value="all">{t.mentors?.allColleges || "All Colleges"}</option>
                <option value="iit">{t.mentors?.iitOnly || "IIT Only"} (₹199/hr)</option>
                <option value="tier_1">{t.mentors?.tier1 || "Tier 1 NIT/IIIT"} (₹99/hr)</option>
              </select>
            </div>

            <div className={`flex-1 min-w-[250px] flex items-center gap-2 ${cardBg} border ${cardBorder} rounded-xl px-4 py-3`}>
              <Search className={`w-4 h-4 ${textSecondary}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.mentors?.searchPlaceholder || "Search by name, subject or expertise..."}
                className={`bg-transparent ${textPrimary} text-sm focus:outline-none flex-1 placeholder:${textSecondary}`}
              />
            </div>
          </motion.div>

          {/* Mentors Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${cardBg} border ${cardBorder} rounded-xl p-6 animate-pulse`}
                >
                  <div className={`w-16 h-16 ${inputBg} rounded-full mb-4`} />
                  <div className={`h-6 ${inputBg} rounded w-2/3 mb-2`} />
                  <div className={`h-4 ${inputBg} rounded w-1/2 mb-4`} />
                  <div className={`h-20 ${inputBg} rounded`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${cardBg} border ${cardBorder} rounded-xl p-6 hover:border-cyan-500/50 transition-all group overflow-hidden`}
                >
                  {theme === "dark" && <BlockBeams />}
                  <div className="relative z-10">
                    {/* Mentor Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${theme === "dark" ? "bg-white text-black" : "bg-cyan-500 text-white"}`}>
                          {mentor.display_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${textPrimary} group-hover:text-cyan-500 transition-colors`}>
                            {mentor.display_name}
                          </h3>
                          <p className={`text-sm ${textSecondary}`}>
                            {mentor.branch}
                          </p>
                        </div>
                      </div>
                      {mentor.is_available ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">
                          {t.mentors?.availableNow || "Available"}
                        </span>
                      ) : (
                        <span className={`px-2 py-1 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} ${textSecondary} text-xs rounded-full`}>
                          {t.mentors?.busy || "Busy"}
                        </span>
                      )}
                    </div>

                    {/* College Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className={`w-4 h-4 ${textSecondary}`} />
                      <span className={`text-sm font-medium ${textPrimary}`}>
                        {mentor.college_tier === "iit" ? "IIT" : "NIT/IIIT"} • Year{" "}
                        {mentor.year_of_study}
                      </span>
                      {mentor.jee_advanced_qualified && (
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-xs rounded">
                          JEE Adv ✓
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                      {mentor.bio}
                    </p>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise_subjects?.split(",").map((subject, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 ${theme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-neutral-100 border-neutral-200"} border ${textSecondary} text-xs rounded`}
                        >
                          {subject.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className={`flex items-center justify-between text-sm mb-4`}>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className={`${textPrimary} font-medium`}>
                          {mentor.rating}
                        </span>
                        <span className={textSecondary}>
                          ({mentor.total_reviews})
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${textSecondary}`}>
                        <Clock className="w-4 h-4" />
                        <span>{mentor.total_sessions} sessions</span>
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-2xl font-bold ${textPrimary}`}>
                          ₹{mentor.session_rate_1_hour}
                        </span>
                        <span className={`${textSecondary} text-sm`}>/hour</span>
                      </div>
                      <button
                        disabled={!mentor.is_available}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          mentor.is_available
                            ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                            : `${theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} ${textSecondary} cursor-not-allowed`
                        }`}
                      >
                        {mentor.is_available ? (t.mentors?.bookSession || "Book Session") : (t.mentors?.unavailable || "Unavailable")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredMentors.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-12 text-center`}
            >
              <div className={`w-16 h-16 rounded-2xl ${inputBg} flex items-center justify-center mx-auto mb-4`}>
                <Users className={`w-8 h-8 ${textSecondary}`} />
              </div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>
                {t.mentors?.noMentors || "No mentors found"}
              </h3>
              <p className={textSecondary}>
                {t.mentors?.tryDifferent || "Try adjusting your filters or search query"}
              </p>
            </motion.div>
          )}
        </div>
    </AppShell>
  );
}
