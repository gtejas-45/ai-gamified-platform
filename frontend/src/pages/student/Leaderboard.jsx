import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Users, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const LEADERBOARD_DATA = {
  overall: [
    { rank:1,  name:'Rahul Sharma',   xp:2450, accuracy:88, games:48, avatar:'R', color:'#f59e0b' },
    { rank:2,  name:'Priya Patel',    xp:2200, accuracy:85, games:42, avatar:'P', color:'#8b5cf6' },
    { rank:3,  name:'Tejas Gaikwad',  xp:1950, accuracy:82, games:38, avatar:'T', color:'#6366f1', isYou:true },
    { rank:4,  name:'Amit Kumar',     xp:1800, accuracy:79, games:35, avatar:'A', color:'#06b6d4' },
    { rank:5,  name:'Sneha Singh',    xp:1650, accuracy:76, games:32, avatar:'S', color:'#10b981' },
    { rank:6,  name:'Rohan Joshi',    xp:1500, accuracy:73, games:30, avatar:'R', color:'#ef4444' },
    { rank:7,  name:'Kavya Rao',      xp:1350, accuracy:71, games:28, avatar:'K', color:'#f59e0b' },
    { rank:8,  name:'Dev Mehta',      xp:1200, accuracy:68, games:25, avatar:'D', color:'#8b5cf6' },
    { rank:9,  name:'Neha Verma',     xp:1050, accuracy:65, games:22, avatar:'N', color:'#6366f1' },
    { rank:10, name:'Arun Nair',      xp: 900, accuracy:62, games:18, avatar:'A', color:'#06b6d4' },
  ],
  weekly: [
    { rank:1, name:'Priya Patel',    xp:450, accuracy:90, games:9,  avatar:'P', color:'#8b5cf6' },
    { rank:2, name:'Tejas Gaikwad',  xp:400, accuracy:85, games:8,  avatar:'T', color:'#6366f1', isYou:true },
    { rank:3, name:'Rahul Sharma',   xp:350, accuracy:80, games:7,  avatar:'R', color:'#f59e0b' },
    { rank:4, name:'Sneha Singh',    xp:300, accuracy:75, games:6,  avatar:'S', color:'#10b981' },
    { rank:5, name:'Amit Kumar',     xp:250, accuracy:70, games:5,  avatar:'A', color:'#06b6d4' },
  ],
}

function RankMedal({ rank }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>
  if (rank === 2) return <span className="text-2xl">🥈</span>
  if (rank === 3) return <span className="text-2xl">🥉</span>
  return <span className="w-8 text-center text-sm font-bold text-slate-500">#{rank}</span>
}

export default function Leaderboard() {
  const [tab, setTab] = useState('overall')
  const data = LEADERBOARD_DATA[tab] ?? LEADERBOARD_DATA.overall
  const myEntry = data.find(e => e.isYou)

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-white">🏆 Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-1">Compete with your classmates and rise to the top</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {[{ key:'overall', label:'Overall' }, { key:'weekly', label:'This Week' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{ background: tab === t.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: tab === t.key ? 'white' : '#64748b' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4">
        {[data[1], data[0], data[2]].filter(Boolean).map((entry, i) => {
          const heights  = ['h-28', 'h-36', 'h-24']
          const podiumBg = ['rgba(148,163,184,0.1)', 'rgba(245,158,11,0.12)', 'rgba(180,120,60,0.1)']
          return (
            <div key={entry.rank} className={`flex flex-col items-center ${i === 1 ? '-mt-4' : ''}`}>
              {i === 1 && <Trophy size={24} className="text-amber-400 mb-2" />}
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ring-4 mb-2"
                   style={{ background: entry.color, ringColor: entry.isYou ? '#6366f1' : 'transparent', boxShadow: `0 0 20px ${entry.color}50` }}>
                {entry.avatar}
              </div>
              <p className="text-xs font-bold text-white text-center">{entry.name.split(' ')[0]}</p>
              <p className="text-xs text-amber-400">{entry.xp} XP</p>
              <div className={`${heights[i]} w-20 rounded-t-xl mt-2 flex items-end justify-center pb-2`}
                   style={{ background: podiumBg[i], border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-2xl">{['🥈','🥇','🥉'][i]}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Your position banner */}
      {myEntry && (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <p className="text-sm text-indigo-300 text-center font-medium">
            🎯 You are ranked <strong>#{myEntry.rank}</strong> with <strong>{myEntry.xp} XP</strong> — keep playing to climb higher!
          </p>
        </div>
      )}

      {/* Full list */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-4 text-xs text-slate-600 px-5 py-3 border-b border-white/[0.06] font-semibold uppercase tracking-wider">
          <span>Rank</span><span>Student</span><span className="text-center">Accuracy</span><span className="text-right">XP</span>
        </div>
        <div>
          {data.map((entry, i) => (
            <motion.div key={entry.rank}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`leaderboard-row grid grid-cols-4 items-center ${entry.rank === 1 ? 'rank-1' : entry.rank === 2 ? 'rank-2' : entry.rank === 3 ? 'rank-3' : ''} ${entry.isYou ? '!bg-indigo-500/10 !border-indigo-500/20 border' : ''}`}
            >
              <div className="flex items-center"><RankMedal rank={entry.rank} /></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background: entry.color }}>
                  {entry.avatar}
                </div>
                <div>
                  <p className={`text-sm font-medium ${entry.isYou ? 'text-indigo-300' : 'text-white'}`}>
                    {entry.isYou ? 'You' : entry.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-600">{entry.games} games</p>
                </div>
              </div>
              <p className="text-center text-sm font-semibold" style={{ color: entry.accuracy >= 80 ? '#10b981' : entry.accuracy >= 60 ? '#f59e0b' : '#ef4444' }}>
                {entry.accuracy}%
              </p>
              <p className="text-right text-sm font-bold text-amber-400">{entry.xp}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
