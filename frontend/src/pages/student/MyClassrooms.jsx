import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Copy, Check, BookOpen, ChevronRight, Search, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_CLASSROOMS = [
  { id: '1', name: 'Computer Networks', teacher: 'Prof. Sharma',   code: 'CN2024', students: 32, materials: 8,  color: '#6366f1' },
  { id: '2', name: 'Operating Systems',  teacher: 'Prof. Patel',    code: 'OS2024', students: 28, materials: 12, color: '#06b6d4' },
  { id: '3', name: 'DBMS',              teacher: 'Prof. Kulkarni',  code: 'DB2024', students: 35, materials: 6,  color: '#10b981' },
]

export default function MyClassrooms() {
  const [joinCode,   setJoinCode]   = useState('')
  const [showJoin,   setShowJoin]   = useState(false)
  const [copiedId,   setCopiedId]   = useState(null)
  const [search,     setSearch]     = useState('')
  const [joining,    setJoining]    = useState(false)

  function copyCode(code, id) {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success('Code copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success(`Joined classroom! Welcome 🎉`)
    setJoining(false)
    setShowJoin(false)
    setJoinCode('')
  }

  const filtered = MOCK_CLASSROOMS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Classrooms</h1>
          <p className="text-slate-400 text-sm mt-1">Join your teacher's classroom to access study materials and games</p>
        </div>
        <button onClick={() => setShowJoin(true)} className="btn-primary gap-2 w-fit">
          <UserPlus size={16} /> Join Classroom
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search classrooms…" className="input-field pl-10 text-sm" />
      </div>

      {/* Classrooms grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cls, i) => (
          <motion.div key={cls.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="card p-5 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: `${cls.color}20`, border: `1px solid ${cls.color}30` }}>
              <BookOpen size={22} style={{ color: cls.color }} />
            </div>
            <h3 className="font-bold text-white mb-1">{cls.name}</h3>
            <p className="text-sm text-slate-500 mb-3">👨‍🏫 {cls.teacher}</p>
            <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
              <span>👥 {cls.students} students</span>
              <span>📄 {cls.materials} materials</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{cls.code}</span>
                <button onClick={() => copyCode(cls.code, cls.id)} className="text-slate-500 hover:text-white transition-colors">
                  {copiedId === cls.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Open <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No classrooms found</p>
          </div>
        )}
      </div>

      {/* Join classroom modal */}
      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
             style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Join a Classroom</h3>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Classroom Code</label>
                <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                       placeholder="e.g. CN2024" className="input-field font-mono tracking-widest text-center text-lg" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJoin(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={joining} className="btn-primary flex-1 gap-2" style={{ justifyContent: 'center' }}>
                  {joining ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                  {joining ? 'Joining…' : 'Join'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
