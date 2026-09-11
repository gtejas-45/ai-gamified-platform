import { motion } from 'framer-motion'
import { Users, BookOpen, Gamepad2, BarChart2, Shield, Activity } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label:'Total Users',     value:'142', icon:Users,    color:'#6366f1' },
          { label:'Teachers',        value:'12',  icon:Shield,   color:'#8b5cf6' },
          { label:'Students',        value:'130', icon:Users,    color:'#06b6d4' },
          { label:'Classrooms',      value:'15',  icon:BookOpen, color:'#10b981' },
          { label:'Games Played',    value:'720', icon:Gamepad2, color:'#f59e0b' },
          { label:'Questions Gen',   value:'1.2K',icon:BarChart2,color:'#ef4444' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                        className="stat-card text-center p-4">
              <Icon size={20} style={{ color:s.color }} className="mx-auto mb-2" />
              <p className="text-xl font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity size={20} className="text-green-400" />
          <h3 className="font-bold text-white">System Status</h3>
          <span className="badge badge-success ml-auto">All Systems Operational</span>
        </div>
        <div className="space-y-3">
          {[
            { service:'Firebase Auth',   status:'✅ Online' },
            { service:'Firestore DB',    status:'✅ Online' },
            { service:'Flask API',       status:'⚠️ Not Connected (setup required)' },
            { service:'Gemini AI',       status:'⚠️ API Key Required'               },
          ].map(s => (
            <div key={s.service} className="flex items-center justify-between p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
              <span className="text-sm text-slate-300">{s.service}</span>
              <span className="text-xs text-slate-400">{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
