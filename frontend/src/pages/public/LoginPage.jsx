import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [googleLoad,  setGoogleLoad]  = useState(false)
  const [error,       setError]       = useState('')

  const { login, googleLogin, demoLogin, userProfile } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || null

  function getRoleHome(role) {
    if (role === 'teacher') return '/teacher/dashboard'
    if (role === 'admin')   return '/admin/dashboard'
    return '/student/dashboard'
  }

  function handleDemoLogin(role) {
    try {
      const user = demoLogin(role)
      toast.success(`Logged in as Demo ${role.toUpperCase()}! 🎉`)
      navigate(getRoleHome(role))
    } catch (err) {
      setError('Demo login failed.')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    try {
      setLoading(true); setError('')
      const res = await login(email, password)
      toast.success('Welcome back! 🎉')
      const targetRole = res?.user?.role || (email.includes('teacher') ? 'teacher' : (email.includes('admin') ? 'admin' : 'student'))
      setTimeout(() => {
        navigate(from || getRoleHome(targetRole))
      }, 100)
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoad(true); setError('')
      await googleLogin()
      toast.success('Logged in with Google! 🎉')
      setTimeout(() => navigate(from || '/student/dashboard'), 200)
    } catch (err) {
      setError(err.message || 'Google login failed.')
    } finally {
      setGoogleLoad(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f1e' }}>
      {/* ── Left decorative panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
           style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="orb orb-purple w-96 h-96 animate-float"      style={{ top: '0%',   left: '-10%' }} />
        <div className="orb orb-cyan   w-72 h-72 animate-float-slow" style={{ bottom: '0%', right: '-5%' }} />
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 60px rgba(99,102,241,0.5)' }}>
            🎮
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome Back to <span className="gradient-text">AI Gamified Platform</span>
          </h1>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Continue your learning journey. Your XP, streaks, and progress are waiting.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { emoji: '🧠', label: 'AI Quiz'       },
              { emoji: '🃏', label: 'Memory Match'  },
              { emoji: '🎯', label: 'Drag & Drop'   },
            ].map((g, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{g.emoji}</div>
                <p className="text-xs text-slate-400">{g.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['A','R','S','T'].map((l,i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-800"
                     style={{ background: ['#6366f1','#8b5cf6','#06b6d4','#10b981'][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">10,000+ students learning today</p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo (mobile only) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🎮</div>
            <span className="font-bold text-white text-lg">AI Gamified Platform</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">Sign in</h2>
          <p className="text-slate-400 mb-6">
            Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Create one free →</Link>
          </p>

          {/* Quick Demo Login Box */}
          <div className="p-3.5 rounded-2xl mb-6" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 text-center">⚡ 1-Click Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleDemoLogin('student')}
                      className="px-2 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                🎓 Student
              </button>
              <button type="button" onClick={() => handleDemoLogin('teacher')}
                      className="px-2 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                👨‍🏫 Teacher
              </button>
              <button type="button" onClick={() => handleDemoLogin('admin')}
                      className="px-2 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-6 text-sm"
                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google login */}
          <button onClick={handleGoogleLogin} disabled={googleLoad}
                  className="btn-secondary w-full gap-3 mb-6 py-3"
                  style={{ justifyContent: 'center' }}>
            {googleLoad ? (
              <div className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            )}
            <span>{googleLoad ? 'Signing in…' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </button>
              </div>
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
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 gap-2" style={{ justifyContent: 'center' }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              <span>{loading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-8">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
