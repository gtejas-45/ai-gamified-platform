import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, CheckCircle, XCircle } from 'lucide-react'

const FLASHCARDS = [
  { id:'f1', front:'What is polymorphism?',   back:'Polymorphism allows objects of different types to be treated as the same type. A method can behave differently based on the object that calls it (method overriding/overloading).', topic:'Java OOP' },
  { id:'f2', front:'What is encapsulation?',  back:'Encapsulation is the bundling of data (attributes) and methods that operate on the data into a single unit (class), and restricting access using private/public modifiers.', topic:'Java OOP' },
  { id:'f3', front:'Explain normalization.',   back:'Normalization is the process of organizing a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller tables and defining relationships.', topic:'DBMS' },
  { id:'f4', front:'What is a deadlock?',      back:'A deadlock is a situation where two or more processes are blocked forever, each waiting for a resource held by the other. It requires: mutual exclusion, hold and wait, no preemption, circular wait.', topic:'OS' },
]

export default function RevisionMode() {
  const navigate  = useNavigate()
  const [idx,     setIdx]     = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const [done,    setDone]    = useState(false)

  const card = FLASHCARDS[idx]

  function rate(knew) {
    setResults(prev => [...prev, { id: card.id, knew }])
    if (idx + 1 >= FLASHCARDS.length) {
      setDone(true)
    } else {
      setIdx(p => p+1)
      setFlipped(false)
    }
  }

  if (done) {
    const knew = results.filter(r => r.knew).length
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background:'#0a0f1e' }}>
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-2xl font-extrabold text-white mb-6">Revision Complete!</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stat-card p-4 text-center"><p className="text-3xl font-extrabold text-green-400">{knew}</p><p className="text-xs text-slate-500">Knew</p></div>
            <div className="stat-card p-4 text-center"><p className="text-3xl font-extrabold text-red-400">{results.length - knew}</p><p className="text-xs text-slate-500">Need Review</p></div>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>navigate('/student/dashboard')} className="btn-secondary flex-1 gap-2"><Home size={16} /> Home</button>
            <button onClick={()=>{setIdx(0);setFlipped(false);setResults([]);setDone(false)}} className="btn-primary flex-1">Restart</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 gap-6" style={{ background:'#0a0f1e' }}>
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={()=>navigate('/student/games')} className="text-slate-500 hover:text-white text-sm">✕ Quit</button>
          <p className="text-sm text-slate-400">{idx+1}/{FLASHCARDS.length}</p>
        </div>

        <div className="progress-bar mb-6"><div className="progress-bar-fill" style={{ width:`${((idx+1)/FLASHCARDS.length)*100}%` }} /></div>

        {/* Flashcard */}
        <div className="relative h-64 cursor-pointer" onClick={() => setFlipped(p => !p)} style={{ perspective:'1000px' }}>
          {/* Front */}
          <motion.div
            className="absolute inset-0 card p-6 flex flex-col items-center justify-center text-center"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration:0.5 }}
            style={{ backfaceVisibility:'hidden' }}
          >
            <span className="badge badge-primary mb-4">{card.topic}</span>
            <p className="text-xl font-bold text-white">{card.front}</p>
            <p className="text-xs text-slate-500 mt-6">Click to reveal answer →</p>
          </motion.div>

          {/* Back */}
          <motion.div
            className="absolute inset-0 card p-6 flex flex-col items-center justify-center text-center"
            animate={{ rotateY: flipped ? 0 : -180 }}
            transition={{ duration:0.5 }}
            style={{ backfaceVisibility:'hidden', background:'rgba(99,102,241,0.08)', borderColor:'rgba(99,102,241,0.3)' }}
          >
            <p className="text-sm text-slate-300 leading-relaxed">{card.back}</p>
          </motion.div>
        </div>

        {flipped && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex gap-3 mt-5">
            <button onClick={() => rate(false)} className="flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171' }}>
              <XCircle size={18} /> Didn't Know
            </button>
            <button onClick={() => rate(true)} className="flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399' }}>
              <CheckCircle size={18} /> Knew It!
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
