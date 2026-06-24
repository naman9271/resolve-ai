"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Video,
  FileText,
  Search,
  ExternalLink,
  Clock,
  Star,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { AppShell, useSidebar } from "@/components/layout/app-shell";

/* ----------------------------- Types ----------------------------- */

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "notes" | "video" | "test";
  subject: "Physics" | "Chemistry" | "Mathematics";
  chapter: string;
  link: string;
  duration?: string;
  rating: number;
  downloads?: number;
  views?: number;
}

/* ----------------------------- Data ----------------------------- */

const resources: Resource[] = [
  // Physics Notes
  { id: "1", title: "Mechanics Complete Notes", description: "Comprehensive notes covering Newton's Laws, Work-Energy, Rotational Motion", type: "notes", subject: "Physics", chapter: "Mechanics", link: "#", rating: 4.8, downloads: 15420 },
  { id: "2", title: "Electromagnetism Formulae Sheet", description: "All important formulas for Electric Fields, Magnetism, EMI", type: "notes", subject: "Physics", chapter: "Electromagnetism", link: "#", rating: 4.9, downloads: 12300 },
  { id: "3", title: "Modern Physics Quick Revision", description: "Atomic structure, Photoelectric effect, Nuclear physics", type: "notes", subject: "Physics", chapter: "Modern Physics", link: "#", rating: 4.7, downloads: 9800 },
  
  // Physics Videos
  { id: "4", title: "Mechanics Full Playlist", description: "Complete video series on JEE Mechanics by IIT faculty", type: "video", subject: "Physics", chapter: "Mechanics", link: "#", duration: "12 hours", rating: 4.9, views: 250000 },
  { id: "5", title: "Optics Problem Solving", description: "Step-by-step problem solving techniques for Optics", type: "video", subject: "Physics", chapter: "Optics", link: "#", duration: "6 hours", rating: 4.8, views: 180000 },
  
  // Chemistry Notes
  { id: "6", title: "Organic Chemistry Reactions", description: "Named reactions, mechanisms, and important conversions", type: "notes", subject: "Chemistry", chapter: "Organic Chemistry", link: "#", rating: 4.9, downloads: 22100 },
  { id: "7", title: "Inorganic Chemistry Charts", description: "Periodic trends, coordination compounds, metallurgy", type: "notes", subject: "Chemistry", chapter: "Inorganic Chemistry", link: "#", rating: 4.7, downloads: 14500 },
  { id: "8", title: "Physical Chemistry Numericals", description: "Solved numericals for Thermodynamics, Electrochemistry, Kinetics", type: "notes", subject: "Chemistry", chapter: "Physical Chemistry", link: "#", rating: 4.8, downloads: 16800 },
  
  // Chemistry Videos
  { id: "9", title: "Organic Chemistry Complete", description: "Full course covering GOC, reactions, and biomolecules", type: "video", subject: "Chemistry", chapter: "Organic Chemistry", link: "#", duration: "18 hours", rating: 4.9, views: 320000 },
  
  // Mathematics Notes
  { id: "10", title: "Calculus Master Notes", description: "Limits, Derivatives, Integration with solved examples", type: "notes", subject: "Mathematics", chapter: "Calculus", link: "#", rating: 4.9, downloads: 28900 },
  { id: "11", title: "Coordinate Geometry Shortcuts", description: "Quick methods for Straight Lines, Circles, Conics", type: "notes", subject: "Mathematics", chapter: "Coordinate Geometry", link: "#", rating: 4.8, downloads: 19200 },
  { id: "12", title: "Algebra Tricks & Tips", description: "Quadratic equations, Complex numbers, Matrices", type: "notes", subject: "Mathematics", chapter: "Algebra", link: "#", rating: 4.7, downloads: 15600 },
  
  // Mathematics Videos
  { id: "13", title: "Integration Techniques", description: "All methods of integration explained with examples", type: "video", subject: "Mathematics", chapter: "Calculus", link: "#", duration: "8 hours", rating: 4.9, views: 420000 },
  
  // Test Series
  { id: "14", title: "JEE Main Mock Test Series", description: "10 full-length mock tests with detailed solutions", type: "test", subject: "Physics", chapter: "All Chapters", link: "#", rating: 4.8, downloads: 45000 },
  { id: "15", title: "Chemistry Chapter Tests", description: "Topic-wise practice tests for all chapters", type: "test", subject: "Chemistry", chapter: "All Chapters", link: "#", rating: 4.7, downloads: 32000 },
  { id: "16", title: "Mathematics DPPs", description: "Daily Practice Problems for consistent practice", type: "test", subject: "Mathematics", chapter: "All Chapters", link: "#", rating: 4.8, downloads: 38000 },
];

/* ----------------------------- Inner Content Component ----------------------------- */

