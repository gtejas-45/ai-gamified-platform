import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'
import { accuracyColor } from '../../utils/helpers'
import { TrendingUp, Users, Target } from 'lucide-react'

const CLASS_TREND = [
  { week:'Wk1', avg:60 },{ week:'Wk2', avg:65 },{ week:'Wk3', avg:63 },
  { week:'Wk4', avg:70 },{ week:'Wk5', avg:68 },{ week:'Wk6', avg:74 },
]
const TOPIC_DATA = [
  { topic:'Java OOP', avg:82 },{ topic:'SQL', avg:78 },{ topic:'Networks', avg:65 },
  { topic:'OS', avg:48 },{ topic:'DBMS', avg:52 },
]

const T = ({ active, payload, label }) => active && payload?.length
  ? <div className="glass-card p-2.5 text-xs"><p className="text-slate-400">{label}</p><p style={{ color:accuracyColor(payload[0].value) }} className="font-bold">{payload[0].value}%</p></div>
  : null

export default function TeacherAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white">Class Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Class Avg Accuracy', value:'72%',  color:'#10b981' },
          { label:'Total Attempts',     value:'480',  color:'#6366f1' },
          { label:'Weak Topics',        value:'2',    color:'#f59e0b' },
          { label:'Improvement',        value:'+12%', color:'#8b5cf6' },
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }} className="stat-card p-4 text-center">
            <p className="text-2xl font-extrabold" style={{ color:s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">6-Week Class Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CLASS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill:'#64748b', fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#64748b', fontSize:12 }} domain={[0,100]} unit="%" axisLine={false} tickLine={false} />
              <Tooltip content={<T />} />
              <Line type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill:'#8b5cf6', r:4 }} activeDot={{ r:6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Topic Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOPIC_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill:'#64748b', fontSize:12 }} domain={[0,100]} unit="%" />
              <YAxis type="category" dataKey="topic" tick={{ fill:'#94a3b8', fontSize:11 }} width={75} />
              <Tooltip content={<T />} />
              <Bar dataKey="avg" radius={[0,6,6,0]}>{TOPIC_DATA.map((e,i)=><Cell key={i} fill={accuracyColor(e.avg)} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
