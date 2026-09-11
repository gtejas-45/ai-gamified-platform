import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Brain, Gamepad2, Trophy, BarChart2, Zap, Users,
  ArrowRight, CheckCircle, Star, ChevronRight, Play,
  BookOpen, FileText, Bot, Sparkles, Target, TrendingUp,
  Shield, Globe, Clock, Award
} from 'lucide-react'

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// ── Floating card mini-preview ────────────────────────────────────────────────
function FloatingCard({ style, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="glass-card p-4 shadow-card"
      style={{ position: 'absolute', ...style }}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: Brain, color: '#6366f1', title: 'AI Question Generation',
    desc: 'Gemini AI analyzes your PDFs and creates structured MCQs, true/false, and sequence questions automatically.',
  },
  {
    icon: Gamepad2, color: '#06b6d4', title: '4 Game Modes',
    desc: 'Quiz, Memory Match, Sequence Builder, and Drag & Drop — each with timers, scoring, and instant feedback.',
  },
  {
    icon: BarChart2, color: '#8b5cf6', title: 'Performance Analytics',
    desc: 'Track accuracy, XP, streaks, and topic-wise mastery with interactive Recharts visualizations.',
  },
  {
    icon: Target, color: '#f59e0b', title: 'Weak Topic Detection',
    desc: 'The system identifies topics where you score below 60% and generates personalized revision games.',
  },
  {
    icon: TrendingUp, color: '#10b981', title: 'Adaptive Learning (ML)',
    desc: 'scikit-learn model predicts student performance and recommends the right difficulty level.',
  },
  {
    icon: Bot, color: '#ef4444', title: 'AI Doubt Assistant',
    desc: 'Chat with an AI tutor powered by Gemini — answers are grounded in your uploaded study material.',
  },
]

const steps = [
  { n: '01', icon: FileText,  color: '#6366f1', title: 'Upload PDF',          desc: 'Upload any study material — notes, textbook chapters, or lecture PDFs.' },
  { n: '02', icon: Sparkles,  color: '#8b5cf6', title: 'AI Generates Qs',     desc: 'Gemini extracts topics, cleans text, and generates validated JSON questions.' },
  { n: '03', icon: Gamepad2,  color: '#06b6d4', title: 'Play Games',          desc: 'Choose from Quiz, Memory Match, Sequence Builder, or Drag & Drop.' },
  { n: '04', icon: TrendingUp,color: '#10b981', title: 'Track & Improve',     desc: 'Review analytics, identify weak topics, and play targeted revision games.' },
]

const gameTypes = [
  { emoji: '🧠', name: 'Quiz',             color: 'from-indigo-600 to-purple-600',  desc: 'MCQs + True/False with 30s timer' },
  { emoji: '🃏', name: 'Memory Match',     color: 'from-cyan-500  to-blue-600',     desc: 'Flip cards, match Q&A pairs'      },
  { emoji: '🔢', name: 'Sequence Builder', color: 'from-purple-600 to-pink-600',    desc: 'Arrange concepts in correct order' },
  { emoji: '🎯', name: 'Drag & Drop',      color: 'from-amber-500 to-orange-600',   desc: 'Drag items into correct categories'},
]

