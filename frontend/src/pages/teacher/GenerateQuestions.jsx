import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Brain, ChevronRight, FileText, Settings2, Loader2 } from 'lucide-react'
import { DIFFICULTY_OPTIONS, QUESTION_TYPES } from '../../utils/constants'
import toast from 'react-hot-toast'

const MOCK_MATERIALS = [
  { id:'1', title:'OS Unit 3 – CPU Scheduling',  topics:['CPU Scheduling','Memory Management','Deadlocks'] },
  { id:'2', title:'DBMS Chapter 5',              topics:['Normalization','Transactions','Indexing']        },
  { id:'3', title:'Java OOP Complete Guide',     topics:['Classes','Inheritance','Polymorphism','Abstraction'] },
]

const MOCK_GENERATED = [
  { id:'g1', question:'What is the difference between process and thread?', type:'mcq', topic:'OS', difficulty:'medium', options:['Process has its own memory; thread shares memory','Thread has its own memory; process shares','Both have separate memory','No difference'], correct:'Process has its own memory; thread shares memory', explanation:'A process is an independent program in execution with its own memory space. Threads are lightweight sub-processes that share the same memory within a process.', status:'pending' },
  { id:'g2', question:'True or False: SQL SELECT is a DML statement.',       type:'true_false', topic:'DBMS', difficulty:'easy', options:['True','False'], correct:'True', explanation:'SELECT is indeed a DML (Data Manipulation Language) statement as it retrieves/manipulates data.', status:'pending' },
  { id:'g3', question:'Which normal form eliminates transitive dependencies?', type:'mcq', topic:'DBMS', difficulty:'medium', options:['1NF','2NF','3NF','BCNF'], correct:'3NF', explanation:'Third Normal Form (3NF) ensures that all non-key attributes are non-transitively dependent on the primary key.', status:'pending' },
]

export default function GenerateQuestions() {
  const [step,        setStep]        = useState(1)
  const [material,    setMaterial]    = useState(null)
  const [topic,       setTopic]       = useState('all')
  const [difficulty,  setDifficulty]  = useState('medium')
  const [numQs,       setNumQs]       = useState(10)
  const [qType,       setQType]       = useState('mcq')
  const [generating,  setGenerating]  = useState(false)
  const [questions,   setQuestions]   = useState([])

  const selMat     = MOCK_MATERIALS.find(m => m.id === material)
  const topicOpts  = selMat ? ['all', ...selMat.topics] : ['all']

  async function handleGenerate(e) {
    e.preventDefault()
    if (!material) { toast.error('Select a material first.'); return }
    setGenerating(true); setStep(2)
    await new Promise(r => setTimeout(r, 3000))
    setQuestions(MOCK_GENERATED)
    toast.success(`Generated ${MOCK_GENERATED.length} questions! Review them below.`)
    setGenerating(false); setStep(3)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Generate AI Questions</h1>
        <p className="text-slate-400 text-sm mt-1">Gemini will analyze your material and create validated questions</p>
      </div>

      {/* Config form (step 1) */}
      {step === 1 && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="card p-6 space-y-5">
          <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-indigo-400" /> Select Material</h3>
          <div className="space-y-2">
            {MOCK_MATERIALS.map(mat => (
              <button key={mat.id} onClick={() => setMaterial(mat.id)} className="w-full text-left p-3.5 rounded-xl transition-all"
                      style={{ border:`1px solid ${material===mat.id?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.08)'}`, background:material===mat.id?'rgba(99,102,241,0.1)':'rgba(255,255,255,0.03)' }}>
                <p className="font-medium text-white text-sm">{mat.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">{mat.topics.map(t=><span key={t} className="badge badge-primary text-[11px]">{t}</span>)}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Topic</label>
            <div className="flex flex-wrap gap-2">
              {topicOpts.map(t=>(
                <button key={t} onClick={()=>setTopic(t)} className="px-3 py-1.5 rounded-xl text-xs transition-all"
                        style={{ border:`1px solid ${topic===t?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.1)'}`, background:topic===t?'rgba(99,102,241,0.15)':'transparent', color:topic===t?'#818cf8':'#94a3b8' }}>
                  {t==='all'?'All Topics':t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.filter(d=>d.value!=='mixed').map(d=>(
                  <button key={d.value} onClick={()=>setDifficulty(d.value)} className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ border:`1px solid ${difficulty===d.value?`${d.color}60`:'rgba(255,255,255,0.08)'}`, background:difficulty===d.value?`${d.color}15`:'transparent', color:difficulty===d.value?d.color:'#94a3b8' }}>
                    {d.emoji} {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Questions: <span className="text-white font-bold">{numQs}</span></label>
              <input type="range" min={5} max={30} step={5} value={numQs} onChange={e=>setNumQs(+e.target.value)} className="w-full accent-indigo-500 mt-3" />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!material} className={`btn-primary w-full gap-2 py-3.5 ${!material?'opacity-50 cursor-not-allowed':''}`} style={{ justifyContent:'center' }}>
            <Sparkles size={18} /> Generate {numQs} Questions with Gemini AI
          </button>
        </motion.div>
      )}

      {/* Generating */}
      {step === 2 && (
        <div className="card p-12 text-center space-y-4">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 0 40px rgba(99,102,241,0.4)' }}>
            <Brain size={36} className="text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white">Gemini is analyzing your material…</h3>
          <p className="text-slate-400 text-sm">Extract → Clean → Chunk → AI → Validate → Done</p>
          <div className="flex justify-center gap-1">
            {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />)}
          </div>
        </div>
      )}

      {/* Questions preview */}
      {step === 3 && questions.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-white">{questions.length} Questions Generated</p>
            <div className="flex gap-2">
              <button onClick={()=>setStep(1)} className="btn-secondary btn-sm">Regenerate</button>
              <button onClick={()=>toast.success('Sent to Question Review!')} className="btn-success btn-sm">Send to Review →</button>
            </div>
          </div>
          {questions.map((q,i)=>(
            <div key={q.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-white">{i+1}. {q.question}</p>
                <div className="flex gap-1.5 flex-shrink-0">
                  <span className="badge badge-primary text-[11px]">{q.type}</span>
                  <span className="badge badge-warning text-[11px]">{q.difficulty}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt,j)=>(
                  <div key={j} className={`text-xs p-2 rounded-lg ${opt===q.correct?'bg-green-500/15 border border-green-500/30 text-green-400':'bg-white/[0.04] text-slate-400'}`}>
                    {['A','B','C','D'][j]}. {opt}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic">💡 {q.explanation}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
