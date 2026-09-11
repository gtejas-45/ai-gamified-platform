import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react'
import { GAME_TYPES } from '../../utils/constants'
import { accuracyColor, formatRelativeTime } from '../../utils/helpers'

const MOCK_GAMES = [
  { id: '1', title: 'OS CPU Scheduling Quiz',    type: 'quiz',         difficulty: 'medium', score: 80, accuracy: 80, time: 240, date: new Date(Date.now()-3600000),    questions: 10 },
  { id: '2', title: 'Java OOP Memory Match',     type: 'memory_match', difficulty: 'easy',   score: 90, accuracy: 90, time: 180, date: new Date(Date.now()-86400000),   questions: 8  },
  { id: '3', title: 'DBMS Normalization Drag',   type: 'drag_drop',    difficulty: 'hard',   score: 60, accuracy: 60, time: 360, date: new Date(Date.now()-172800000),  questions: 12 },
  { id: '4', title: 'Networks OSI Sequence',     type: 'sequence',     difficulty: 'medium', score: 75, accuracy: 75, time: 200, date: new Date(Date.now()-259200000),  questions: 6  },
  { id: '5', title: 'SQL Queries Quiz',          type: 'quiz',         difficulty: 'medium', score: 85, accuracy: 85, time: 290, date: new Date(Date.now()-345600000),  questions: 10 },
  { id: '6', title: 'OS Process States Sequence',type: 'sequence',     difficulty: 'easy',   score: 100,accuracy:100, time: 120, date: new Date(Date.now()-432000000),  questions: 5  },
]

const difficultyColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }

export default function GamesList() {
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')

  const filtered = MOCK_GAMES.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || g.type === filter
    return matchSearch && matchFilter
  })

  function getGameRoute(type) {
    const routes = { quiz:'quiz', memory_match:'memory', sequence:'sequence', drag_drop:'drag' }
    return routes[type] ?? 'quiz'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Games</h1>
        <p className="text-slate-400 text-sm mt-1">{MOCK_GAMES.length} games played</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search games…" className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ value:'all', label:'All' }, ...GAME_TYPES.map(g => ({ value: g.id, label: g.name }))].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{ background: filter === f.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: filter === f.value ? '#818cf8' : '#64748b', border: `1px solid ${filter === f.value ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((game, i) => {
          const gameInfo = GAME_TYPES.find(g => g.id === game.type) ?? GAME_TYPES[0]
          return (
            <motion.div key={game.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                     style={{ background: `${gameInfo.color}20`, border: `1px solid ${gameInfo.color}30` }}>
                  {gameInfo.emoji}
                </div>
                <span className="badge text-[11px]"
                      style={{ background: `${difficultyColor[game.difficulty]}15`, color: difficultyColor[game.difficulty], border: `1px solid ${difficultyColor[game.difficulty]}30` }}>
                  {game.difficulty}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{game.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{gameInfo.name} · {game.questions} questions · {formatRelativeTime(game.date)}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-base font-bold" style={{ color: accuracyColor(game.score) }}>{game.score}%</p>
                  <p className="text-[10px] text-slate-600">Score</p>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-base font-bold text-slate-300">
                    {Math.floor(game.time / 60)}:{(game.time % 60).toString().padStart(2,'0')}
                  </p>
                  <p className="text-[10px] text-slate-600">Time</p>
                </div>
              </div>

              <Link to={`/game/${getGameRoute(game.type)}/replay-${game.id}`}
                    className="btn-primary w-full gap-2 py-2 text-sm no-underline" style={{ justifyContent: 'center' }}>
                Play Again
              </Link>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Gamepad2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No games found</p>
            <Link to="/student/generate" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 block">
              Generate your first game →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