const testimonials = [
  { name: 'Priya Sharma',   role: 'B.Tech Student, Mumbai',    rating: 5, text: 'My DBMS score went from 45% to 82% in 2 weeks just by playing revision games. The weak topic detection is spot on!' },
  { name: 'Rahul Desai',    role: 'Computer Engineering, Pune', rating: 5, text: 'As a teacher, I used to spend hours creating quizzes. Now Gemini generates 20 questions from a PDF in seconds. Incredible!' },
  { name: 'Sneha Kulkarni', role: 'MCA Student, Nashik',       rating: 5, text: 'The Memory Match game made me remember OS concepts I had forgotten. The gamification keeps me motivated every day.' },
]

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════════════════
           NAVBAR
      ══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16"
           style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🎮</div>
            <span className="font-bold text-white text-lg">AI Gamified <span className="gradient-text">Platform</span></span>
          </Link>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'Games', 'About'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`}
                 className="text-sm text-slate-400 hover:text-white transition-colors no-underline cursor-pointer">
                {link}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary btn-sm no-underline">Log In</Link>
            <Link to="/register" className="btn-primary btn-sm no-underline">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
           HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background orbs */}
        <div className="orb orb-purple w-96 h-96 animate-float"       style={{ top: '5%',  left: '5%'   }} />
        <div className="orb orb-violet w-80 h-80 animate-float-slow"  style={{ top: '20%', right: '8%'  }} />
        <div className="orb orb-cyan   w-64 h-64 animate-float"       style={{ bottom:'15%',left:'20%', animationDelay: '3s' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y:   0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 badge badge-primary text-sm"
          >
            <Sparkles size={14} />
            <span>Powered by Google Gemini AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            Turn Study Materials Into
            <br />
            <span className="gradient-text">Epic Learning Games</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload any PDF → AI generates questions → Play games → Track performance →
            Identify weak topics → Get personalized revision. <span className="text-indigo-400 font-semibold">Completely free.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="btn-primary no-underline text-base px-8 py-4 rounded-2xl gap-2 group">
              <span>Get Started Free</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="btn-secondary no-underline text-base px-8 py-4 rounded-2xl gap-2">
              <Play size={16} className="fill-current" />
              <span>See How It Works</span>
            </a>
          </motion.div>

          {/* Floating preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative mx-auto max-w-4xl h-72"
          >
            {/* Main preview */}
            <div className="glass-card mx-auto w-full max-w-xl p-5 shadow-card-hover">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">🧠 OS Quiz – Question 3/10</span>
                <span className="badge badge-warning">⏱ 24s</span>
              </div>
              <p className="text-slate-300 text-sm mb-4 font-medium">Which scheduling algorithm gives the shortest average waiting time?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {['FCFS', 'SJF (Shortest Job First)', 'Round Robin', 'Priority Scheduling'].map((opt, i) => (
                  <div key={i} className={`quiz-option text-xs ${i === 1 ? 'correct' : ''}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 1 ? 'bg-green-500' : 'bg-white/10'}`}>
                      {['A','B','C','D'][i]}
                    </div>
                    <span>{opt}</span>
                    {i === 1 && <CheckCircle size={14} className="ml-auto text-green-400" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="progress-bar flex-1 h-1.5">
                  <div className="progress-bar-fill" style={{ width: '30%' }} />
                </div>
                <span className="text-xs text-slate-500">3/10</span>
              </div>
            </div>

            {/* Floating XP card */}
            <FloatingCard style={{ top: '-10px', right: '-20px', width: '140px' }} delay={0.8}>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 mb-1">XP Earned</p>
                <p className="text-2xl font-bold gradient-text-gold">+15 XP</p>
                <p className="text-[10px] text-slate-500 mt-1">⚡ Fast Bonus!</p>
              </div>
            </FloatingCard>

            {/* Floating streak card */}
            <FloatingCard style={{ bottom: '-10px', left: '-20px', width: '160px' }} delay={1.0}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-xs font-bold text-white">7-Day Streak</p>
                  <p className="text-[10px] text-slate-500">Keep it up!</p>
                </div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y border-white/[0.06]"
               style={{ background: 'rgba(99,102,241,0.04)' }}>
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 10000, suffix: '+', label: 'Students' },
            { value: 500,   suffix: 'K+',label: 'Questions Generated' },
            { value: 98,    suffix: '%', label: 'Satisfaction Rate' },
            { value: 4,     suffix: '',  label: 'Game Modes' },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-4xl font-extrabold gradient-text mb-1">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-5">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="badge badge-primary mb-4">✨ Key Features</span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Everything You Need to <span className="gradient-text">Learn Smarter</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A complete ecosystem that transforms passive study into active, gamified learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card p-6 group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                     style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 border-y border-white/[0.06]"
               style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto px-5">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="badge badge-cyan mb-4">🔄 The Process</span>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-3/4 w-full h-px"
                         style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.5), transparent)' }} />
                  )}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
                       style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                    <Icon size={26} style={{ color: step.color }} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                          style={{ background: step.color }}>
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           GAME TYPES
      ══════════════════════════════════════════════════════════ */}
      <section id="games" className="py-24 max-w-7xl mx-auto px-5">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="badge badge-warning mb-4">🎮 Game Modes</span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            4 Ways to <span className="gradient-text">Master Any Topic</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameTypes.map((g, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="game-card text-center"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl bg-gradient-to-br ${g.color}`}>
                {g.emoji}
              </div>
              <h3 className="font-bold text-white mb-2">{g.name}</h3>
              <p className="text-xs text-slate-400">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 border-y border-white/[0.06]"
               style={{ background: 'rgba(139,92,246,0.04)' }}>
        <div className="max-w-3xl mx-auto px-5 text-center">
          <span className="badge badge-success mb-6">⭐ Testimonials</span>
          <h2 className="text-4xl font-extrabold text-white mb-12">What Students Say</h2>

          <div className="relative" style={{ minHeight: '180px' }}>
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={false}
                animate={{ opacity: i === activeTestimonial ? 1 : 0, y: i === activeTestimonial ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{ pointerEvents: i === activeTestimonial ? 'auto' : 'none' }}
              >
                <div className="glass-card p-8">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={18} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{ background: i === activeTestimonial ? '#6366f1' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           TECH STACK
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 max-w-5xl mx-auto px-5 text-center">
        <p className="text-sm text-slate-600 mb-6 uppercase tracking-widest">Built With</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['⚛️ React', '🐍 Flask', '🔥 Firebase', '✨ Gemini AI', '📄 PyMuPDF', '🤖 scikit-learn'].map(t => (
            <span key={t} className="badge badge-primary text-sm px-4 py-2">{t}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-purple w-96 h-96" style={{ top: '-20%', left: '20%', opacity: 0.6 }} />
        <div className="orb orb-cyan   w-72 h-72" style={{ bottom: '-20%', right: '15%', opacity: 0.5 }} />
        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl font-extrabold text-white mb-6">
              Ready to Learn <span className="gradient-text">Smarter?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Join students who are transforming boring PDFs into engaging, personalized learning adventures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register?role=student" className="btn-primary no-underline text-base px-10 py-4 rounded-2xl gap-2">
                I'm a Student <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=teacher" className="btn-secondary no-underline text-base px-10 py-4 rounded-2xl gap-2">
                I'm a Teacher <ChevronRight size={18} />
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { icon: Shield,  text: 'No credit card needed' },
                { icon: Globe,   text: 'Works in any language'  },
                { icon: Clock,   text: 'Set up in 2 minutes'    },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Icon size={14} className="text-indigo-400" />
                    <span>{item.text}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="py-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🎮</div>
            <span className="font-bold text-white">AI Gamified Platform</span>
          </div>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} AI Gamified Platform · Final-Year CE Project · Built with ❤️ using React + Flask + Gemini
          </p>
          <div className="flex gap-4">
            <Link to="/login"    className="text-sm text-slate-500 hover:text-white transition-colors no-underline">Login</Link>
            <Link to="/register" className="text-sm text-slate-500 hover:text-white transition-colors no-underline">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
