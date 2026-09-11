import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8,          label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p),        label: 'One uppercase letter'  },
  { test: (p) => /\d/.test(p),           label: 'One number'            },
]

export default function RegisterPage() {
  const [searchParams]  = useSearchParams()
  const defaultRole     = searchParams.get('role') || 'student'

  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [role,       setRole]       = useState(defaultRole)
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [googleLoad, setGoogleLoad] = useState(false)
  const [error,      setError]      = useState('')

  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const pwdChecks = PASSWORD_RULES.map(r => ({ ...r, pass: r.test(password) }))

  async function handleRegister(e) {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (!pwdChecks.every(c => c.pass)) { setError('Password does not meet requirements.'); return }
    try {
      setLoading(true); setError('')
      await register(name, email, password, role)
      toast.success('Account created! Welcome to AI Gamified Platform 🎉')
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.message || 'Registration failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleRegister() {
    try {
      setGoogleLoad(true); setError('')
      await googleLogin(role)
      toast.success('Account created with Google! 🎉')
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      setError(err.message || 'Google sign-up failed.')
    } finally {
      setGoogleLoad(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f1e' }}>
      {/* ── Left panel ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden flex-col items-center justify-center p-12"
           style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(99,102,241,0.1) 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="orb orb-cyan   w-80 h-80 animate-float"      style={{ top: '-10%', right: '-10%' }} />
        <div className="orb orb-purple w-72 h-72 animate-float-slow" style={{ bottom: '-10%', left: '-5%' }} />
        <div className="relative z-10 text-center space-y-6">
          <div className="text-6xl mb-4 animate-float">🚀</div>
          <h1 className="text-3xl font-extrabold text-white">
            Start Your <span className="gradient-text">Learning Adventure</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Upload a PDF, let Gemini AI generate questions, play games, track your progress, and master any subject.
          </p>
          <div className="space-y-3 text-left">
            {[
              '✅ AI-generated questions from your material',
              '✅ 4 interactive game modes',
              '✅ Weak topic detection + revision',
              '✅ XP, badges, leaderboard',
              '✅ Free forever for students',
            ].map((item, i) => (
              <p key={i} className="text-sm text-slate-300">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🎮</div>
            <span className="font-bold text-white text-lg">AI Gamified Platform</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">Create account</h2>
          <p className="text-slate-400 mb-6">
            Already have one? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in →</Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'student', emoji: '🎓', label: 'I am a Student' },
              { value: 'teacher', emoji: '👨‍🏫', label: 'I am a Teacher' },
            ].map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className="p-4 rounded-xl text-center transition-all duration-200"
                style={{
                  border: `1px solid ${role === r.value ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  background: role === r.value ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                }}
              >
                <div className="text-2xl mb-1">{r.emoji}</div>
                <p className="text-sm font-medium text-white">{r.label}</p>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-4 text-sm"
                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google sign-up */}
          <button onClick={handleGoogleRegister} disabled={googleLoad}
                  className="btn-secondary w-full gap-3 mb-5 py-3" style={{ justifyContent: 'center' }}>
            {googleLoad ? (
              <div className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            )}
            <span>{googleLoad ? 'Creating account…' : 'Sign up with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-slate-600">or with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tejas Gaikwad"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2 space-y-1">
                  {pwdChecks.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className={c.pass ? 'text-green-400' : 'text-slate-600'} />
                      <span className={`text-[11px] ${c.pass ? 'text-green-400' : 'text-slate-600'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 mt-2 gap-2" style={{ justifyContent: 'center' }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{loading ? 'Creating account…' : `Create ${role === 'teacher' ? 'Teacher' : 'Student'} Account`}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
