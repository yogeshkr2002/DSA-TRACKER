import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Check,
  Terminal,
  Code2,
  Zap,
  Target,
  TrendingUp,
  Edit2,
  X,
  Flame,
  Trophy,
  Star,
  Award,
  Search,
  ArrowUpDown,
} from "lucide-react";

export default function DSATracker() {
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem("dsa-sections");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Arrays",
            expanded: true,
            problems: [
              {
                id: 1,
                title: "Two Sum",
                link: "https://leetcode.com/problems/two-sum/",
                completed: false,
                difficulty: "Easy",
              },
            ],
          },
        ];
  });

  const [newSectionName, setNewSectionName] = useState("");
  const [newProblem, setNewProblem] = useState({});
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [particles, setParticles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: "",
    id: null,
    sectionId: null,
  });
  const [editModal, setEditModal] = useState({
    show: false,
    sectionId: null,
    problemId: null,
    title: "",
    link: "",
    difficulty: "Medium",
  });
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQueries, setSearchQueries] = useState({});
  const [sortOrders, setSortOrders] = useState({});

  useEffect(() => {
    localStorage.setItem("dsa-sections", JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    const total = sections.reduce((acc, s) => acc + s.problems.length, 0);
    const completed = sections.reduce(
      (acc, s) => acc + s.problems.filter((p) => p.completed).length,
      0
    );
    setStats({ total, completed });

    const completedToday = localStorage.getItem("completed-today");
    const today = new Date().toDateString();
    if (completedToday === today) {
      const currentStreak = parseInt(localStorage.getItem("streak") || "0");
      setStreak(currentStreak);
    }
  }, [sections]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  const addSection = () => {
    if (newSectionName.trim()) {
      setSections([
        ...sections,
        {
          id: Date.now(),
          name: newSectionName,
          expanded: true,
          problems: [],
        },
      ]);
      setNewSectionName("");
    }
  };

  const toggleSection = (sectionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, expanded: !s.expanded } : s
      )
    );
  };

  const addProblem = (sectionId) => {
    const problem = newProblem[sectionId];
    if (problem?.title?.trim()) {
      setSections(
        sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                problems: [
                  ...s.problems,
                  {
                    id: Date.now(),
                    title: problem.title,
                    link: problem.link || "",
                    difficulty: problem.difficulty || "Medium",
                    completed: false,
                  },
                ],
              }
            : s
        )
      );
      setNewProblem({
        ...newProblem,
        [sectionId]: { title: "", link: "", difficulty: "Medium" },
      });
    }
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    setDeleteModal({ show: false, type: "", id: null, sectionId: null });
  };

  const deleteProblem = (sectionId, problemId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, problems: s.problems.filter((p) => p.id !== problemId) }
          : s
      )
    );
    setDeleteModal({ show: false, type: "", id: null, sectionId: null });
  };

  const confirmDelete = () => {
    if (deleteModal.type === "section") {
      deleteSection(deleteModal.id);
    } else if (deleteModal.type === "problem") {
      deleteProblem(deleteModal.sectionId, deleteModal.id);
    }
  };

  const openEditModal = (sectionId, problemId) => {
    const section = sections.find((s) => s.id === sectionId);
    const problem = section?.problems.find((p) => p.id === problemId);
    if (problem) {
      setEditModal({
        show: true,
        sectionId,
        problemId,
        title: problem.title,
        link: problem.link,
        difficulty: problem.difficulty || "Medium",
      });
    }
  };

  const saveEdit = () => {
    setSections(
      sections.map((s) =>
        s.id === editModal.sectionId
          ? {
              ...s,
              problems: s.problems.map((p) =>
                p.id === editModal.problemId
                  ? {
                      ...p,
                      title: editModal.title,
                      link: editModal.link,
                      difficulty: editModal.difficulty,
                    }
                  : p
              ),
            }
          : s
      )
    );
    setEditModal({
      show: false,
      sectionId: null,
      problemId: null,
      title: "",
      link: "",
      difficulty: "Medium",
    });
  };

  const toggleProblem = (sectionId, problemId) => {
    const section = sections.find((s) => s.id === sectionId);
    const problem = section?.problems.find((p) => p.id === problemId);

    if (problem && !problem.completed) {
      const today = new Date().toDateString();
      const completedToday = localStorage.getItem("completed-today");
      if (completedToday !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("streak", newStreak.toString());
        localStorage.setItem("completed-today", today);
      }

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              problems: s.problems.map((p) =>
                p.id === problemId ? { ...p, completed: !p.completed } : p
              ),
            }
          : s
      )
    );
  };

  const updateNewProblem = (sectionId, field, value) => {
    setNewProblem({
      ...newProblem,
      [sectionId]: { ...newProblem[sectionId], [field]: value },
    });
  };

  const toggleSort = (sectionId) => {
    const currentOrder = sortOrders[sectionId] || "original";
    const nextOrder = currentOrder === "original" ? "difficulty" : "original";
    setSortOrders({ ...sortOrders, [sectionId]: nextOrder });
  };

  const getFilteredAndSortedProblems = (sectionId, problems) => {
    const query = searchQueries[sectionId]?.toLowerCase() || "";
    let filtered = problems.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    const sortOrder = sortOrders[sectionId] || "original";
    if (sortOrder === "difficulty") {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered = [...filtered].sort((a, b) => {
        const orderA = difficultyOrder[a.difficulty] || 2;
        const orderB = difficultyOrder[b.difficulty] || 2;
        return orderA - orderB;
      });
    }

    return filtered;
  };

  const percentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getLevel = () => {
    const completed = stats.completed;
    if (completed >= 500)
      return {
        name: "FAANG LEGEND",
        color: "from-yellow-400 to-orange-500",
        icon: Trophy,
      };
    if (completed >= 300)
      return {
        name: "SENIOR ENGINEER",
        color: "from-purple-400 to-pink-500",
        icon: Award,
      };
    if (completed >= 150)
      return {
        name: "MID-LEVEL PRO",
        color: "from-cyan-400 to-blue-500",
        icon: Star,
      };
    if (completed >= 50)
      return {
        name: "JUNIOR DEV",
        color: "from-green-400 to-cyan-500",
        icon: Zap,
      };
    return {
      name: "BEGINNER",
      color: "from-gray-400 to-gray-500",
      icon: Code2,
    };
  };

  const level = getLevel();
  const LevelIcon = level.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-green-500 font-mono text-xs"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `matrix-fall ${particle.duration}s linear ${particle.delay}s infinite`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                animation: `confetti-fall ${
                  1 + Math.random()
                }s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {["🔥", "⚡", "💪", "🚀", "⭐"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes confetti-fall {
          to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.8), 0 0 60px rgba(139, 92, 246, 0.5); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .glow-effect {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        .gradient-border {
          background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b);
          padding: 3px;
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-950 to-black border-2 border-red-500 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-red-500/50 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full border border-red-500">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-400 font-mono">
                ⚠️ DANGER ZONE
              </h3>
            </div>
            <p className="text-gray-300 mb-6 font-mono text-sm">
              Delete this {deleteModal.type}? This action is{" "}
              <span className="text-red-400 font-bold">IRREVERSIBLE</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    show: false,
                    type: "",
                    id: null,
                    sectionId: null,
                  })
                }
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition font-mono font-bold border border-gray-600"
              >
                ABORT
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-lg transition font-mono font-bold shadow-lg shadow-red-500/50"
              >
                DESTROY
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-950 to-black border-2 border-purple-500 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-purple-500/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-full border border-purple-500">
                  <Edit2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400 font-mono">
                  MODIFY CHALLENGE
                </h3>
              </div>
              <button
                onClick={() =>
                  setEditModal({
                    show: false,
                    sectionId: null,
                    problemId: null,
                    title: "",
                    link: "",
                    difficulty: "Medium",
                  })
                }
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-purple-300 text-sm font-mono mb-2 block">
                  PROBLEM TITLE
                </label>
                <input
                  type="text"
                  value={editModal.title}
                  onChange={(e) =>
                    setEditModal({ ...editModal, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-purple-300 text-sm font-mono mb-2 block">
                  LEETCODE LINK
                </label>
                <input
                  type="url"
                  value={editModal.link}
                  onChange={(e) =>
                    setEditModal({ ...editModal, link: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-purple-300 text-sm font-mono mb-2 block">
                  DIFFICULTY
                </label>
                <select
                  value={editModal.difficulty}
                  onChange={(e) =>
                    setEditModal({ ...editModal, difficulty: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setEditModal({
                    show: false,
                    sectionId: null,
                    problemId: null,
                    title: "",
                    link: "",
                    difficulty: "Medium",
                  })
                }
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition font-mono font-bold border border-gray-600"
              >
                CANCEL
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-3 rounded-lg transition font-mono font-bold shadow-lg shadow-purple-500/50"
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <div className="inline-block mb-4">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${level.color} shadow-2xl pulse-animation`}
              >
                <LevelIcon className="w-6 h-6 text-black" />
                <span className="text-black font-bold font-mono text-lg">
                  {level.name}
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DSA TRACKER
            </h1>
            <p className="text-cyan-400 font-mono text-sm sm:text-base mb-4">
              <Terminal className="inline w-4 h-4 mr-2" />
              Level Up Your Coding Game
            </p>
            {streak > 0 && (
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500 rounded-full px-4 py-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-orange-400 font-bold font-mono">
                  {streak} DAY STREAK
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-900/50 to-black border-2 border-cyan-500 rounded-xl p-4 backdrop-blur-sm transform hover:scale-105 transition-transform glow-effect">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-xs sm:text-sm font-mono font-bold">
                    PROBLEMS
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-cyan-400">
                    {stats.total}
                  </p>
                </div>
                <Code2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-black border-2 border-green-500 rounded-xl p-4 backdrop-blur-sm transform hover:scale-105 transition-transform glow-effect">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-xs sm:text-sm font-mono font-bold">
                    CRUSHED
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-green-400">
                    {stats.completed}
                  </p>
                </div>
                <Check className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-black border-2 border-purple-500 rounded-xl p-4 backdrop-blur-sm transform hover:scale-105 transition-transform glow-effect">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-xs sm:text-sm font-mono font-bold">
                    MASTERY
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-purple-400">
                    {percentage}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/50 to-black border-2 border-orange-500 rounded-xl p-4 backdrop-blur-sm transform hover:scale-105 transition-transform glow-effect">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-xs sm:text-sm font-mono font-bold">
                    REMAINING
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-orange-400">
                    {stats.total - stats.completed}
                  </p>
                </div>
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/70 border-2 border-cyan-500 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-cyan-400 font-mono font-bold text-sm sm:text-base">
                POWER LEVEL
              </span>
              <span className="text-cyan-400 font-mono font-bold text-lg sm:text-xl">
                {percentage}%
              </span>
            </div>
            <div className="relative w-full bg-gray-900 rounded-full h-4 sm:h-6 overflow-hidden border-2 border-cyan-500/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 relative overflow-hidden"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="gradient-border rounded-xl mb-6 animate-slide-up">
          <div className="bg-black p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-4 font-mono flex items-center gap-2">
              <Zap className="w-5 h-5" />
              UNLOCK NEW DOMAIN
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSection()}
                placeholder="► Enter topic (e.g., Dynamic Programming)"
                className="flex-1 px-4 py-3 bg-gray-900/90 border-2 border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 text-white font-mono text-sm sm:text-base"
              />
              <button
                onClick={addSection}
                className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 transition flex items-center justify-center gap-2 font-mono font-bold shadow-2xl shadow-purple-500/50 transform hover:scale-105"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">INITIALIZE</span>
                <span className="sm:hidden">ADD</span>
              </button>
            </div>
          </div>
        </div>

        {sections.map((section) => {
          const completed = section.problems.filter((p) => p.completed).length;
          const total = section.problems.length;
          const sectionPercentage =
            total > 0 ? Math.round((completed / total) * 100) : 0;
          const filteredProblems = getFilteredAndSortedProblems(
            section.id,
            section.problems
          );
          const sortOrder = sortOrders[section.id] || "original";

          return (
            <div key={section.id} className="mb-6 animate-slide-up">
              <div className="gradient-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="text-cyan-400 hover:text-cyan-300 transition transform hover:scale-110 flex-shrink-0"
                      >
                        <Code2 size={28} className="sm:w-8 sm:h-8" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent font-mono truncate">
                          {section.name.toUpperCase()}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                          <p className="text-cyan-300 text-xs sm:text-sm font-mono font-bold whitespace-nowrap">
                            [{completed}/{total}] • {sectionPercentage}%
                            COMPLETE
                          </p>
                          <div className="flex-1 max-w-xs bg-black/50 rounded-full h-2 sm:h-3 overflow-hidden border border-cyan-500/30">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${sectionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          show: true,
                          type: "section",
                          id: section.id,
                          sectionId: null,
                        })
                      }
                      className="text-red-500 hover:text-red-400 transition p-2 hover:bg-red-500/20 rounded-lg flex-shrink-0 transform hover:scale-110"
                    >
                      <Trash2 size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                {section.expanded && (
                  <div className="bg-black/90 backdrop-blur-sm p-4 sm:p-5 border-t-2 border-purple-500/30">
                    <div className="mb-5 p-4 bg-cyan-500/10 border-2 border-cyan-500 rounded-xl">
                      <h4 className="text-cyan-400 font-mono font-bold mb-3 text-sm flex items-center gap-2">
                        <Search size={16} />
                        SEARCH & FILTER
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={searchQueries[section.id] || ""}
                          onChange={(e) =>
                            setSearchQueries({
                              ...searchQueries,
                              [section.id]: e.target.value,
                            })
                          }
                          placeholder="Type to search problems..."
                          className="flex-1 px-4 py-3 bg-black border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-400 text-white font-mono text-sm"
                        />
                        <button
                          onClick={() => toggleSort(section.id)}
                          className={`px-6 py-3 rounded-lg font-mono font-bold text-sm flex items-center justify-center gap-2 transition whitespace-nowrap min-w-[140px] ${
                            sortOrder === "difficulty"
                              ? "bg-cyan-500 text-black"
                              : "bg-gray-700 text-cyan-400 border-2 border-cyan-500"
                          }`}
                        >
                          <ArrowUpDown size={18} />
                          {sortOrder === "difficulty" ? "SORTED" : "SORT"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-5 p-4 bg-purple-900/20 border-2 border-purple-500/50 rounded-xl">
                      <h4 className="font-bold text-purple-400 mb-3 font-mono flex items-center gap-2 text-sm sm:text-base">
                        <Plus size={18} />
                        DEPLOY NEW CHALLENGE
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newProblem[section.id]?.title || ""}
                          onChange={(e) =>
                            updateNewProblem(
                              section.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="► Problem name"
                          className="w-full px-4 py-3 bg-black/70 border-2 border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono text-sm sm:text-base"
                        />
                        <input
                          type="url"
                          value={newProblem[section.id]?.link || ""}
                          onChange={(e) =>
                            updateNewProblem(section.id, "link", e.target.value)
                          }
                          placeholder="► https://leetcode.com/..."
                          className="w-full px-4 py-3 bg-black/70 border-2 border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono text-sm sm:text-base"
                        />
                        <select
                          value={newProblem[section.id]?.difficulty || "Medium"}
                          onChange={(e) =>
                            updateNewProblem(
                              section.id,
                              "difficulty",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 bg-black/70 border-2 border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white font-mono text-sm sm:text-base"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <button
                          onClick={() => addProblem(section.id)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition flex items-center justify-center gap-2 font-mono font-bold shadow-lg shadow-purple-500/50 transform hover:scale-105"
                        >
                          <Plus size={20} />
                          LAUNCH CHALLENGE
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      {section.problems.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 font-mono text-sm">
                          [ QUEUE EMPTY ] → Deploy your first challenge
                        </p>
                      ) : filteredProblems.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 font-mono text-sm">
                          [ NO RESULTS ] → No problems match your search
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {filteredProblems.map((problem) => (
                            <div
                              key={problem.id}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                                problem.completed
                                  ? "bg-green-900/30 border-green-500 shadow-lg shadow-green-500/20"
                                  : "bg-gray-900/50 border-cyan-500/50 hover:border-cyan-500"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  toggleProblem(section.id, problem.id)
                                }
                                className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center transition-all font-bold transform hover:scale-110 ${
                                  problem.completed
                                    ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50"
                                    : "border-cyan-500 hover:bg-cyan-500/30"
                                }`}
                              >
                                {problem.completed && (
                                  <Check
                                    size={20}
                                    className="text-black font-bold"
                                  />
                                )}
                              </button>

                              <span
                                className={`flex-1 font-mono font-bold text-sm sm:text-base break-words ${
                                  problem.completed
                                    ? "text-green-400"
                                    : "text-cyan-100"
                                }`}
                              >
                                {problem.title}
                              </span>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${
                                    problem.difficulty === "Easy"
                                      ? "bg-green-500/20 text-green-400 border border-green-500"
                                      : problem.difficulty === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500"
                                      : "bg-red-500/20 text-red-400 border border-red-500"
                                  }`}
                                >
                                  {problem.difficulty?.toUpperCase() ||
                                    "MEDIUM"}
                                </span>

                                {problem.link && (
                                  <a
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-3 py-2 rounded-lg transition font-mono text-xs sm:text-sm font-bold shadow-lg transform hover:scale-105"
                                    title="Launch Problem"
                                  >
                                    <span className="hidden sm:inline">
                                      SOLVE
                                    </span>
                                    <span className="sm:hidden">GO</span>
                                  </a>
                                )}

                                <button
                                  onClick={() =>
                                    openEditModal(section.id, problem.id)
                                  }
                                  className="text-purple-400 hover:text-purple-300 transition p-2 hover:bg-purple-500/20 rounded-lg transform hover:scale-110"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      show: true,
                                      type: "problem",
                                      id: problem.id,
                                      sectionId: section.id,
                                    })
                                  }
                                  className="text-red-500 hover:text-red-400 transition p-2 hover:bg-red-500/20 rounded-lg transform hover:scale-110"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sections.length === 0 && (
          <div className="gradient-border rounded-xl">
            <div className="bg-black p-12 text-center">
              <Terminal className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg font-mono font-bold">
                [ SYSTEM ARMED ] → Initialize your first domain
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
