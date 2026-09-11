import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Mail, TrendingUp, Trash2, Eye } from 'lucide-react'
import { accuracyColor } from '../../utils/helpers'

const MOCK_STUDENTS = [
  { id:'1', name:'Rahul Sharma',   email:'rahul@example.com',   accuracy:88, games:12, xp:950, streak:7,  classroom:'OS' },
  { id:'2', name:'Priya Patel',    email:'priya@example.com',   accuracy:85, games:10, xp:900, streak:5,  classroom:'CN' },
  { id:'3', name:'Sneha Kulkarni', email:'sneha@example.com',   accuracy:79, games:9,  xp:820, streak:3,  classroom:'OS' },
  { id:'4', name:'Amit Kumar',     email:'amit@example.com',    accuracy:72, games:8,  xp:760, streak:1,  classroom:'DBMS' },
  { id:'5', name:'Neha Verma',     email:'neha@example.com',    accuracy:65, games:7,  xp:680, streak:0,  classroom:'CN' },
  { id:'6', name:'Rohan Joshi',    email:'rohan@example.com',   accuracy:58, games:6,  xp:580, streak:2,  classroom:'DBMS' },
]

export default function Students() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Students</h1>
        <p className="text-slate-400 text-sm mt-1">{MOCK_STUDENTS.length} students across your classrooms</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="input-field pl-10 text-sm" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Student','Classroom','Accuracy','Games','XP','Streak','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                           className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                           style={{ background:'rgba(99,102,241,0.2)' }}>{s.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge badge-primary text-[11px]">{s.classroom}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-bold" style={{ color:accuracyColor(s.accuracy) }}>{s.accuracy}%</span></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{s.games}</td>
                  <td className="px-4 py-3 text-sm text-amber-400 font-semibold">{s.xp}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{s.streak > 0 ? `${s.streak}🔥` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all"><Eye size={14} /></button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
