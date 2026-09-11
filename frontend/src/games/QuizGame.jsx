import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, XCircle, Zap, Trophy, ChevronRight, Home } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock questions – replaced with Firestore data later
const MOCK_QUESTIONS = [
  { id:'q1', question:'What is the primary purpose of an operating system?', options:['Manage hardware/software resources','Create websites','Design databases','Compile programs'], correct:'Manage hardware/software resources', explanation:'The OS manages hardware resources, memory, processes, and provides a user interface.', xp:10 },
  { id:'q2', question:'Which scheduling algorithm gives the shortest average waiting time for a given set of processes?', options:['FCFS','SJF','Round Robin','Priority'], correct:'SJF', explanation:'Shortest Job First minimizes average waiting time by executing the process with the shortest burst time next.', xp:15 },
  { id:'q3', question:'True or False: A deadlock can occur with only one process.', options:['True','False'], correct:'False', explanation:'Deadlock requires at least two processes that are each waiting for a resource held by the other.', xp:10 },
  { id:'q4', question:'What does RAM stand for?', options:['Random Access Memory','Read And Modify','Random Allocation Module','Runtime Access Mode'], correct:'Random Access Memory', explanation:'RAM (Random Access Memory) is a fast, volatile memory used to store data actively used by the CPU.', xp:10 },
  { id:'q5', question:'Which of the following is NOT a function of the OS?', options:['Process management','Memory management','Webpage design','File management'], correct:'Webpage design', explanation:'Webpage design is done by web developers/browsers, not by the OS. The OS handles process, memory, and file management.', xp:15 },
]

const TIMER_SECS = 30

export default function QuizGame() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [questions]     = useState(MOCK_QUESTIONS)
  const [current,       setCurrent]       = useState(0)
  const [selected,      setSelected]      = useState(null)
  const [answered,      setAnswered]      = useState(false)
  const [score,         setScore]         = useState(0)
  const [xpEarned,      setXpEarned]      = useState(0)
  const [timeLeft,      setTimeLeft]      = useState(TIMER_SECS)
  const [results,       setResults]       = useState([])
  const [gameOver,      setGameOver]      = useState(false)
  const [showExplain,   setShowExplain]   = useState(false)
  const [timerExpired,  setTimerExpired]  = useState(false)
  const [streak,        setStreak]        = useState(0)
  const [maxStreak,     setMaxStreak]     = useState(0)

  const q = questions[current]

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (answered || gameOver) return
    if (timeLeft <= 0) {
      setTimerExpired(true)
      handleAnswer(null)
      return
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, answered, gameOver])

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((option) => {
    if (answered) return
    const isCorrect   = option === q.correct
    const timeFactor  = Math.max(0, timeLeft / TIMER_SECS)
    const xp          = isCorrect ? Math.round(q.xp * (0.5 + 0.5 * timeFactor)) : 0

    setSelected(option)
    setAnswered(true)
    setShowExplain(true)
    setResults(prev => [...prev, { question: q.question, selected: option, correct: q.correct, isCorrect }])

    if (isCorrect) {
      setScore(p => p + 1)
      setXpEarned(p => p + xp)
      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak(prev => Math.max(prev, newStreak))
      if (newStreak >= 3) toast.success(`🔥 ${newStreak}-streak! +${xp} XP bonus`)
      else toast.success(`Correct! +${xp} XP`)
    } else {
      setStreak(0)
      toast.error('Wrong answer!')
    }
  }, [answered, q, timeLeft, streak])

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      setGameOver(true)
    } else {
      setCurrent(p => p + 1)
      setSelected(null)
      setAnswered(false)
      setShowExplain(false)
      setTimerExpired(false)
      setTimeLeft(TIMER_SECS)
    }
  }

  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // ── GAME OVER screen ─────────────────────────────────────────────────────
  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background:'#0a0f1e' }}>
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="glass-card p-8 w-full max-w-lg text-center">
          <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎯' : '📚'}</div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-400 mb-8">{questions.length} questions completed</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stat-card p-4 text-center">
              <p className="text-3xl font-extrabold gradient-text">{accuracy}%</p>
              <p className="text-xs text-slate-500">Accuracy</p>
            </div>
            <div className="stat-card p-4 text-center">
              <p className="text-3xl font-extrabold text-amber-400">+{xpEarned}</p>
              <p className="text-xs text-slate-500">XP Earned</p>
            </div>
            <div className="stat-card p-4 text-center">
              <p className="text-3xl font-extrabold text-green-400">{score}</p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="stat-card p-4 text-center">
              <p className="text-3xl font-extrabold text-orange-400">{maxStreak}🔥</p>
              <p className="text-xs text-slate-500">Max Streak</p>
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-2 mb-8 text-left max-h-52 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-xs ${r.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {r.isCorrect ? <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-slate-300 font-medium">{r.question}</p>
                  {!r.isCorrect && <p className="text-slate-500 mt-0.5">✓ {r.correct}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/student/dashboard')} className="btn-secondary flex-1 gap-2">
              <Home size={16} /> Dashboard
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary flex-1 gap-2">
              <ChevronRight size={16} /> Play Again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── GAME screen ──────────────────────────────────────────────────────────
  const timerPct = (timeLeft / TIMER_SECS) * 100
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 8 ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background:'#0a0f1e' }}>
      <div className="w-full max-w-2xl">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/student/games')} className="text-slate-500 hover:text-white transition-colors text-sm">
            ✕ Quit
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span className="text-sm font-bold text-amber-400">{xpEarned} XP</span>
            </div>
            {streak >= 2 && (
              <span className="badge badge-warning">{streak}🔥 Streak</span>
            )}
          </div>
          <p className="text-sm text-slate-500">{current + 1}/{questions.length}</p>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-6 h-1.5">
          <div className="progress-bar-fill transition-all" style={{ width:`${((current + 1)/questions.length)*100}%` }} />
        </div>

        {/* Timer ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none"
                      stroke={timerColor} strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - timerPct / 100)}`}
                      style={{ transition:'stroke-dashoffset 1s linear, stroke 0.3s' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-extrabold" style={{ color: timerColor }}>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            transition={{ duration:0.3 }}
            className="card p-6 mb-5"
          >
            <p className="text-lg font-bold text-white leading-relaxed mb-6">{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let style = 'quiz-option'
                if (answered) {
                  if (opt === q.correct)       style += ' correct'
                  else if (opt === selected)   style += ' incorrect'
                  else                         style += ' opacity-50'
                }
                return (
                  <button key={i} onClick={() => !answered && handleAnswer(opt)}
                          disabled={answered}
                          className={`${style} w-full`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      answered && opt === q.correct   ? 'bg-green-500' :
                      answered && opt === selected     ? 'bg-red-500'   : 'bg-white/10'
                    }`}>
                      {['A','B','C','D'][i]}
                    </div>
                    <span className="flex-1 text-left">{opt}</span>
                    {answered && opt === q.correct  && <CheckCircle size={16} className="text-green-400 flex-shrink-0" />}
                    {answered && opt === selected && opt !== q.correct && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplain && (
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="mt-4 p-3 rounded-xl text-sm"
                            style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-indigo-300">💡 {q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {answered && (
          <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                         onClick={nextQuestion} className="btn-primary w-full gap-2 py-4" style={{ justifyContent:'center' }}>
            {current + 1 >= questions.length ? '🏆 See Results' : 'Next Question'} <ChevronRight size={18} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
