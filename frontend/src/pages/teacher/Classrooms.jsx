import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Copy, Users, BookOpen, Trash2, Check, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateClassroomCode } from '../../utils/helpers'

const MOCK_CLASSROOMS = [
  { id:'1', name:'Computer Networks', code:'CN2024', students:32, materials:8,  color:'#6366f1' },
  { id:'2', name:'Operating Systems',  code:'OS2024', students:28, materials:12, color:'#06b6d4' },
  { id:'3', name:'DBMS',              code:'DB2024', students:35, materials:6,  color:'#10b981' },
]

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS)
  const [showCreate, setShowCreate] = useState(false)
  const [newName,    setNewName]    = useState('')
  const [creating,   setCreating]   = useState(false)
  const [copiedId,   setCopiedId]   = useState(null)

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 800))
    const code = generateClassroomCode()
    setClassrooms(prev => [...prev, { id: Date.now().toString(), name: newName.trim(), code, students:0, materials:0, color:'#8b5cf6' }])
    toast.success(`Classroom created! Code: ${code}`)
    setCreating(false); setShowCreate(false); setNewName('')
  }

  function copyCode(code, id) {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success('Code copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Classrooms</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your classrooms and share codes with students</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary gap-2"><Plus size={16} /> Create Classroom</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classrooms.map((cls, i) => (
          <motion.div key={cls.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:`${cls.color}20`, border:`1px solid ${cls.color}30` }}>
                <BookOpen size={22} style={{ color:cls.color }} />
              </div>
              <button className="text-slate-600 hover:text-white transition-colors"><Settings size={16} /></button>
            </div>
            <h3 className="font-bold text-white mb-1">{cls.name}</h3>
            <div className="flex gap-3 text-xs text-slate-500 mb-4">
              <span>👥 {cls.students} students</span>
              <span>📄 {cls.materials} materials</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
              <div>
                <p className="text-[10px] text-slate-600 mb-0.5">Classroom Code</p>
                <p className="font-mono font-bold text-lg tracking-widest" style={{ color:cls.color }}>{cls.code}</p>
              </div>
              <button onClick={() => copyCode(cls.code, cls.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/10">
                {copiedId === cls.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background:'rgba(0,0,0,0.7)' }}>
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="glass-card p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Create New Classroom</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Classroom Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Computer Networks" className="input-field" required />
              </div>
              <p className="text-xs text-slate-500">A unique 6-character code will be auto-generated for students to join.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 gap-2" style={{ justifyContent:'center' }}>
                  {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
