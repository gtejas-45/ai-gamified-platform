import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BarChart2, Users, BookOpen, Gamepad2, TrendingUp, AlertTriangle, ChevronRight, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { accuracyColor } from '../../utils/helpers'

const TOPIC_DATA = [
  { topic:'Java OOP', avg:82 },{ topic:'SQL', avg:78 },{ topic:'Networks', avg:65 },
  { topic:'OS', avg:48 },{ topic:'DBMS', avg:52 },
]
const STUDENTS_DATA = [
  { name:'Rahul Sharma',   accuracy:88, games:12, xp:950 },
  { name:'Priya Patel',    accuracy:85, games:10, xp:900 },
  { name:'Sneha Kulkarni', accuracy:79, games:9,  xp:820 },
  { name:'Amit Kumar',     accuracy:72, games:8,  xp:760 },
  { name:'Neha Verma',     accuracy:65, games:7,  xp:680 },
]

function StatCard({ icon:Icon, label, value, color, link, delay=0 }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.5 }} className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}20`, border:`1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {link && <Link to={link} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">View <ChevronRight size={12} /></Link>}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="glass-card p-2.5 text-xs">
      <p className="text-slate-400">{label}</p>
      <p style={{ color: accuracyColor(payload[0].value) }} className="font-bold">{payload[0].value}%</p>
    </div>
  ) : null

export default function TeacherDashboard() {
  const { userProfile } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">Teacher Dashboard 👩‍🏫</p>
          <h1 className="text-3xl font-extrabold text-white">
            Hello, <span className="gradient-text">{(userProfile?.name ?? 'Teacher').split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here's how your class is performing</p>
        </div>
        <div className="flex gap-3">
          <Link to="/teacher/classrooms" className="btn-secondary gap-2 w-fit"><Plus size={16} /> New Classroom</Link>
          <Link to="/teacher/generate"   className="btn-primary  gap-2 w-fit"><BarChart2 size={16} /> Generate Qs</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}    label="Total Students"  value="95"  color="#6366f1" link="/teacher/students"  delay={0.10} />
        <StatCard icon={BookOpen} label="Classrooms"      value="3"   color="#06b6d4" link="/teacher/classrooms" delay={0.15} />
        <StatCard icon={BookOpen} label="Materials"       value="26"  color="#8b5cf6" link="/teacher/materials"  delay={0.20} />
        <StatCard icon={Gamepad2} label="Games Created"   value="14"  color="#10b981" link="/teacher/games"     delay={0.25} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topic bar chart */}
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Class Topic Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill:'#64748b', fontSize:12 }} domain={[0,100]} unit="%" />
              <YAxis type="category" dataKey="topic" tick={{ fill:'#94a3b8', fontSize:11 }} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" radius={[0,6,6,0]}>
                {TOPIC_DATA.map((e,i) => <Cell key={i} fill={accuracyColor(e.avg)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top students */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Top Students</h3>
            <Link to="/teacher/students" className="text-xs text-indigo-400 flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {STUDENTS_DATA.map((s,i) => (
              <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03]">
                <span className="w-6 text-center font-bold text-sm" style={{ color:['#f59e0b','#94a3b8','#b45309','#64748b','#64748b'][i] }}>
                  {i<3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background:'rgba(99,102,241,0.2)' }}>
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.games} games</p>
                </div>
                <span className="text-sm font-bold" style={{ color:accuracyColor(s.accuracy) }}>{s.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak topics alert */}
      <div className="card p-5" style={{ borderColor:'rgba(245,158,11,0.25)', background:'rgba(245,158,11,0.03)' }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-2">Class Weak Topics 📊</p>
            <p className="text-sm text-slate-400 mb-3">These topics have a class average below 60%:</p>
            <div className="flex flex-wrap gap-2">
              {[{ t:'Operating System',avg:48 },{ t:'DBMS',avg:52 }].map(w => (
                <div key={w.t} className="badge badge-warning">{w.t} ({w.avg}%)</div>
              ))}
            </div>
          </div>
          <Link to="/teacher/generate" className="btn-primary btn-sm gap-1.5 flex-shrink-0">
            Generate Revision
          </Link>
        </div>
      </div>
    </div>
  )
}
