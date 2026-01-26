"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Atom,
  FlaskConical,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/component/ui/navbar";

interface Chapter {
  id: string;
  name: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  totalQuestions: number;
  solvedQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  yearRange: string;
}

interface Question {
  id: string;
  year: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  solved: boolean;
  userAnswer?: number;
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

const subjectConfig = {
  Physics: { icon: Atom, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-400" },
  Chemistry: { icon: FlaskConical, color: "from-green-500 to-emerald-500", bg: "bg-green-500/10", text: "text-green-400" },
  Mathematics: { icon: Calculator, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10", text: "text-purple-400" },
};

export default function PYQPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<"all" | "Physics" | "Chemistry" | "Mathematics">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
      case "easy": return "text-green-400 bg-green-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "hard": return "text-red-400 bg-red-500/10";
      default: return "text-neutral-400 bg-neutral-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">PYQ Practice</h1>
          <p className="text-neutral-400">
            Previous year questions organized by chapter and topic
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalQuestions}</p>
                <p className="text-sm text-neutral-400">Total Questions</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalSolved}</p>
                <p className="text-sm text-neutral-400">Solved</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round((totalSolved / totalQuestions) * 100)}%
                </p>
                <p className="text-sm text-neutral-400">Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{chapters.length}</p>
                <p className="text-sm text-neutral-400">Chapters</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
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
                    : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                {subject === "all" ? "All" : subject}
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
                  <h2 className="text-xl font-semibold text-white">{subject}</h2>
                  <span className="text-sm text-neutral-400">
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
                      className="bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all"
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
                          <div className="flex-shrink-0">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  config.color.split(" ")[0].replace("from-", "")
                                }, ${config.color.split(" ")[1].replace("to-", "")})`,
                              }}
                            >
                              <span className="text-white font-bold">
                                {chapter.solvedQuestions}/{chapter.totalQuestions}
                              </span>
                            </div>
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">
                              {chapter.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(
                                  chapter.difficulty
                                )}`}
                              >
                                {chapter.difficulty}
                              </span>
                              <span className="text-sm text-neutral-400">
                                {chapter.yearRange}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Progress Bar */}
                          <div className="hidden md:block w-32">
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
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
                            className={`w-5 h-5 text-neutral-400 transition-transform ${
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
                          className="border-t border-neutral-800 p-4"
                        >
                          <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                              Start Practice
                            </button>
                            <button className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors">
                              View Solutions
                            </button>
                            <button className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors">
                              Bookmark Chapter
                            </button>
                          </div>
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-neutral-400">Easy</p>
                              <p className="text-white font-medium">12 questions</p>
                            </div>
                            <div>
                              <p className="text-neutral-400">Medium</p>
                              <p className="text-white font-medium">20 questions</p>
                            </div>
                            <div>
                              <p className="text-neutral-400">Hard</p>
                              <p className="text-white font-medium">13 questions</p>
                            </div>
                            <div>
                              <p className="text-neutral-400">Your Accuracy</p>
                              <p className="text-green-400 font-medium">78%</p>
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
      </main>
    </div>
  );
}
