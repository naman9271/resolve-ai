"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ChevronDown,
  CheckCircle2,
  Target,
  TrendingUp,
  Atom,
  FlaskConical,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { AppShell, useSidebar } from "@/components/layout/app-shell";
import { BlockBeams } from "@/component/ui/beam";

interface Chapter {
  id: string;
  name: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  totalQuestions: number;
  solvedQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  yearRange: string;
}

const chapters: Chapter[] = [
  // Physics
  { id: "1", name: "Mechanics - Laws of Motion", subject: "Physics", totalQuestions: 45, solvedQuestions: 12, difficulty: "medium", yearRange: "2015-2024" },
  { id: "2", name: "Electromagnetism", subject: "Physics", totalQuestions: 52, solvedQuestions: 8, difficulty: "hard", yearRange: "2015-2024" },
  { id: "3", name: "Thermodynamics", subject: "Physics", totalQuestions: 38, solvedQuestions: 20, difficulty: "medium", yearRange: "2015-2024" },
  { id: "4", name: "Optics", subject: "Physics", totalQuestions: 35, solvedQuestions: 15, difficulty: "easy", yearRange: "2015-2024" },
  { id: "5", name: "Modern Physics", subject: "Physics", totalQuestions: 40, solvedQuestions: 5, difficulty: "hard", yearRange: "2015-2024" },
  // Chemistry
  { id: "6", name: "Organic Chemistry - Reactions", subject: "Chemistry", totalQuestions: 60, solvedQuestions: 25, difficulty: "hard", yearRange: "2015-2024" },
  { id: "7", name: "Inorganic Chemistry", subject: "Chemistry", totalQuestions: 42, solvedQuestions: 18, difficulty: "medium", yearRange: "2015-2024" },
  { id: "8", name: "Physical Chemistry", subject: "Chemistry", totalQuestions: 48, solvedQuestions: 22, difficulty: "medium", yearRange: "2015-2024" },
  { id: "9", name: "Chemical Bonding", subject: "Chemistry", totalQuestions: 30, solvedQuestions: 28, difficulty: "easy", yearRange: "2015-2024" },
  // Mathematics
  { id: "10", name: "Calculus - Integration", subject: "Mathematics", totalQuestions: 55, solvedQuestions: 30, difficulty: "hard", yearRange: "2015-2024" },
  { id: "11", name: "Algebra", subject: "Mathematics", totalQuestions: 50, solvedQuestions: 35, difficulty: "medium", yearRange: "2015-2024" },
  { id: "12", name: "Coordinate Geometry", subject: "Mathematics", totalQuestions: 45, solvedQuestions: 20, difficulty: "medium", yearRange: "2015-2024" },
  { id: "13", name: "Trigonometry", subject: "Mathematics", totalQuestions: 35, solvedQuestions: 32, difficulty: "easy", yearRange: "2015-2024" },
  { id: "14", name: "Probability & Statistics", subject: "Mathematics", totalQuestions: 40, solvedQuestions: 15, difficulty: "medium", yearRange: "2015-2024" },
];

