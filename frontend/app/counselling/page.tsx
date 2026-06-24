"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ChevronRight,
  Building,
  TrendingUp,
  Award,
  BookOpen,
  Info,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { AppShell, useSidebar } from "@/components/layout/app-shell";

/* ----------------------------- Types ----------------------------- */

interface CollegeType {
  id: string;
  name: string;
  fullName: string;
  description: string;
  rankRange: string;
  examRequired: string;
  icon: string;
}

interface Branch {
  name: string;
  description: string;
  avgPackage: string;
  topRecruiters: string[];
  skills: string[];
}

/* ----------------------------- Data ----------------------------- */

const collegeTypes: CollegeType[] = [
  {
    id: "iit",
    name: "IITs",
    fullName: "Indian Institutes of Technology",
    description: "Premier engineering institutes of India. Known for world-class education, research, and placements.",
    rankRange: "AIR 1 - 10,000 (JEE Advanced)",
    examRequired: "JEE Advanced",
    icon: "🏛️",
  },
  {
    id: "nit",
    name: "NITs",
    fullName: "National Institutes of Technology",
    description: "Nationally important technical institutes. Excellent faculty and industry connections.",
    rankRange: "AIR 1,000 - 50,000 (JEE Main)",
    examRequired: "JEE Main",
    icon: "🎓",
  },
  {
    id: "iiit",
    name: "IIITs",
    fullName: "Indian Institutes of Information Technology",
    description: "Focused on IT and related fields. Strong industry partnerships and research.",
    rankRange: "AIR 2,000 - 40,000 (JEE Main)",
    examRequired: "JEE Main",
    icon: "💻",
  },
  {
    id: "gfti",
    name: "GFTIs",
    fullName: "Government Funded Technical Institutes",
    description: "Quality technical education at affordable fees. Good placements in respective regions.",
    rankRange: "AIR 10,000 - 150,000 (JEE Main)",
    examRequired: "JEE Main",
    icon: "🏫",
  },
  {
    id: "private",
    name: "Private",
    fullName: "Private Engineering Colleges",
    description: "BITS, VIT, SRM, Manipal, and others. Many offer excellent education and placements.",
    rankRange: "Varies by institute",
    examRequired: "Institute-specific exams",
    icon: "🏢",
  },
];

const branches: Branch[] = [
  {
    name: "Computer Science & Engineering",
    description: "Study of computation, programming, and computer systems. Highest demand in the industry.",
    avgPackage: "₹12-25 LPA (IITs), ₹6-15 LPA (NITs)",
    topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Flipkart"],
    skills: ["Programming", "Data Structures", "Algorithms", "ML/AI", "System Design"],
  },
  {
    name: "Electrical Engineering",
    description: "Study of electricity, electronics, and electromagnetism. Core engineering branch.",
    avgPackage: "₹10-20 LPA (IITs), ₹5-12 LPA (NITs)",
    topRecruiters: ["Intel", "Qualcomm", "Texas Instruments", "Siemens", "ABB"],
    skills: ["Circuit Design", "Signal Processing", "Control Systems", "Power Systems"],
  },
  {
    name: "Mechanical Engineering",
    description: "Design and manufacturing of mechanical systems. Evergreen engineering discipline.",
    avgPackage: "₹8-18 LPA (IITs), ₹4-10 LPA (NITs)",
    topRecruiters: ["Tata Motors", "Mahindra", "L&T", "Bosch", "Maruti Suzuki"],
    skills: ["CAD/CAM", "Thermodynamics", "Manufacturing", "Robotics", "Automotive"],
  },
  {
    name: "Electronics & Communication",
    description: "Study of electronic devices and communication systems. Growing with 5G and IoT.",
    avgPackage: "₹10-20 LPA (IITs), ₹5-12 LPA (NITs)",
    topRecruiters: ["Samsung", "Nvidia", "Cisco", "Broadcom", "MediaTek"],
    skills: ["VLSI", "Embedded Systems", "Communication", "RF Design", "IoT"],
  },
  {
    name: "Chemical Engineering",
    description: "Design of chemical processes and systems. Important for pharmaceutical and energy sectors.",
    avgPackage: "₹8-15 LPA (IITs), ₹4-9 LPA (NITs)",
    topRecruiters: ["Reliance", "IOCL", "HPCL", "ONGC", "Shell"],
    skills: ["Process Design", "Thermodynamics", "Plant Operations", "Safety"],
  },
  {
    name: "Civil Engineering",
    description: "Design and construction of infrastructure. Essential for nation building.",
    avgPackage: "₹7-14 LPA (IITs), ₹4-8 LPA (NITs)",
    topRecruiters: ["L&T", "DLF", "Shapoorji Pallonji", "Gammon", "DMRC"],
    skills: ["Structural Design", "Construction", "Project Management", "AutoCAD"],
  },
];

