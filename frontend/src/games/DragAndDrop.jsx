import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Home, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id:'dml', name:'DML', color:'#6366f1', description:'Data Manipulation Language' },
  { id:'ddl', name:'DDL', color:'#10b981', description:'Data Definition Language'   },
  { id:'dcl', name:'DCL', color:'#f59e0b', description:'Data Control Language'      },
]
const ITEMS = [
  { id:'i1', text:'SELECT', category:'dml' }, { id:'i2', text:'INSERT', category:'dml' },
  { id:'i3', text:'UPDATE', category:'dml' }, { id:'i4', text:'DELETE', category:'dml' },
  { id:'i5', text:'CREATE', category:'ddl' }, { id:'i6', text:'ALTER',  category:'ddl' },
  { id:'i7', text:'DROP',   category:'ddl' }, { id:'i8', text:'GRANT',  category:'dcl' },
  { id:'i9', text:'REVOKE', category:'dcl' },
]

function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}; return a }

export default function DragAndDrop() {
  const navigate = useNavigate()
  const [items,   setItems]   = useState(() => shuffle(ITEMS).map(i=>({...i, placed:null})))
  const [dragging,setDragging]= useState(null)
  const [checked, setChecked] = useState(false)
  const [bins,    setBins]    = useState(() => Object.fromEntries(CATEGORIES.map(c=>[c.id,[]])))

  function startDrag(item) { setDragging(item) }

  function dropOnBin(catId) {
    if (!dragging) return
    // Remove from old bin if any
    setBins(prev => {
      const nb = { ...prev }
      Object.keys(nb).forEach(k => { nb[k] = nb[k].filter(id => id !== dragging.id) })
      nb[catId] = [...nb[catId], dragging.id]
      return nb
    })
    setDragging(null)
  }

  function removeFromBin(itemId) {
    setBins(prev => {
      const nb = { ...prev }
      Object.keys(nb).forEach(k => { nb[k] = nb[k].filter(id => id !== itemId) })
      return nb
    })
  }

  function checkAnswer() {
    setChecked(true)
    let correct = 0
    Object.entries(bins).forEach(([catId, ids]) => {
      ids.forEach(id => {
        const item = ITEMS.find(i => i.id === id)
        if (item && item.category === catId) correct++
      })
    })
    const pct = Math.round((correct/ITEMS.length)*100)
    toast.success(`Score: ${pct}% — ${correct}/${ITEMS.length} correct!`)
  }

  function retry() {
    setItems(shuffle(ITEMS).map(i=>({...i,placed:null})))
    setBins(Object.fromEntries(CATEGORIES.map(c=>[c.id,[]])))
    setChecked(false)
  }

  const allPlaced = ITEMS.every(item => Object.values(bins).flat().includes(item.id))

  function isCorrect(itemId, catId) {
    const item = ITEMS.find(i=>i.id===itemId)
    return item?.category === catId
  }

  const unplaced = ITEMS.filter(item => !Object.values(bins).flat().includes(item.id))

  return (
    <div className="min-h-screen p-5 flex flex-col items-center justify-center gap-6" style={{ background:'#0a0f1e' }}>
      <div className="w-full max-w-3xl">
        <div className="flex justify-between mb-4">
          <button onClick={()=>navigate('/student/games')} className="text-slate-500 hover:text-white text-sm">✕ Quit</button>
          <h2 className="font-bold text-white">SQL Commands Classification</h2>
          <button onClick={retry} className="text-slate-500 hover:text-white text-sm flex items-center gap-1"><RotateCcw size={14} /> Reset</button>
        </div>

        {/* Draggable items */}
        <div className="card p-4 mb-4">
          <p className="text-xs text-slate-500 mb-3">Drag the SQL commands into the correct category:</p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map(item => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={() => startDrag(item)}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                className="px-4 py-2 rounded-xl cursor-grab text-sm font-bold text-white select-none"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 14px rgba(99,102,241,0.35)' }}
              >
                {item.text}
              </motion.div>
            ))}
            {unplaced.length === 0 && <p className="text-xs text-slate-600">All items placed ✓</p>}
          </div>
        </div>

        {/* Drop bins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onDragOver={e=>e.preventDefault()}
              onDrop={()=>dropOnBin(cat.id)}
              className="rounded-2xl p-4 min-h-36 transition-all"
              style={{ border:`2px dashed ${cat.color}40`, background:`${cat.color}08` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background:cat.color }} />
                <p className="font-bold text-sm" style={{ color:cat.color }}>{cat.name}</p>
              </div>
              <p className="text-[10px] text-slate-600 mb-3">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {bins[cat.id].map(itemId => {
                  const item = ITEMS.find(i=>i.id===itemId)
                  const correct = isCorrect(itemId, cat.id)
                  return (
                    <motion.div key={itemId}
                      initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                      style={{ background: checked ? (correct?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)') : `${cat.color}20`, color: checked ? (correct?'#34d399':'#f87171') : cat.color, border:`1px solid ${checked?(correct?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'):`${cat.color}40`}` }}
                      onClick={()=>!checked&&removeFromBin(itemId)}
                    >
                      {item?.text}
                      {checked && (correct ? <CheckCircle size={10} /> : '✗')}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={checked ? ()=>navigate('/student/dashboard') : checkAnswer}
          disabled={!allPlaced && !checked}
          className={`btn-primary w-full gap-2 py-3.5 ${(!allPlaced && !checked)?'opacity-50 cursor-not-allowed':''}`}
          style={{ justifyContent:'center' }}
        >
          {checked ? <><Home size={18} /> Back to Dashboard</> : <><CheckCircle size={18} /> Check Answers</>}
        </button>
      </div>
    </div>
  )
}
