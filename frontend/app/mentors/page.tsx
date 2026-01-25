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
} from "lucide-react";
import { Navbar } from "@/component/ui/navbar";
import { mentorApi, MentorProfile } from "@/lib/api";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    tier: "all",
    subject: "all",
  });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorApi.listMentors();
        setMentors(data);
      } catch (error) {
        // Use sample data if API fails
        setMentors([
          {
            id: 1,
            display_name: "Mentor Alpha",
            college_tier: "iit",
            branch: "Computer Science",
            year_of_study: 3,
            jee_advanced_qualified: true,
            verification_status: "approved",
            bio: "JEE AIR 245. Passionate about teaching Physics and Mathematics.",
            expertise_subjects: "Physics, Mathematics",
            hourly_rate: 199,
            is_available: true,
            total_sessions: 150,
            rating: 4.9,
            total_reviews: 45,
          },
          {
            id: 2,
            display_name: "Mentor Beta",
            college_tier: "tier_1",
            branch: "Electrical Engineering",
            year_of_study: 4,
            jee_advanced_qualified: true,
            verification_status: "approved",
            bio: "Specialized in Chemistry and helping students with organic chemistry.",
            expertise_subjects: "Chemistry, Physics",
            hourly_rate: 99,
            is_available: true,
            total_sessions: 200,
            rating: 4.8,
            total_reviews: 62,
          },
          {
            id: 3,
            display_name: "Mentor Gamma",
            college_tier: "iit",
            branch: "Mechanical Engineering",
            year_of_study: 2,
            jee_advanced_qualified: true,
            verification_status: "approved",
            bio: "Focus on problem-solving techniques and time management.",
            expertise_subjects: "Mathematics, Physics",
            hourly_rate: 199,
            is_available: false,
            total_sessions: 80,
            rating: 4.7,
            total_reviews: 28,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    if (filter.tier !== "all" && mentor.college_tier !== filter.tier) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="pt-20 px-6 md:px-12 lg:px-20 pb-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Find Your Mentor 🎯
            </h1>
            <p className="text-neutral-400">
              Connect with verified IIT/NIT students for personalized guidance
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={filter.tier}
                onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
                className="bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="all">All Colleges</option>
                <option value="iit">IIT Only (₹199/hr)</option>
                <option value="tier_1">Tier 1 NIT/IIIT (₹99/hr)</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by subject or expertise..."
                className="bg-transparent text-white text-sm focus:outline-none flex-1"
              />
            </div>
          </motion.div>

          {/* Mentors Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-16 h-16 bg-neutral-800 rounded-full mb-4" />
                  <div className="h-6 bg-neutral-800 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2 mb-4" />
                  <div className="h-20 bg-neutral-800 rounded" />
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
                  className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all group"
                >
                  {/* Mentor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${
                          mentor.college_tier === "iit"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        }`}
                      >
                        {mentor.display_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {mentor.display_name}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {mentor.branch}
                        </p>
                      </div>
                    </div>
                    {mentor.is_available ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-neutral-700/50 text-neutral-400 text-xs rounded-full">
                        Busy
                      </span>
                    )}
                  </div>

                  {/* College Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span
                      className={`text-sm font-medium ${
                        mentor.college_tier === "iit"
                          ? "text-yellow-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {mentor.college_tier === "iit" ? "IIT" : "NIT/IIIT"} • Year{" "}
                      {mentor.year_of_study}
                    </span>
                    {mentor.jee_advanced_qualified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                    {mentor.bio}
                  </p>

                  {/* Expertise */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise_subjects?.split(",").map((subject, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded"
                      >
                        {subject.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">
                        {mentor.rating}
                      </span>
                      <span className="text-neutral-500">
                        ({mentor.total_reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-4 h-4" />
                      <span>{mentor.total_sessions} sessions</span>
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        ₹{mentor.hourly_rate}
                      </span>
                      <span className="text-neutral-400 text-sm">/hour</span>
                    </div>
                    <button
                      disabled={!mentor.is_available}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        mentor.is_available
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                          : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      }`}
                    >
                      {mentor.is_available ? "Book Session" : "Unavailable"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredMentors.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-neutral-400">
                No mentors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
