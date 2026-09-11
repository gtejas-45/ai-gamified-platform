import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Camera, Save, Shield, Bell, Globe } from 'lucide-react'
import { getLevelFromXP, getLevelProgress } from '../../utils/helpers'
import { LANGUAGE_OPTIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function Profile() {
  const { userProfile } = useAuth()
  const [name,     setName]     = useState(userProfile?.name     ?? '')
  const [lang,     setLang]     = useState(userProfile?.language ?? 'en')
  const [saving,   setSaving]   = useState(false)

  const xp       = userProfile?.xp  ?? 0
  const level    = getLevelFromXP(xp)
  const progress = getLevelProgress(xp)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Profile updated!')
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white">Profile</h1>

      {/* Avatar + level card */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
               style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 0 40px rgba(99,102,241,0.4)' }}>
            {(userProfile?.name?.[0] ?? 'U').toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(10,15,30,0.9)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <Camera size={13} className="text-slate-400" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xl font-bold text-white">{userProfile?.name ?? 'User'}</p>
          <p className="text-sm text-slate-500">{userProfile?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg">{level.emoji}</span>
            <span className="badge badge-primary">{level.name} · Lv {level.level}</span>
            <span className="badge badge-warning">{xp} XP</span>
          </div>
          <div className="mt-3 max-w-xs mx-auto sm:mx-0">
            <div className="xp-bar"><div className="xp-bar-fill" style={{ width:`${progress}%` }} /></div>
            <p className="text-xs text-slate-600 mt-1">{progress}% to next level</p>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <div className="card p-6 space-y-5">
        <h3 className="font-bold text-white flex items-center gap-2"><User size={17} className="text-indigo-400" /> Personal Info</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input value={userProfile?.email ?? ''} disabled className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
                    className="input-field" style={{ cursor:'pointer' }}>
              {LANGUAGE_OPTIONS.map(l => (
                <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary gap-2" style={{ justifyContent:'center' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Games Played', value:'24', color:'#6366f1' },
          { label:'Day Streak',   value:'7🔥', color:'#ef4444' },
          { label:'Accuracy',     value:'78%', color:'#10b981' },
        ].map(s => (
          <div key={s.label} className="stat-card text-center p-4">
            <p className="text-2xl font-extrabold" style={{ color:s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
