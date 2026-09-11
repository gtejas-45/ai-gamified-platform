import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Home, RotateCcw, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const SEQUENCES = [
  {
    title: 'OSI Model Layers (Physical → Application)',
    items: [
      { id:'s1', text:'Physical Layer',      correct:1 },
      { id:'s2', text:'Data Link Layer',     correct:2 },
      { id:'s3', text:'Network Layer',       correct:3 },
      { id:'s4', text:'Transport Layer',     correct:4 },
      { id:'s5', text:'Session Layer',       correct:5 },
      { id:'s6', text:'Presentation Layer',  correct:6 },
      { id:'s7', text:'Application Layer',   correct:7 },
    ],
  },
]

function shuffle(arr) {
  const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}; return a
}

export default function SequenceBuilder() {
  const navigate = useNavigate()
  const [seq]     = useState(SEQUENCES[0])
  const [items,   setItems]    = useState(() => shuffle(seq.items))
  const [checked, setChecked]  = useState(false)
  const [dragging,setDragging] = useState(null)
  const [dragOver,setDragOver] = useState(null)

  function handleDragStart(i) { setDragging(i) }
  function handleDragOver(e, i) { e.preventDefault(); setDragOver(i) }
  function handleDrop(i) {
    if (dragging === null || dragging === i) return
    const arr = [...items]
    const [removed] = arr.splice(dragging, 1)
    arr.splice(i, 0, removed)
    setItems(arr)
    setDragging(null); setDragOver(null)
  }

  function checkAnswer() {
    setChecked(true)
    const correct = items.every((item, i) => item.correct === i + 1)
    if (correct) toast.success('Perfect sequence! 🎉 +50 XP')
    else toast.error('Not quite right. Keep rearranging!')
  }

  function retry() { setItems(shuffle(seq.items)); setChecked(false) }

  const correctCount = checked ? items.filter((item,i) => item.correct === i+1).length : 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 gap-6" style={{ background:'#0a0f1e' }}>
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <button onClick={()=>navigate('/student/games')} className="text-slate-500 hover:text-white text-sm">✕ Quit</button>
          {checked && <span className="badge badge-success">{correctCount}/{items.length} correct</span>}
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-white text-center">{seq.title}</h2>
          <p className="text-xs text-slate-500 text-center">Drag to rearrange in the correct order</p>

          <div className="space-y-2">
            {items.map((item, i) => {
              const isCorrect   = checked && item.correct === i+1
              const isIncorrect = checked && item.correct !== i+1
              return (
                <motion.div
                  key={item.id}
                  layout
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDrop={() => handleDrop(i)}
                  className="flex items-center gap-3 p-3.5 rounded-xl cursor-grab active:cursor-grabbing transition-all"
                  style={{
                    background: isCorrect ? 'rgba(16,185,129,0.1)' : isIncorrect ? 'rgba(239,68,68,0.1)' : dragOver===i ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : isIncorrect ? 'rgba(239,68,68,0.3)' : dragOver===i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  whileHover={{ scale: checked ? 1 : 1.01 }}
                >
                  <GripVertical size={16} className="text-slate-600 flex-shrink-0" />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                       style={{ background: isCorrect ? '#10b981' : isIncorrect ? '#ef4444' : 'rgba(99,102,241,0.4)', color:'white' }}>
                    {i+1}
                  </div>
                  <span className="text-sm font-medium text-white flex-1">{item.text}</span>
                  {isCorrect   && <CheckCircle size={16} className="text-green-400" />}
                  {isIncorrect && <XCircle     size={16} className="text-red-400"   />}
                </motion.div>
              )
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={retry} className="btn-secondary flex-1 gap-2"><RotateCcw size={15} /> Shuffle</button>
            {!checked
              ? <button onClick={checkAnswer} className="btn-primary flex-1"><CheckCircle size={15} /> Check</button>
              : <button onClick={()=>navigate('/student/dashboard')} className="btn-primary flex-1 gap-2"><Home size={15} /> Done</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
