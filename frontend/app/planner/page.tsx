"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Dumbbell,
  Coffee,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { BlockBeams } from "@/component/ui/beam";

interface Task {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  completed: boolean;
  time: string;
  type: "study" | "practice" | "revision" | "break";
}

interface DaySchedule {
  date: string;
  tasks: Task[];
}

const subjects = [
  { name: "Physics", color: "bg-blue-500" },
  { name: "Chemistry", color: "bg-green-500" },
  { name: "Mathematics", color: "bg-purple-500" },
];

const taskTypes = [
  { type: "study", icon: BookOpen, label: "Study", color: "text-cyan-500" },
  { type: "practice", icon: Brain, label: "Practice", color: "text-purple-500" },
  { type: "revision", icon: Dumbbell, label: "Revision", color: "text-green-500" },
  { type: "break", icon: Coffee, label: "Break", color: "text-yellow-500" },
];

export default function PlannerPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Mechanics - Newton's Laws",
      subject: "Physics",
      duration: 90,
      completed: false,
      time: "09:00",
      type: "study",
    },
    {
      id: "2",
      title: "Organic Chemistry - Reactions",
      subject: "Chemistry",
      duration: 60,
      completed: true,
      time: "11:00",
      type: "study",
    },
    {
      id: "3",
      title: "Break",
      subject: "",
      duration: 30,
      completed: true,
      time: "12:00",
      type: "break",
    },
    {
      id: "4",
      title: "Calculus - Integration",
      subject: "Mathematics",
      duration: 120,
      completed: false,
      time: "12:30",
      type: "study",
    },
    {
      id: "5",
      title: "Physics PYQ Practice",
      subject: "Physics",
      duration: 60,
      completed: false,
      time: "15:00",
      type: "practice",
    },
    {
      id: "6",
      title: "Quick Revision - Formulas",
      subject: "Mathematics",
      duration: 45,
      completed: false,
      time: "16:30",
      type: "revision",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "Physics",
    duration: 60,
    time: "09:00",
    type: "study" as Task["type"],
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgMain} flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${theme === "dark" ? "border-white border-t-transparent" : "border-neutral-900 border-t-transparent"} rounded-full animate-spin`} />
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    setTasks([...tasks, task].sort((a, b) => a.time.localeCompare(b.time)));
    setShowAddModal(false);
    setNewTask({
      title: "",
      subject: "Physics",
      duration: 60,
      time: "09:00",
      type: "study",
    });
  };

  const getSubjectColor = (subject: string) => {
    return subjects.find((s) => s.name === subject)?.color || "bg-gray-500";
  };

  const getTaskTypeIcon = (type: Task["type"]) => {
    const taskType = taskTypes.find((t) => t.type === type);
    return taskType ? taskType.icon : BookOpen;
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalStudyTime = tasks.reduce((acc, t) => acc + t.duration, 0);
  const completedStudyTime = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.duration, 0);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>{t.planner?.title || "Study Planner"}</h1>
            <p className={textSecondary}>
              {t.planner?.subtitle || "Plan your day, track your progress, achieve your goals"}
            </p>
          </motion.div>

          {/* Date Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-6"
          >
            <button
              onClick={() => navigateDate("prev")}
              className={`p-2 rounded-lg ${cardBg} border ${cardBorder} hover:border-cyan-500/50 transition-colors`}
            >
              <ChevronLeft className={`w-5 h-5 ${textPrimary}`} />
            </button>
            <div className="text-center">
              <h2 className={`text-xl font-semibold ${textPrimary}`}>
                {formatDate(currentDate)}
              </h2>
              {currentDate.toDateString() === new Date().toDateString() && (
                <span className={`text-sm ${textSecondary}`}>{t.planner?.today || "Today"}</span>
              )}
            </div>
            <button
              onClick={() => navigateDate("next")}
              className={`p-2 rounded-lg ${cardBg} border ${cardBorder} hover:border-cyan-500/50 transition-colors`}
            >
              <ChevronRight className={`w-5 h-5 ${textPrimary}`} />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 text-center overflow-hidden`}>
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {completedTasks}/{tasks.length}
                </p>
                <p className={`text-sm ${textSecondary}`}>{t.planner?.tasksDone || "Tasks Done"}</p>
              </div>
            </div>
            <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 text-center overflow-hidden`}>
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {Math.round(completedStudyTime / 60)}h {completedStudyTime % 60}m
                </p>
                <p className={`text-sm ${textSecondary}`}>{t.planner?.studied || "Studied"}</p>
              </div>
            </div>
            <div className={`relative ${cardBg} border ${cardBorder} rounded-xl p-4 text-center overflow-hidden`}>
              {theme === "dark" && <BlockBeams />}
              <div className="relative z-10">
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m
                </p>
                <p className={`text-sm ${textSecondary}`}>{t.planner?.totalPlanned || "Total Planned"}</p>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className={`flex justify-between text-sm ${textSecondary} mb-2`}>
              <span>{t.planner?.dailyProgress || "Daily Progress"}</span>
              <span>{Math.round((completedTasks / tasks.length) * 100)}%</span>
            </div>
            <div className={`h-3 ${inputBg} border ${cardBorder} rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-full bg-cyan-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-8"
          >
            {tasks.map((task, index) => {
              const TaskIcon = getTaskTypeIcon(task.type);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all overflow-hidden ${
                    task.completed
                      ? `${cardBg} ${cardBorder} opacity-60`
                      : `${cardBg} ${cardBorder} hover:border-cyan-500/50`
                  }`}
                >
                  {theme === "dark" && <BlockBeams />}
                  <div className="relative z-10 flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                      ) : (
                        <Circle className={`w-6 h-6 ${textSecondary} hover:text-cyan-500 transition-colors`} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TaskIcon className={`w-4 h-4 ${taskTypes.find(t => t.type === task.type)?.color}`} />
                        <h3
                          className={`font-medium truncate ${
                            task.completed
                              ? `${textSecondary} line-through`
                              : textPrimary
                          }`}
                        >
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {task.subject && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs text-white ${getSubjectColor(
                              task.subject
                            )}`}
                          >
                            {task.subject}
                          </span>
                        )}
                        <span className={`${textSecondary} flex items-center gap-1`}>
                          <Clock className="w-3 h-3" />
                          {task.duration} min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${textSecondary} font-mono`}>
                        {task.time}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`p-2 ${textSecondary} hover:text-red-500 transition-colors`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Add Task Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowAddModal(true)}
            className={`w-full py-4 rounded-xl border-2 border-dashed ${cardBorder} ${textSecondary} hover:border-cyan-500/50 hover:text-cyan-500 transition-all flex items-center justify-center gap-2`}
          >
            <Plus className="w-5 h-5" />
            {t.planner?.addTask || "Add New Task"}
          </motion.button>

          {/* Add Task Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative ${cardBg} border ${cardBorder} rounded-2xl p-6 w-full max-w-md overflow-hidden`}
              >
                {theme === "dark" && <BlockBeams />}
                <div className="relative z-10">
                  <h3 className={`text-xl font-semibold ${textPrimary} mb-6`}>
                    {t.planner?.addTask || "Add New Task"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm ${textSecondary} mb-2`}>
                        {t.planner?.taskTitle || "Task Title"}
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:border-cyan-500/50`}
                        placeholder="e.g., Newton's Laws Chapter"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm ${textSecondary} mb-2`}>
                        {t.planner?.type || "Type"}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {taskTypes.map((type) => (
                          <button
                            key={type.type}
                            onClick={() =>
                              setNewTask({ ...newTask, type: type.type as Task["type"] })
                            }
                            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                              newTask.type === type.type
                                ? "border-cyan-500 bg-cyan-500/10"
                                : `${cardBorder} hover:border-cyan-500/50`
                            }`}
                          >
                            <type.icon className={`w-5 h-5 ${type.color}`} />
                            <span className={`text-xs ${textSecondary}`}>
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm ${textSecondary} mb-2`}>
                        {t.planner?.subject || "Subject"}
                      </label>
                      <select
                        value={newTask.subject}
                        onChange={(e) =>
                          setNewTask({ ...newTask, subject: e.target.value })
                        }
                        className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:border-cyan-500/50`}
                      >
                        {subjects.map((subject) => (
                          <option key={subject.name} value={subject.name}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm ${textSecondary} mb-2`}>
                          {t.planner?.time || "Time"}
                        </label>
                        <input
                          type="time"
                          value={newTask.time}
                          onChange={(e) =>
                            setNewTask({ ...newTask, time: e.target.value })
                          }
                          className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:border-cyan-500/50`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${textSecondary} mb-2`}>
                          {t.planner?.duration || "Duration (min)"}
                        </label>
                        <input
                          type="number"
                          value={newTask.duration}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              duration: parseInt(e.target.value) || 0,
                            })
                          }
                          className={`w-full ${inputBg} border ${cardBorder} rounded-lg px-4 py-3 ${textPrimary} focus:outline-none focus:border-cyan-500/50`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className={`flex-1 py-3 rounded-lg border ${cardBorder} ${textSecondary} hover:bg-neutral-800/50 transition-colors`}
                    >
                      {t.common?.cancel || "Cancel"}
                    </button>
                    <button
                      onClick={addTask}
                      disabled={!newTask.title}
                      className="flex-1 py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50"
                    >
                      {t.planner?.addTask || "Add Task"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
    </AppShell>
  );
}
