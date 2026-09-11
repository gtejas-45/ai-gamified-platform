import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getLevelFromXP, getLevelProgress, calcAccuracy, accuracyColor, formatRelativeTime } from '../../utils/helpers'
import { GAME_TYPES } from '../../utils/constants'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Zap, Flame, Trophy, Target, TrendingUp, BookOpen,
  ArrowRight, Play, AlertTriangle, Star, ChevronRight
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// ── Mock data (replace with Firestore calls in Phase 10) ─────────────────────
const MOCK_STATS = {
  xp: 850, level: 4, streak: 7, gamesCompleted: 24,
  accuracy: 78, avgScore: 74, totalQuestions: 240, correctAnswers: 187,
  leaderboardRank: 3,
}
const MOCK_WEAK_TOPICS = [
  { topic: 'Operating System', accuracy: 45 },
  { topic: 'DBMS',             accuracy: 50 },
]
const MOCK_RECENT_GAMES = [
  { id: '1', title: 'Java OOP Quiz',      type: 'quiz',   score: 90, accuracy: 90, date: new Date(Date.now() - 3600000) },
  { id: '2', title: 'SQL Challenge',      type: 'quiz',   score: 75, accuracy: 75, date: new Date(Date.now() - 86400000) },
  { id: '3', title: 'OS Memory Match',    type: 'memory_match', score: 60, accuracy: 60, date: new Date(Date.now() - 172800000) },
  { id: '4', title: 'Network Sequence',   type: 'sequence',     score: 80, accuracy: 80, date: new Date(Date.now() - 259200000) },
]
const MOCK_CHART = [
  { day: 'Mon', score: 65 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 68 },
  { day: 'Thu', score: 80 }, { day: 'Fri', score: 74 }, { day: 'Sat', score: 85 }, { day: 'Sun', score: 78 },
]
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Rahul Sharma', xp: 950, avatar: 'R' },
  { rank: 2, name: 'Priya Patel',  xp: 920, avatar: 'P' },
  { rank: 3, name: 'You',          xp: 850, avatar: 'Y', isYou: true },
  { rank: 4, name: 'Amit Kumar',   xp: 820, avatar: 'A' },
  { rank: 5, name: 'Sneha Singh',  xp: 790, avatar: 'S' },
]

function StatCard({ icon: Icon, label, value, subLabel, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y:  0 }}
      transition={{ delay, duration: 0.5 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 text-sm">
      <p className="text-slate-400">{label}</p>
      <p className="text-indigo-400 font-bold">{payload[0].value}%</p>
    </div>
  )
}

export default function StudentDashboard() {
  const { userProfile } = useAuth()
  const [loading, setLoading] = useState(false)

  const name    = userProfile?.name ?? 'Student'
  const xp      = userProfile?.xp ?? MOCK_STATS.xp
  const level   = getLevelFromXP(xp)
  const progress= getLevelProgress(xp)
  const stats   = MOCK_STATS

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{name.split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            You're ranked <span className="text-amber-400 font-semibold">#{stats.leaderboardRank}</span> in your class.
            Keep it up! 🚀
          </p>
        </div>
        <Link to="/student/generate" className="btn-primary gap-2 w-fit">
          <Play size={16} fill="currentColor" />
          Start New Game
        </Link>
      </div>

      {/* ── Level + XP Bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card p-5"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{level.emoji}</span>
            <div>
              <p className="font-bold text-white">Level {level.level} — {level.name}</p>
              <p className="text-xs text-slate-500">{xp.toLocaleString()} XP total</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Next level</p>
            <p className="text-sm font-bold text-indigo-400">{progress}%</p>
          </div>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-600 mt-2">
          {level.maxXP !== Infinity
            ? `${(level.maxXP - xp + 1).toLocaleString()} XP until Level ${level.level + 1}`
            : '🏆 Maximum Level Reached!'}
        </p>
      </motion.div>

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap}    label="Total XP"         value={`${xp.toLocaleString()}`}    color="#f59e0b" delay={0.15} />
        <StatCard icon={Flame}  label="Day Streak"       value={`${stats.streak} 🔥`}         color="#ef4444" delay={0.20} subLabel="days" />
        <StatCard icon={Target} label="Accuracy"         value={`${stats.accuracy}%`}          color="#10b981" delay={0.25} />
        <StatCard icon={Trophy} label="Games Completed"  value={stats.gamesCompleted}           color="#8b5cf6" delay={0.30} />
      </div>

      {/* ── Main grid: Chart + Leaderboard ────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Progress Chart (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Weekly Progress</h3>
              <p className="text-xs text-slate-500">Your score over the last 7 days</p>
            </div>
            <TrendingUp size={18} className="text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0,100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Leaderboard snippet (1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Leaderboard</h3>
            <Link to="/student/leaderboard" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((entry) => (
              <div key={entry.rank}
                   className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${entry.isYou ? 'bg-indigo-500/10 border border-indigo-500/20' : ''}`}>
                <span className="w-6 text-center text-sm font-bold"
                      style={{ color: entry.rank <= 3 ? ['#f59e0b','#94a3b8','#b45309'][entry.rank-1] : '#64748b' }}>
                  {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] : `#${entry.rank}`}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background: entry.isYou ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.1)' }}>
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${entry.isYou ? 'text-indigo-300' : 'text-slate-300'}`}>
                    {entry.isYou ? 'You' : entry.name}
                  </p>
                </div>
                <span className="text-xs text-amber-400 font-semibold">{entry.xp} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Weak Topics Alert ────────────────────────────────────────── */}
      {MOCK_WEAK_TOPICS.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="card p-5"
          style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.04)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <AlertTriangle size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Weak Topics Detected 📉</p>
                <p className="text-sm text-slate-400 mb-2">These topics need revision based on your recent performance:</p>
                <div className="flex flex-wrap gap-2">
                  {MOCK_WEAK_TOPICS.map(t => (
                    <div key={t.topic} className="flex items-center gap-1.5 badge badge-warning">
                      <span>{t.topic}</span>
                      <span className="opacity-70">({t.accuracy}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/student/generate" className="btn-primary gap-2 flex-shrink-0 w-fit">
              Start Revision <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Recent Games ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Recent Games</h3>
          <Link to="/student/games" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {MOCK_RECENT_GAMES.map((game) => {
            const gameInfo = GAME_TYPES.find(g => g.id === game.type) ?? GAME_TYPES[0]
            return (
              <div key={game.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style={{ background: `${gameInfo.color}20`, border: `1px solid ${gameInfo.color}30` }}>
                  {gameInfo.emoji ?? '🎮'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{game.title}</p>
                  <p className="text-xs text-slate-500">{gameInfo.name} · {formatRelativeTime(game.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: accuracyColor(game.score) }}>
                    {game.score}%
                  </p>
                  <p className="text-xs text-slate-600">Score</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Quick Access Game Cards ───────────────────────────────────── */}
      <div>
        <h3 className="font-bold text-white mb-4">Start a Game</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAME_TYPES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ delay: 0.55 + i * 0.05, duration: 0.4 }}
            >
              <Link to="/student/generate" className="game-card block no-underline">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br ${game.gradient}`}>
                  {game.emoji}
                </div>
                <p className="font-bold text-white text-sm mb-1">{game.name}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{game.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