function ResourcesContent() {
  const { theme } = useTheme();
  const { openSubSidebar } = useSidebar();
  const [activeType, setActiveType] = useState<"all" | "notes" | "video" | "test">("all");
  const [activeSubject, setActiveSubject] = useState<"all" | "Physics" | "Chemistry" | "Mathematics">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Theme classes
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  // Open sub-sidebar with resource categories
  useEffect(() => {
    openSubSidebar({
      title: "Resources",
      sections: [
        {
          title: "Resource Type",
          items: [
            { label: "All Resources", onClick: () => setActiveType("all") },
            { label: "📘 Free Notes", onClick: () => setActiveType("notes") },
            { label: "🎥 Video Playlists", onClick: () => setActiveType("video") },
            { label: "📝 Practice Tests", onClick: () => setActiveType("test") },
          ],
        },
        {
          title: "Subjects",
          items: [
            { label: "All Subjects", onClick: () => setActiveSubject("all") },
            { 
              label: "Physics", 
              onClick: () => setActiveSubject("Physics"),
              children: [
                { label: "Mechanics" },
                { label: "Electromagnetism" },
                { label: "Optics" },
                { label: "Modern Physics" },
              ]
            },
            { 
              label: "Chemistry", 
              onClick: () => setActiveSubject("Chemistry"),
              children: [
                { label: "Organic" },
                { label: "Inorganic" },
                { label: "Physical" },
              ]
            },
            { 
              label: "Mathematics", 
              onClick: () => setActiveSubject("Mathematics"),
              children: [
                { label: "Calculus" },
                { label: "Algebra" },
                { label: "Coordinate Geometry" },
              ]
            },
          ],
        },
      ],
    });
  }, [openSubSidebar]);

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesType = activeType === "all" || resource.type === activeType;
    const matchesSubject = activeSubject === "all" || resource.subject === activeSubject;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSubject && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "notes": return BookOpen;
      case "video": return Video;
      case "test": return FileText;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "notes": return theme === "dark" ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
      case "video": return theme === "dark" ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600";
      case "test": return theme === "dark" ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600";
      default: return "";
    }
  };

  const stats = {
    notes: resources.filter(r => r.type === "notes").length,
    videos: resources.filter(r => r.type === "video").length,
    tests: resources.filter(r => r.type === "test").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-2xl font-semibold ${textPrimary} mb-2`}>Resource Hub</h1>
        <p className={textSecondary}>
          Free study materials curated for your JEE preparation
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <button
          onClick={() => setActiveType("notes")}
          className={`${cardBg} border ${cardBorder} rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${activeType === "notes" ? "ring-2 ring-blue-500" : ""}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"}`}>
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <span className={`text-2xl font-bold ${textPrimary}`}>{stats.notes}</span>
          </div>
          <p className={`text-sm ${textSecondary}`}>Free Notes</p>
        </button>

        <button
          onClick={() => setActiveType("video")}
          className={`${cardBg} border ${cardBorder} rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${activeType === "video" ? "ring-2 ring-purple-500" : ""}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"}`}>
              <Video className="w-5 h-5 text-purple-500" />
            </div>
            <span className={`text-2xl font-bold ${textPrimary}`}>{stats.videos}</span>
          </div>
          <p className={`text-sm ${textSecondary}`}>Video Playlists</p>
        </button>

        <button
          onClick={() => setActiveType("test")}
          className={`${cardBg} border ${cardBorder} rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${activeType === "test" ? "ring-2 ring-green-500" : ""}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <span className={`text-2xl font-bold ${textPrimary}`}>{stats.tests}</span>
          </div>
          <p className={`text-sm ${textSecondary}`}>Practice Tests</p>
        </button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${inputBg} ${textPrimary} border ${cardBorder} focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm`}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "Physics", "Chemistry", "Mathematics"] as const).map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === subject
                  ? theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white"
                  : `${cardBg} border ${cardBorder} ${textSecondary}`
              }`}
            >
              {subject === "all" ? "All" : subject}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Filters */}
      {(activeType !== "all" || activeSubject !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className={`text-sm ${textSecondary}`}>Filters:</span>
          {activeType !== "all" && (
            <button
              onClick={() => setActiveType("all")}
              className={`px-2 py-1 rounded text-xs ${getTypeColor(activeType)} flex items-center gap-1`}
            >
              {activeType}
              <span className="ml-1">×</span>
            </button>
          )}
          {activeSubject !== "all" && (
            <button
              onClick={() => setActiveSubject("all")}
              className={`px-2 py-1 rounded text-xs ${cardBg} border ${cardBorder} ${textSecondary} flex items-center gap-1`}
            >
              {activeSubject}
              <span className="ml-1">×</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredResources.map((resource, index) => {
          const Icon = getTypeIcon(resource.type);
          return (
            <motion.a
              key={resource.id}
              href={resource.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`${cardBg} border ${cardBorder} rounded-xl p-4 flex items-start gap-4 hover:border-neutral-500 transition-all group`}
            >
              <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium ${textPrimary} group-hover:underline`}>
                    {resource.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    theme === "dark" ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {resource.subject}
                  </span>
                </div>
                <p className={`text-sm ${textSecondary} mb-2 line-clamp-1`}>
                  {resource.description}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className={`flex items-center gap-1 ${textSecondary}`}>
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {resource.rating}
                  </span>
                  {resource.duration && (
                    <span className={`flex items-center gap-1 ${textSecondary}`}>
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </span>
                  )}
                  {resource.downloads && (
                    <span className={textSecondary}>
                      {(resource.downloads / 1000).toFixed(1)}k downloads
                    </span>
                  )}
                  {resource.views && (
                    <span className={textSecondary}>
                      {(resource.views / 1000).toFixed(0)}k views
                    </span>
                  )}
                </div>
              </div>

              <ExternalLink className={`w-4 h-4 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.a>
          );
        })}
      </motion.div>

      {filteredResources.length === 0 && (
        <div className={`text-center py-12 ${textSecondary}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No resources found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Main Page Component ----------------------------- */

export default function ResourcesPage() {
  return (
    <AppShell>
      <ResourcesContent />
    </AppShell>
  );
}
