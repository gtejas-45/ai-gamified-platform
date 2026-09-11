import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Plus, Users, Clock, BarChart2 } from 'lucide-react'
import { GAME_TYPES } from '../../utils/constants'
import { formatRelativeTime } from '../../utils/helpers'

const MOCK_GAMES = [
  { id:'1', title:'OS Quiz – Chapter 3', type:'quiz',        difficulty:'medium', students:32, attempts:28, avgScore:72, createdAt:new Date(Date.now()-86400000*2) },
  { id:'2', title:'Java OOP Flashcards', type:'memory_match',difficulty:'easy',   students:32, attempts:25, avgScore:85, createdAt:new Date(Date.now()-86400000*5) },
  { id:'3', title:'DBMS Normalization',  type:'drag_drop',   difficulty:'hard',   students:28, attempts:20, avgScore:58, createdAt:new Date(Date.now()-86400000*8) },
]

export default function TeacherGames() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Games</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and assign games to your students</p>
        </div>
        <Link to="/teacher/generate" className="btn-primary gap-2"><Plus size={16} /> Create Game</Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_GAMES.map((game, i) => {
          const info = GAME_TYPES.find(g => g.id === game.type) ?? GAME_TYPES[0]
          return (
            <motion.div key={game.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }} className="card p-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br ${info.gradient}`}>
                {info.emoji}
              </div>
              <h3 className="font-bold text-white mb-1">{game.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{info.name} · {game.difficulty}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon:Users,    v:game.students,  label:'Students' },
                  { icon:Clock,    v:game.attempts,  label:'Attempts' },
                  { icon:BarChart2,v:`${game.avgScore}%`, label:'Avg Score' },
                ].map(s=>{
                  const I=s.icon
                  return (
                    <div key={s.label} className="text-center p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.04)' }}>
                      <I size={14} className="mx-auto mb-1 text-slate-500" />
                      <p className="text-sm font-bold text-white">{s.v}</p>
                      <p className="text-[10px] text-slate-600">{s.label}</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-slate-600">{formatRelativeTime(game.createdAt)}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
