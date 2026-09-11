import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, RotateCcw } from 'lucide-react'

const PAIRS = [
  { id:'p1', term:'CPU',              def:'Central Processing Unit' },
  { id:'p2', term:'RAM',              def:'Random Access Memory'    },
  { id:'p3', term:'OS',              def:'Operating System'        },
  { id:'p4', term:'DBMS',            def:'Database Management System' },
  { id:'p5', term:'HTTP',            def:'HyperText Transfer Protocol' },
  { id:'p6', term:'SQL',             def:'Structured Query Language' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards(pairs) {
  const cards = []
  pairs.forEach(p => {
    cards.push({ id:`${p.id}-t`, pairId:p.id, text:p.term, type:'term'   })
    cards.push({ id:`${p.id}-d`, pairId:p.id, text:p.def,  type:'def'    })
  })
  return shuffle(cards)
}

export default function MemoryMatch() {
  const navigate = useNavigate()
  const [cards,   setCards]   = useState(() => buildCards(PAIRS))
  const [flipped, setFlipped] = useState([])   // indices of face-up cards
  const [matched, setMatched] = useState(new Set())
  const [moves,   setMoves]   = useState(0)
  const [locked,  setLocked]  = useState(false)
  const [gameOver,setGameOver]= useState(false)
  const [time,    setTime]    = useState(0)

  useEffect(() => {
    if (gameOver) return
    const t = setInterval(() => setTime(p => p+1), 1000)
    return () => clearInterval(t)
  }, [gameOver])

  useEffect(() => {
    if (matched.size === PAIRS.length) setGameOver(true)
  }, [matched])

  function flipCard(idx) {
    if (locked || flipped.includes(idx) || matched.has(cards[idx].pairId)) return
    const newFlipped = [...flipped, idx]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(p => p+1)
      setLocked(true)
      const [a, b] = newFlipped
      if (cards[a].pairId === cards[b].pairId) {
        setMatched(prev => new Set([...prev, cards[a].pairId]))
        setFlipped([])
        setLocked(false)
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false) }, 1000)
      }
    }
  }

  function restart() {
    setCards(buildCards(PAIRS))
    setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); setGameOver(false); setTime(0)
  }

  const accuracy = moves > 0 ? Math.round((PAIRS.length / moves) * 100) : 0

  if (gameOver) return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background:'#0a0f1e' }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="glass-card p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🃏</div>
        <h2 className="text-3xl font-extrabold text-white mb-2">All Matched!</h2>
        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="stat-card p-4 text-center"><p className="text-2xl font-extrabold text-indigo-400">{moves}</p><p className="text-xs text-slate-500">Moves</p></div>
          <div className="stat-card p-4 text-center"><p className="text-2xl font-extrabold text-green-400">{Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</p><p className="text-xs text-slate-500">Time</p></div>
          <div className="stat-card p-4 text-center"><p className="text-2xl font-extrabold text-amber-400">+{PAIRS.length * 10}</p><p className="text-xs text-slate-500">XP</p></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/student/dashboard')} className="btn-secondary flex-1 gap-2"><Home size={16} /> Home</button>
          <button onClick={restart} className="btn-primary flex-1 gap-2"><RotateCcw size={16} /> Play Again</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 gap-6" style={{ background:'#0a0f1e' }}>
      <div className="flex items-center justify-between w-full max-w-2xl">
        <button onClick={() => navigate('/student/games')} className="text-slate-500 hover:text-white text-sm">✕ Quit</button>
        <div className="flex gap-4 text-sm">
          <span className="text-slate-400">Moves: <span className="font-bold text-white">{moves}</span></span>
          <span className="text-slate-400">Matched: <span className="font-bold text-green-400">{matched.size}/{PAIRS.length}</span></span>
          <span className="text-slate-400">⏱ {Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
        {cards.map((card, i) => {
          const isFlipped  = flipped.includes(i)
          const isMatched  = matched.has(card.pairId)
          return (
            <motion.button key={card.id}
              onClick={() => flipCard(i)}
              className="h-24 relative cursor-pointer"
              style={{ perspective:'600px' }}
              whileHover={!isFlipped && !isMatched ? { scale:1.03 } : {}}
            >
              {/* Back */}
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', backfaceVisibility:'hidden' }}
                animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                transition={{ duration:0.35 }}
              >🃏</motion.div>

              {/* Front */}
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-2 text-center text-sm font-medium"
                style={{
                  background: isMatched ? 'rgba(16,185,129,0.15)' : 'rgba(30,40,80,0.9)',
                  border: `1px solid ${isMatched ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}`,
                  color: isMatched ? '#34d399' : '#e2e8f0',
                  backfaceVisibility:'hidden',
                }}
                animate={{ rotateY: isFlipped || isMatched ? 0 : -180 }}
                transition={{ duration:0.35 }}
              >
                <span className="text-xs leading-tight">{card.text}</span>
              </motion.div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
