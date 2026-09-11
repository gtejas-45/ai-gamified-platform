import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Edit3, Trash2, Eye, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_QUESTIONS = [
  { id:'q1', question:'What is the primary purpose of an operating system?', type:'mcq', topic:'OS', difficulty:'easy', options:['Manage hardware/software resources','Create websites','Design databases','Compile programs'], correct:'Manage hardware/software resources', explanation:'The OS manages computer hardware, software resources, memory, and processes.', status:'pending' },
  { id:'q2', question:'True or False: DBMS ensures data integrity.', type:'true_false', topic:'DBMS', difficulty:'easy', options:['True','False'], correct:'True', explanation:'DBMS enforces data integrity through constraints, transactions, and ACID properties.', status:'pending' },
  { id:'q3', question:'Which Java concept allows a child class to use methods of a parent class?', type:'mcq', topic:'Java OOP', difficulty:'medium', options:['Polymorphism','Inheritance','Encapsulation','Abstraction'], correct:'Inheritance', explanation:'Inheritance allows a subclass to inherit fields and methods from its superclass.', status:'approved' },
  { id:'q4', question:'What does CPU stand for?', type:'mcq', topic:'OS', difficulty:'easy', options:['Central Processing Unit','Computer Personal Unit','Core Processing Utility','Central Program Unit'], correct:'Central Processing Unit', explanation:'CPU stands for Central Processing Unit — the primary component that executes program instructions.', status:'rejected' },
]

const statusConfig = {
  pending:  { label:'Pending',  color:'#f59e0b', badge:'badge-warning' },
  approved: { label:'Approved', color:'#10b981', badge:'badge-success' },
  rejected: { label:'Rejected', color:'#ef4444', badge:'badge-error'   },
}

export default function QuestionReview() {
  const [questions, setQuestions] = useState(MOCK_QUESTIONS)
  const [filter,    setFilter]    = useState('all')

  function updateStatus(id, newStatus) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))
    toast.success(`Question ${newStatus}!`)
  }

  const filtered = filter === 'all' ? questions : questions.filter(q => q.status === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Question Review</h1>
        <p className="text-slate-400 text-sm mt-1">Review AI-generated questions before assigning to students</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
                  className="stat-card p-4 text-center transition-all" style={{ borderColor: filter===key ? `${cfg.color}50` : undefined, background: filter===key ? `${cfg.color}10` : undefined }}>
            <p className="text-2xl font-extrabold" style={{ color: cfg.color }}>
              {questions.filter(q => q.status === key).length}
            </p>
            <p className="text-xs text-slate-500">{cfg.label}</p>
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filtered.map((q, i) => {
          const sc = statusConfig[q.status]
          return (
            <motion.div key={q.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                        className="card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge badge-primary text-[11px]">{q.type}</span>
                    <span className="badge badge-cyan text-[11px]">{q.topic}</span>
                    <span className="badge badge-warning text-[11px]">{q.difficulty}</span>
                    <span className={`badge ${sc.badge} text-[11px]`}>{sc.label}</span>
                  </div>
                  <p className="font-medium text-white">{q.question}</p>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, j) => (
                  <div key={j} className={`text-xs p-2.5 rounded-xl flex items-center gap-2 ${opt === q.correct ? 'bg-green-500/12 border border-green-500/30' : 'bg-white/[0.04]'}`}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: opt === q.correct ? '#10b981' : 'rgba(255,255,255,0.1)', color:'white' }}>
                      {['A','B','C','D'][j]}
                    </span>
                    <span className={opt === q.correct ? 'text-green-400' : 'text-slate-400'}>{opt}</span>
                    {opt === q.correct && <CheckCircle size={12} className="text-green-400 ml-auto" />}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 italic p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                💡 {q.explanation}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {q.status !== 'approved' && (
                  <button onClick={() => updateStatus(q.id, 'approved')} className="btn-success btn-sm gap-1.5">
                    <CheckCircle size={14} /> Approve
                  </button>
                )}
                {q.status !== 'rejected' && (
                  <button onClick={() => updateStatus(q.id, 'rejected')} className="btn-danger btn-sm gap-1.5">
                    <XCircle size={14} /> Reject
                  </button>
                )}
                <button className="btn-secondary btn-sm gap-1.5">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}
                        className="btn-secondary btn-sm gap-1.5 ml-auto text-red-400 hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