/* Inner content component that can safely use useSidebar hook */
function PYQContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { openSubSidebar } = useSidebar();
  
  const [selectedSubject, setSelectedSubject] = useState<"all" | "Physics" | "Chemistry" | "Mathematics">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  const getSubjectConfig = useCallback(() => ({
    Physics: { icon: Atom, color: "from-blue-500 to-cyan-500", bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50", text: "text-blue-500" },
    Chemistry: { icon: FlaskConical, color: "from-green-500 to-emerald-500", bg: theme === "dark" ? "bg-green-500/10" : "bg-green-50", text: "text-green-500" },
    Mathematics: { icon: Calculator, color: "from-purple-500 to-pink-500", bg: theme === "dark" ? "bg-purple-500/10" : "bg-purple-50", text: "text-purple-500" },
  }), [theme]);

  const subjectConfig = getSubjectConfig();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Open sub-sidebar with PYQ filters
  useEffect(() => {
    openSubSidebar({
      title: "PYQ Practice",
      sections: [
        {
          title: "Subjects",
          items: [
            { label: "All Subjects", onClick: () => setSelectedSubject("all") },
            { label: "Physics", onClick: () => setSelectedSubject("Physics") },
            { label: "Chemistry", onClick: () => setSelectedSubject("Chemistry") },
            { label: "Mathematics", onClick: () => setSelectedSubject("Mathematics") },
          ],
        },
        {
          title: "Difficulty",
          items: [
            { label: "Easy" },
            { label: "Medium" },
            { label: "Hard" },
          ],
        },
        {
          title: "Year Range",
          items: [
            { label: "2024" },
            { label: "2023" },
            { label: "2022" },
            { label: "2021" },
            { label: "2015-2020" },
          ],
        },
      ],
    });
  }, [openSubSidebar]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${theme === "dark" ? "border-white border-t-transparent" : "border-neutral-900 border-t-transparent"} rounded-full animate-spin`} />
      </div>
    );
  }

  if (!user) return null;

  const filteredChapters = chapters.filter((chapter) => {
    const matchesSubject = selectedSubject === "all" || chapter.subject === selectedSubject;
    const matchesSearch = chapter.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const groupedChapters = filteredChapters.reduce((acc, chapter) => {
    if (!acc[chapter.subject]) {
      acc[chapter.subject] = [];
    }
    acc[chapter.subject].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  const totalQuestions = chapters.reduce((acc, c) => acc + c.totalQuestions, 0);
  const totalSolved = chapters.reduce((acc, c) => acc + c.solvedQuestions, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return theme === "dark" ? "text-green-400 bg-green-500/10" : "text-green-600 bg-green-50";
      case "medium": return theme === "dark" ? "text-yellow-400 bg-yellow-500/10" : "text-yellow-600 bg-yellow-50";
      case "hard": return theme === "dark" ? "text-red-400 bg-red-500/10" : "text-red-600 bg-red-50";
      default: return `${textSecondary} ${inputBg}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>{t.pyq?.title || "PYQ Practice"}</h1>
        <p className={textSecondary}>
          {t.pyq?.subtitle || "Previous year questions organized by chapter and topic"}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}>
          {theme === "dark" && <BlockBeams />}
          <div className="relative z-10 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-cyan-500/10" : "bg-cyan-50"}`}>
              <BookOpen className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{totalQuestions}</p>
              <p className={`text-sm ${textSecondary}`}>{"Total Questions"}</p>
            </div>
          </div>
        </div>
        <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}>
          {theme === "dark" && <BlockBeams />}
          <div className="relative z-10 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{totalSolved}</p>
              <p className={`text-sm ${textSecondary}`}>{t.pyq?.solved || "Solved"}</p>
            </div>
          </div>
        </div>
        <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}>
          {theme === "dark" && <BlockBeams />}
          <div className="relative z-10 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"}`}>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {Math.round((totalSolved / totalQuestions) * 100)}%
              </p>
              <p className={`text-sm ${textSecondary}`}>{"Progress"}</p>
            </div>
          </div>
        </div>
        <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 overflow-hidden`}>
          {theme === "dark" && <BlockBeams />}
          <div className="relative z-10 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"}`}>
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{chapters.length}</p>
              <p className={`text-sm ${textSecondary}`}>{"Chapters"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.pyq?.searchPlaceholder || "Search chapters..."}
            className={`w-full ${cardBg} border ${cardBorder} rounded-xl pl-11 pr-4 py-3 ${textPrimary} placeholder:${textSecondary} focus:outline-none focus:border-cyan-500/50`}
          />
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2">
          {["all", "Physics", "Chemistry", "Mathematics"].map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject as typeof selectedSubject)}
              className={`px-4 py-3 rounded-xl transition-all ${
                selectedSubject === subject
                  ? "bg-cyan-500 text-white"
                  : `${cardBg} border ${cardBorder} ${textSecondary} hover:border-cyan-500/50`
              }`}
            >
              {subject === "all" ? (t.pyq?.all || "All") : subject}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chapters List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {Object.entries(groupedChapters).map(([subject, subjectChapters]) => {
          const config = subjectConfig[subject as keyof typeof subjectConfig];
          const SubjectIcon = config.icon;

          return (
            <div key={subject}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <SubjectIcon className={`w-5 h-5 ${config.text}`} />
                </div>
                <h2 className={`text-xl font-semibold ${textPrimary}`}>{subject}</h2>
                <span className={`text-sm ${textSecondary}`}>
                  ({subjectChapters.length} chapters)
                </span>
              </div>

              <div className="space-y-3">
                {subjectChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all`}
                  >
                    <button
                      onClick={() =>
                        setExpandedChapter(
                          expandedChapter === chapter.id ? null : chapter.id
                        )
                      }
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${config.color}`}
                          >
                            <span className="text-white font-bold text-sm">
                              {chapter.solvedQuestions}/{chapter.totalQuestions}
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className={`font-medium ${textPrimary}`}>
                            {chapter.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                                chapter.difficulty
                              )}`}
                            >
                              {chapter.difficulty}
                            </span>
                            <span className={`text-sm ${textSecondary}`}>
                              {chapter.yearRange}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Progress Bar */}
                        <div className="hidden md:block w-32">
                          <div className={`h-2 ${inputBg} rounded-full overflow-hidden`}>
                            <div
                              className={`h-full bg-gradient-to-r ${config.color}`}
                              style={{
                                width: `${
                                  (chapter.solvedQuestions / chapter.totalQuestions) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 ${textSecondary} transition-transform ${
                            expandedChapter === chapter.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedChapter === chapter.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-t ${cardBorder} p-4`}
                      >
                        <div className="flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                            {t.pyq?.startPractice || "Start Practice"}
                          </button>
                          <button className={`px-4 py-2 border ${cardBorder} rounded-lg ${textSecondary} hover:border-cyan-500/50 transition-colors`}>
                            {t.pyq?.viewSolutions || "View Solutions"}
                          </button>
                          <button className={`px-4 py-2 border ${cardBorder} rounded-lg ${textSecondary} hover:border-cyan-500/50 transition-colors`}>
                            {t.pyq?.bookmark || "Bookmark Chapter"}
                          </button>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className={textSecondary}>{t.pyq?.easy || "Easy"}</p>
                            <p className={`${textPrimary} font-medium`}>12 questions</p>
                          </div>
                          <div>
                            <p className={textSecondary}>{t.pyq?.medium || "Medium"}</p>
                            <p className={`${textPrimary} font-medium`}>20 questions</p>
                          </div>
                          <div>
                            <p className={textSecondary}>{t.pyq?.hard || "Hard"}</p>
                            <p className={`${textPrimary} font-medium`}>13 questions</p>
                          </div>
                          <div>
                            <p className={textSecondary}>{t.pyq?.accuracy || "Your Accuracy"}</p>
                            <p className="text-green-500 font-medium">78%</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* Main page component - wraps content with AppShell first */
export default function PYQPage() {
  return (
    <AppShell>
      <PYQContent />
    </AppShell>
  );
}
