import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { Save, User, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TeacherProfile() {
  const { userProfile } = useAuth()
  const [name, setName] = useState(userProfile?.name ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Profile updated!')
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white">Teacher Profile</h1>

      <div className="card p-6 flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
             style={{ background:'linear-gradient(135deg,#06b6d4,#6366f1)', boxShadow:'0 0 40px rgba(6,182,212,0.4)' }}>
          {(userProfile?.name?.[0] ?? 'T').toUpperCase()}
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{userProfile?.name ?? 'Teacher'}</p>
          <p className="text-sm text-slate-500">{userProfile?.email}</p>
          <span className="badge badge-cyan mt-2">👨‍🏫 Teacher</span>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
            <div className="relative"><User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={name} onChange={e=>setName(e.target.value)} className="input-field pl-10" /></div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={userProfile?.email ?? ''} disabled className="input-field pl-10 opacity-50" /></div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary gap-2" style={{ justifyContent:'center' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label:'Students', value:'95' },{ label:'Materials', value:'26' },{ label:'Games Created', value:'14' }].map(s=>(
          <div key={s.label} className="stat-card p-4 text-center">
            <p className="text-2xl font-extrabold text-indigo-400">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