const rankGuidance = [
  { range: "Under 1,000", advice: "Excellent! You can get top branches in top IITs. Focus on choosing the right branch for your interests.", color: "text-green-500" },
  { range: "1,000 - 5,000", advice: "Great score! You'll get good branches in IITs or top branches in top NITs. Consider your preference.", color: "text-green-500" },
  { range: "5,000 - 10,000", advice: "You can get decent branches in newer IITs or top branches in good NITs/IIITs. Research all options.", color: "text-blue-500" },
  { range: "10,000 - 25,000", advice: "NITs, IIITs, and some good GFTIs are available. Focus on college reputation and placement records.", color: "text-blue-500" },
  { range: "25,000 - 50,000", advice: "Look at newer NITs, IIITs, and GFTIs. Also consider good private colleges like BITS, VIT.", color: "text-yellow-500" },
  { range: "50,000+", advice: "Focus on GFTIs and state colleges. Private colleges can also be good options based on your budget.", color: "text-yellow-500" },
];

/* ----------------------------- Inner Content Component ----------------------------- */

function CounsellingContent() {
  const { theme } = useTheme();
  const { openSubSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState<"colleges" | "branches" | "guidance">("colleges");
  const [selectedCollege, setSelectedCollege] = useState<CollegeType | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Theme classes
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";

  // Open sub-sidebar with navigation
  useEffect(() => {
    openSubSidebar({
      title: "College Counselling",
      sections: [
        {
          title: "Explore",
          items: [
            { label: "College Types", onClick: () => { setActiveTab("colleges"); setSelectedCollege(null); } },
            { label: "Branch Explorer", onClick: () => { setActiveTab("branches"); setSelectedBranch(null); } },
            { label: "Rank Guidance", onClick: () => setActiveTab("guidance") },
          ],
        },
        {
          title: "College Categories",
          items: collegeTypes.map(college => ({
            label: `${college.icon} ${college.name}`,
            onClick: () => { setActiveTab("colleges"); setSelectedCollege(college); },
          })),
        },
        {
          title: "Popular Branches",
          items: branches.slice(0, 4).map(branch => ({
            label: branch.name.split("&")[0].trim(),
            onClick: () => { setActiveTab("branches"); setSelectedBranch(branch); },
          })),
        },
      ],
    });
  }, [openSubSidebar]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className={`w-6 h-6 ${textPrimary}`} />
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>College Counselling</h1>
        </div>
        <p className={textSecondary}>
          Understand your options and make informed decisions about your future
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8"
      >
        {[
          { id: "colleges", label: "College Types", icon: Building },
          { id: "branches", label: "Branch Explorer", icon: BookOpen },
          { id: "guidance", label: "Rank Guidance", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as "colleges" | "branches" | "guidance");
                setSelectedCollege(null);
                setSelectedBranch(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white"
                  : `${cardBg} border ${cardBorder} ${textSecondary}`
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* College Types View */}
      {activeTab === "colleges" && !selectedCollege && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {collegeTypes.map((college, index) => (
            <motion.button
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => setSelectedCollege(college)}
              className={`${cardBg} border ${cardBorder} rounded-xl p-5 text-left hover:border-neutral-500 transition-all group`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{college.icon}</span>
                <ChevronRight className={`w-5 h-5 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className={`text-lg font-medium ${textPrimary} mb-1`}>{college.name}</h3>
              <p className={`text-xs ${textSecondary} mb-3`}>{college.fullName}</p>
              <p className={`text-sm ${textSecondary} line-clamp-2`}>{college.description}</p>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Selected College Detail */}
      {activeTab === "colleges" && selectedCollege && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setSelectedCollege(null)}
            className={`flex items-center gap-1 text-sm ${textSecondary} mb-4 hover:${textPrimary}`}
          >
            ← Back to all colleges
          </button>

          <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{selectedCollege.icon}</span>
              <div>
                <h2 className={`text-xl font-semibold ${textPrimary}`}>{selectedCollege.name}</h2>
                <p className={`text-sm ${textSecondary}`}>{selectedCollege.fullName}</p>
              </div>
            </div>

            <p className={`${textSecondary} mb-6`}>{selectedCollege.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${textSecondary}`} />
                  <span className={`text-sm font-medium ${textPrimary}`}>Typical Rank Range</span>
                </div>
                <p className={`text-sm ${textSecondary}`}>{selectedCollege.rankRange}</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className={`w-4 h-4 ${textSecondary}`} />
                  <span className={`text-sm font-medium ${textPrimary}`}>Exam Required</span>
                </div>
                <p className={`text-sm ${textSecondary}`}>{selectedCollege.examRequired}</p>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg border ${cardBorder}`}>
              <div className="flex items-start gap-2">
                <Info className={`w-4 h-4 ${textSecondary} mt-0.5`} />
                <p className={`text-sm ${textSecondary}`}>
                  Rank ranges are approximate and vary each year based on competition and seat availability. 
                  Always refer to official counselling data for accurate cutoffs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Branch Explorer View */}
      {activeTab === "branches" && !selectedBranch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {branches.map((branch, index) => (
            <motion.button
              key={branch.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => setSelectedBranch(branch)}
              className={`${cardBg} border ${cardBorder} rounded-xl p-5 text-left hover:border-neutral-500 transition-all group flex items-center justify-between`}
            >
              <div>
                <h3 className={`font-medium ${textPrimary} mb-1`}>{branch.name}</h3>
                <p className={`text-sm ${textSecondary} line-clamp-1`}>{branch.description}</p>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Selected Branch Detail */}
      {activeTab === "branches" && selectedBranch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setSelectedBranch(null)}
            className={`flex items-center gap-1 text-sm ${textSecondary} mb-4 hover:${textPrimary}`}
          >
            ← Back to all branches
          </button>

          <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
            <h2 className={`text-xl font-semibold ${textPrimary} mb-2`}>{selectedBranch.name}</h2>
            <p className={`${textSecondary} mb-6`}>{selectedBranch.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}>
                <span className={`text-sm font-medium ${textPrimary}`}>Average Package</span>
                <p className={`text-sm ${textSecondary} mt-1`}>{selectedBranch.avgPackage}</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}>
                <span className={`text-sm font-medium ${textPrimary}`}>Top Recruiters</span>
                <p className={`text-sm ${textSecondary} mt-1`}>{selectedBranch.topRecruiters.join(", ")}</p>
              </div>
            </div>

            <div>
              <span className={`text-sm font-medium ${textPrimary}`}>Key Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBranch.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 rounded-full text-xs ${
                      theme === "dark" ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rank Guidance View */}
      {activeTab === "guidance" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-5 mb-6`}>
            <div className="flex items-start gap-3">
              <Info className={`w-5 h-5 ${textSecondary} mt-0.5`} />
              <div>
                <h3 className={`font-medium ${textPrimary} mb-1`}>How to use this guide</h3>
                <p className={`text-sm ${textSecondary}`}>
                  These are general guidelines based on historical trends. Actual cutoffs vary each year 
                  based on difficulty, number of aspirants, and seat availability. Use this as a starting 
                  point for your research.
                </p>
              </div>
            </div>
          </div>

          {rankGuidance.map((item, index) => (
            <motion.div
              key={item.range}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`${cardBg} border ${cardBorder} rounded-xl p-5`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-mono font-semibold ${item.color}`}>AIR {item.range}</span>
              </div>
              <p className={`text-sm ${textSecondary}`}>{item.advice}</p>
            </motion.div>
          ))}

          <div className={`mt-6 p-5 rounded-xl border ${cardBorder} ${theme === "dark" ? "bg-neutral-900/50" : "bg-neutral-50"}`}>
            <h3 className={`font-medium ${textPrimary} mb-3`}>Important Tips</h3>
            <ul className={`text-sm ${textSecondary} space-y-2`}>
              <li>• Research placement statistics, not just brand name</li>
              <li>• Consider location and proximity to industry hubs</li>
              <li>• Branch choice matters - don't just chase college tag</li>
              <li>• Talk to current students and alumni if possible</li>
              <li>• Keep backup options ready during counselling</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ----------------------------- Main Page Component ----------------------------- */

export default function CounsellingPage() {
  return (
    <AppShell>
      <CounsellingContent />
    </AppShell>
  );
}
