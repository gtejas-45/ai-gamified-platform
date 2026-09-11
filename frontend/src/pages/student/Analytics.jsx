import { motion } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { accuracyColor } from '../../utils/helpers'
import { TrendingUp, Target, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'

const TOPIC_DATA = [
  { topic: 'Java OOP',    accuracy: 90, attempts: 8  },
  { topic: 'SQL',         accuracy: 85, attempts: 6  },
  { topic: 'Networks',    accuracy: 78, attempts: 7  },
  { topic: 'OS',          accuracy: 45, attempts: 10 },
  { topic: 'DBMS',        accuracy: 50, attempts: 9  },
]
const WEEKLY_TREND = [
  { day: 'Mon', score:65 },{ day:'Tue', score:72 },{ day:'Wed', score:68 },
  { day: 'Thu', score:80 },{ day:'Fri', score:74 },{ day:'Sat', score:85 },{ day:'Sun', score:78 },
]
const PIE_DATA = [
  { name: 'Correct',   value: 187, color: '#10b981' },
  { name: 'Incorrect', value:  53, color: '#ef4444' },
]
const RADAR_DATA = [
  { subject:'Java OOP', A:90 },{ subject:'SQL', A:85 },{ subject:'Networks', A:78 },
  { subject:'OS', A:45 },{ subject:'DBMS', A:50 },{ subject:'Algorithms', A:70 },
]

const CustomTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="glass-card p-2.5 text-xs">
      <p className="text-slate-400">{label}</p>
      <p className="text-indigo-400 font-bold">{payload[0].value}%</p>
    </div>
  ) : null

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Performance Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Detailed breakdown of your learning progress</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Games',   value: '24',   icon: Target,      color: '#6366f1' },
          { label: 'Questions',     value: '240',  icon: CheckCircle, color: '#10b981' },
          { label: 'Correct',       value: '187',  icon: CheckCircle, color: '#10b981' },
          { label: 'Wrong',         value: '53',   icon: XCircle,     color: '#ef4444' },
          { label: 'Avg Time',      value: '4:12', icon: Clock,       color: '#f59e0b' },
          { label: 'Accuracy',      value: '78%',  icon: Zap,         color: '#8b5cf6' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.07 }}
              className="stat-card text-center p-4"
            >
              <Icon size={20} style={{ color: s.color }} className="mx-auto mb-2" />
              <p className="text-xl font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic performance bar chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-bold text-white mb-4">Topic Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill:'#64748b', fontSize:12 }} domain={[0,100]} unit="%" />
              <YAxis type="category" dataKey="topic" tick={{ fill:'#94a3b8', fontSize:11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accuracy" radius={[0,6,6,0]}>
                {TOPIC_DATA.map((entry,i) => (
                  <Cell key={i} fill={accuracyColor(entry.accuracy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Correct vs Wrong</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                {PIE_DATA.map((entry,i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend formatter={(v) => <span style={{ color:'#94a3b8', fontSize:'12px' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white">78%</p>
            <p className="text-xs text-slate-500">Overall Accuracy</p>
          </div>
        </div>
      </div>

      {/* Weekly trend line chart */}
      <div className="card p-5">
        <h3 className="font-bold text-white mb-4">7-Day Score Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill:'#64748b', fontSize:12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#64748b', fontSize:12 }} domain={[0,100]} unit="%" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ fill:'#6366f1', r:4 }} activeDot={{ r:6, fill:'#8b5cf6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weak topics */}
      <div className="card p-5">
        <h3 className="font-bold text-white mb-4">Topic Mastery</h3>
        <div className="space-y-3">
          {TOPIC_DATA.sort((a,b)=>a.accuracy-b.accuracy).map((t,i)=>(
            <div key={t.topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{t.topic}</span>
                <span style={{ color: accuracyColor(t.accuracy) }}>{t.accuracy}%</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill" style={{ width:`${t.accuracy}%`, background: accuracyColor(t.accuracy) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
