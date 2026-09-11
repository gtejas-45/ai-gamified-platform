import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ChevronRight, Loader2, AlertCircle, FileText, Brain, Settings2 } from 'lucide-react'
import { GAME_TYPES, DIFFICULTY_OPTIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const MOCK_MATERIALS = [
  { id: '1', title: 'Operating Systems – Unit 3',  topics: ['Memory Management','CPU Scheduling','Deadlocks'] },
  { id: '2', title: 'DBMS Notes – Chapter 5',      topics: ['Normalization','Transactions','Indexing']       },
  { id: '3', title: 'Java OOP – Complete Guide',   topics: ['Classes','Inheritance','Polymorphism']          },
]

export default function GenerateGame() {
  const navigate = useNavigate()
  const [step,        setStep]        = useState(1)  // 1=material, 2=config, 3=generating
  const [material,    setMaterial]    = useState(null)
  const [topic,       setTopic]       = useState('all')
  const [gameType,    setGameType]    = useState('quiz')
  const [difficulty,  setDifficulty]  = useState('medium')
  const [numQs,       setNumQs]       = useState(10)
  const [generating,  setGenerating]  = useState(false)

  const selectedMat   = MOCK_MATERIALS.find(m => m.id === material)
  const topicOptions  = selectedMat ? ['all', ...selectedMat.topics] : ['all']

  async function handleGenerate() {
    if (!material) { toast.error('Please select a study material first.'); return }
    setGenerating(true); setStep(3)
    await new Promise(r => setTimeout(r, 3000))   // mock AI call
    toast.success('Game ready! Let\'s go 🎮')
    navigate(`/game/${gameType}/demo-${Date.now()}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Generate a Game</h1>
        <p className="text-slate-400 text-sm mt-1">AI will create questions from your study material</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Select Material', 'Configure', 'Generate'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                   style={{
                     background: step > i+1 ? '#10b981' : step === i+1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.1)',
                     color: step >= i+1 ? 'white' : '#64748b',
                   }}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className="text-xs hidden sm:block" style={{ color: step === i+1 ? '#f8fafc' : '#64748b' }}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)', minWidth: '24px' }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Material */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-indigo-400" /> Choose Material</h3>
          {MOCK_MATERIALS.map(mat => (
            <button key={mat.id} onClick={() => setMaterial(mat.id)}
                    className="w-full text-left p-4 rounded-xl transition-all duration-200"
                    style={{
                      border: `1px solid ${material === mat.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      background: material === mat.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                    }}>
              <p className="font-medium text-white">{mat.title}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {mat.topics.map(t => <span key={t} className="badge badge-primary text-[11px]">{t}</span>)}
              </div>
            </button>
          ))}
          <button onClick={() => material && setStep(2)} disabled={!material}
                  className={`btn-primary w-full gap-2 py-3.5 ${!material ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ justifyContent: 'center' }}>
            Next: Configure <ChevronRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <h3 className="font-bold text-white flex items-center gap-2"><Settings2 size={18} className="text-indigo-400" /> Game Settings</h3>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Topic</label>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                        className="px-3 py-1.5 rounded-xl text-sm transition-all"
                        style={{ border: `1px solid ${topic === t ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`, background: topic === t ? 'rgba(99,102,241,0.15)' : 'transparent', color: topic === t ? '#818cf8' : '#94a3b8' }}>
                  {t === 'all' ? 'All Topics' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Game type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Game Type</label>
            <div className="grid grid-cols-2 gap-3">
              {GAME_TYPES.map(g => (
                <button key={g.id} onClick={() => setGameType(g.id)}
                        className="p-3 rounded-xl text-left transition-all"
                        style={{ border: `1px solid ${gameType === g.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: gameType === g.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  <span className="text-2xl">{g.emoji}</span>
                  <p className="text-sm font-medium text-white mt-1">{g.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.filter(d => d.value !== 'mixed').map(d => (
                <button key={d.value} onClick={() => setDifficulty(d.value)}
                        className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ border: `1px solid ${difficulty === d.value ? `${d.color}60` : 'rgba(255,255,255,0.08)'}`, background: difficulty === d.value ? `${d.color}15` : 'transparent', color: difficulty === d.value ? d.color : '#94a3b8' }}>
                  {d.emoji} {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Questions: <span className="text-white font-bold">{numQs}</span></label>
            <input type="range" min={5} max={30} step={5} value={numQs} onChange={e => setNumQs(+e.target.value)}
                   className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-slate-600 mt-1"><span>5</span><span>30</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
            <button onClick={handleGenerate} className="btn-primary flex-1 gap-2" style={{ justifyContent: 'center' }}>
              <Sparkles size={16} /> Generate with AI
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="card p-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            <Brain size={36} className="text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">AI is Generating Questions</h3>
            <p className="text-slate-400 text-sm">Gemini is analyzing your material and creating {numQs} {difficulty} questions…</p>
          </div>
          <div className="flex justify-center gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                   style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <div className="text-xs text-slate-600">
            Extract → Clean → Chunk → Gemini → Validate → Ready ✓
          </div>
        </motion.div>
      )}
    </div>
  )
}
