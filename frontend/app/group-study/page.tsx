"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Users,
  ScreenShare,
  Settings,
  Plus,
  Search,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Music,
  X,
  Send,
  MoreVertical,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

// Demo data for active rooms
const demoRooms = [
  {
    id: 1,
    name: "Physics Mechanics Group",
    subject: "Physics",
    participants: 5,
    maxParticipants: 8,
    host: "Rahul S.",
    isLive: true,
    tags: ["JEE Main", "Mechanics"],
  },
  {
    id: 2,
    name: "Organic Chemistry Marathon",
    subject: "Chemistry",
    participants: 12,
    maxParticipants: 15,
    host: "Priya M.",
    isLive: true,
    tags: ["JEE Advanced", "Organic"],
  },
  {
    id: 3,
    name: "Calculus Problem Solving",
    subject: "Mathematics",
    participants: 7,
    maxParticipants: 10,
    host: "Amit K.",
    isLive: true,
    tags: ["Integration", "Differentiation"],
  },
  {
    id: 4,
    name: "JEE Advanced 2025 Strategy",
    subject: "General",
    participants: 20,
    maxParticipants: 25,
    host: "Mentor Alpha",
    isLive: true,
    tags: ["Strategy", "Tips"],
  },
];

// Demo chat messages
const demoChatMessages = [
  { id: 1, user: "Rahul S.", message: "Can someone explain the concept of moment of inertia?", time: "2 min ago", avatar: "R" },
  { id: 2, user: "Priya M.", message: "It's the rotational equivalent of mass. The resistance to angular acceleration.", time: "1 min ago", avatar: "P" },
  { id: 3, user: "Amit K.", message: "Think of it as how mass is distributed around the axis of rotation", time: "Just now", avatar: "A" },
];

// Demo participants
const demoParticipants = [
  { id: 1, name: "You", isMuted: false, isVideoOn: true, isHost: false },
  { id: 2, name: "Rahul S.", isMuted: true, isVideoOn: true, isHost: true },
  { id: 3, name: "Priya M.", isMuted: false, isVideoOn: false, isHost: false },
  { id: 4, name: "Amit K.", isMuted: true, isVideoOn: true, isHost: false },
  { id: 5, name: "Neha G.", isMuted: false, isVideoOn: true, isHost: false },
];

