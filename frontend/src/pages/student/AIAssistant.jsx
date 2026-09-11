import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, BookOpen, Loader2, X } from 'lucide-react'

const SUGGESTIONS = [
  'What is polymorphism?',
  'Explain CPU scheduling algorithms',
  'What is normalization in DBMS?',
  'How does memory management work?',
]

const MOCK_RESPONSES = {
  default: (q) => `Based on your study material, here is the answer to your question about **${q.slice(0, 30)}**:\n\nThis concept refers to a fundamental principle in computer science. Let me explain it clearly:\n\n1. **Definition**: The core meaning of this topic\n2. **Example**: A practical application\n3. **Key Points**: What you need to remember for your exam\n\nWould you like me to create a quiz question based on this concept? 🎮`,
}

function ChatMessage({ msg }) {
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
           style={{ background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-cyan-400" />}
      </div>
      <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'rounded-tr-sm text-white'
          : 'rounded-tl-sm text-slate-300'
        }`}
        style={{
          background: msg.role === 'user'
            ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
            : 'rgba(255,255,255,0.05)',
          border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}>
        {msg.content.split('\n').map((line, i) => {
          if (!line.trim()) return <br key={i} />
          if (line.startsWith('**') && line.endsWith('**')) {
            return <strong key={i} className="text-white">{line.slice(2,-2)}</strong>
          }
          return <p key={i}>{line}</p>
        })}
        {msg.loading && (
          <div className="flex gap-1 mt-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                   style={{ animationDelay:`${i*0.15}s` }} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: "Hi! 👋 I'm your AI study assistant powered by Gemini.\n\nI can answer questions based on your uploaded study materials.\n\nAsk me anything about your subjects — I'll explain concepts, give examples, and help you prepare for exams! 🎓",
    },
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [selMat,   setSelMat]   = useState('all')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function sendMessage(text) {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', content: q }
    const loadMsg = { id: Date.now() + 1, role: 'assistant', content: '', loading: true }
    setMessages(prev => [...prev, userMsg, loadMsg])
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))   // mock AI delay
    const answer = MOCK_RESPONSES.default(q)
    setMessages(prev => prev.map(m => m.id === loadMsg.id ? { ...m, content: answer, loading: false } : m))
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bot className="text-cyan-400" size={24} /> AI Doubt Assistant
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ask questions based on your study materials</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Gemini Connected</span>
        </div>
      </div>

      {/* Material selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all','Operating Systems','DBMS','Java OOP'].map(m => (
          <button key={m} onClick={() => setSelMat(m)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={{ background: selMat===m ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)', color: selMat===m ? '#22d3ee' : '#64748b', border: `1px solid ${selMat===m ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
            <BookOpen size={11} className="inline mr-1" />
            {m === 'all' ? 'All Materials' : m}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-2 rounded-xl transition-all"
                    style={{ background:'rgba(99,102,241,0.08)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.2)' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask anything about your study material…"
            rows={1}
            className="input-field resize-none pr-12"
            style={{ minHeight:'48px', maxHeight:'120px' }}
          />
          <span className="absolute right-3 bottom-3 text-[10px] text-slate-600">Enter to send</span>
        </div>
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                className="btn-primary w-12 h-12 p-0 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  )
}