export default function GroupStudyPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Theme classes
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const cardBg = theme === "dark" ? "bg-neutral-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-neutral-800" : "border-neutral-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-neutral-400" : "text-neutral-600";
  const inputBg = theme === "dark" ? "bg-neutral-800" : "bg-neutral-100";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredRooms = demoRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Room Lobby View
  if (!isInRoom) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-2`}>
                {t.groupStudy.title}
              </h1>
              <p className={`${textSecondary} text-lg`}>{t.groupStudy.subtitle}</p>
            </motion.div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className={`flex-1 relative`}>
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search rooms by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${cardBorder} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t.groupStudy.createRoom}
              </motion.button>
            </div>

            {/* Pomodoro Timer Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-6 mb-8`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${theme === "dark" ? "bg-cyan-500/10" : "bg-cyan-50"} flex items-center justify-center`}>
                    <Clock className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>{t.groupStudy.pomodoroTimer}</h3>
                    <p className={`text-sm ${textSecondary}`}>{t.groupStudy.focusMode} - 25 min focus, 5 min break</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-mono font-bold ${textPrimary}`}>
                    {formatTime(pomodoroTime)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                      className={`p-3 rounded-xl ${theme === "dark" ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-100 hover:bg-neutral-200"} transition-colors`}
                    >
                      {isPomodoroRunning ? (
                        <Pause className={`w-5 h-5 ${textPrimary}`} />
                      ) : (
                        <Play className={`w-5 h-5 ${textPrimary}`} />
                      )}
                    </button>
                    <button
                      onClick={() => setPomodoroTime(25 * 60)}
                      className={`p-3 rounded-xl ${theme === "dark" ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-100 hover:bg-neutral-200"} transition-colors`}
                    >
                      <RotateCcw className={`w-5 h-5 ${textPrimary}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Rooms */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className={`text-xl font-semibold ${textPrimary}`}>{t.groupStudy.activeRooms}</h2>
                <span className={`text-sm ${textSecondary}`}>({filteredRooms.length} rooms)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${cardBg} border ${cardBorder} rounded-2xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer group`}
                    onClick={() => setIsInRoom(true)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${textPrimary} group-hover:text-cyan-500 transition-colors`}>
                            {room.name}
                          </h3>
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                          </span>
                        </div>
                        <p className={`text-sm ${textSecondary}`}>Hosted by {room.host}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        room.subject === "Physics" ? "bg-blue-500/10 text-blue-500" :
                        room.subject === "Chemistry" ? "bg-green-500/10 text-green-500" :
                        room.subject === "Mathematics" ? "bg-purple-500/10 text-purple-500" :
                        "bg-cyan-500/10 text-cyan-500"
                      }`}>
                        {room.subject}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${textSecondary}`} />
                        <span className={`text-sm ${textSecondary}`}>
                          {room.participants}/{room.maxParticipants} {t.groupStudy.participants}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {room.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded-lg text-xs ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} ${textSecondary}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors"
                    >
                      {t.groupStudy.join}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredRooms.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${cardBg} border ${cardBorder} rounded-2xl p-12 text-center`}
              >
                <div className={`w-16 h-16 rounded-2xl ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center mx-auto mb-4`}>
                  <Users className={`w-8 h-8 ${textSecondary}`} />
                </div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>{t.groupStudy.noActiveRooms}</h3>
                <p className={`${textSecondary} mb-6`}>{t.groupStudy.createFirstRoom}</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
                >
                  {t.groupStudy.createRoom}
                </button>
              </motion.div>
            )}
          </div>

          {/* Create Room Modal */}
          <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${cardBg} rounded-2xl p-6 w-full max-w-md border ${cardBorder}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${textPrimary}`}>{t.groupStudy.createRoom}</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-100"}`}
                  >
                    <X className={`w-5 h-5 ${textSecondary}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      {t.groupStudy.roomName}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Physics Problem Solving"
                      className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${cardBorder} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      {t.groupStudy.subject}
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${cardBorder} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>General</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                      {t.groupStudy.maxParticipants}
                    </label>
                    <select className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${cardBorder} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}>
                      <option>5</option>
                      <option>10</option>
                      <option>15</option>
                      <option>20</option>
                      <option>25</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateModal(false);
                      setIsInRoom(true);
                    }}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
                  >
                    {t.groupStudy.createRoom}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>
    );
  }

  // In-Room View (Video Call Interface)
  return (
    <AppShell>
      <div className="h-screen flex flex-col">
        {/* Room Header */}
        <div className={`${cardBg} border-b ${cardBorder} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <h1 className={`font-semibold ${textPrimary}`}>Physics Mechanics Group</h1>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${textSecondary}`}>
              <Users className="w-4 h-4 inline mr-1" />
              {demoParticipants.length} {t.groupStudy.participants}
            </span>
            <span className={`text-lg font-mono ${textPrimary}`}>{formatTime(pomodoroTime)}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {demoParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${cardBg} rounded-2xl border ${cardBorder} overflow-hidden ${
                    participant.name === "You" ? "ring-2 ring-cyan-500" : ""
                  }`}
                >
                  {participant.isVideoOn ? (
                    <div className={`w-full h-full ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} flex items-center justify-center`}>
                      <div className={`w-20 h-20 rounded-full ${theme === "dark" ? "bg-neutral-700" : "bg-neutral-300"} flex items-center justify-center text-3xl font-semibold ${textPrimary}`}>
                        {participant.name[0]}
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-full ${theme === "dark" ? "bg-neutral-900" : "bg-neutral-100"} flex items-center justify-center`}>
                      <div className={`w-20 h-20 rounded-full ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} flex items-center justify-center text-3xl font-semibold ${textPrimary}`}>
                        {participant.name[0]}
                      </div>
                    </div>
                  )}
                  
                  {/* Participant Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        {participant.name}
                        {participant.isHost && (
                          <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">Host</span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {participant.isMuted && (
                          <MicOff className="w-4 h-4 text-red-400" />
                        )}
                        {!participant.isVideoOn && (
                          <VideoOff className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 350, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className={`${cardBg} border-l ${cardBorder} flex flex-col`}
              >
                <div className={`p-4 border-b ${cardBorder} flex items-center justify-between`}>
                  <h3 className={`font-semibold ${textPrimary}`}>{t.groupStudy.chat}</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className={`p-1 rounded-lg ${theme === "dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-100"}`}
                  >
                    <X className={`w-4 h-4 ${textSecondary}`} />
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {demoChatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-neutral-700" : "bg-neutral-200"} flex items-center justify-center text-sm font-medium ${textPrimary}`}>
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${textPrimary}`}>{msg.user}</span>
                          <span className={`text-xs ${textSecondary}`}>{msg.time}</span>
                        </div>
                        <p className={`text-sm ${textSecondary}`}>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 border-t ${cardBorder}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className={`flex-1 px-4 py-2 rounded-xl ${inputBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                    />
                    <button className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-colors">
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Bar */}
        <div className={`${cardBg} border-t ${cardBorder} px-6 py-4`}>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full ${isMuted ? "bg-red-500" : theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} transition-colors`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className={`w-6 h-6 ${textPrimary}`} />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full ${!isVideoOn ? "bg-red-500" : theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} transition-colors`}
            >
              {isVideoOn ? (
                <Video className={`w-6 h-6 ${textPrimary}`} />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-full ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} transition-colors`}
            >
              <ScreenShare className={`w-6 h-6 ${textPrimary}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full ${showChat ? "bg-cyan-500" : theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} transition-colors`}
            >
              <MessageSquare className={`w-6 h-6 ${showChat ? "text-white" : textPrimary}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowParticipants(!showParticipants)}
              className={`p-4 rounded-full ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-200"} transition-colors`}
            >
              <Users className={`w-6 h-6 ${textPrimary}`} />
            </motion.button>

            <div className="w-px h-10 bg-neutral-700 mx-2" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsInRoom(false)}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <Phone className="w-6 h-6 text-white rotate-[135deg]" />
            </motion.button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
