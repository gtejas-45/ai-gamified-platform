import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { STUDENT_NAV, TEACHER_NAV } from '../../utils/constants'
import { getLevelFromXP, getLevelProgress } from '../../utils/helpers'
import {
  LayoutDashboard, Users, FileText, Gamepad2, Trophy, Star,
  BarChart2, Bot, UserCircle, School, CheckSquare, Sparkles,
  LogOut, ChevronRight, X,
} from 'lucide-react'

const ICON_MAP = {
  LayoutDashboard, Users, FileText, Gamepad2, Trophy, Star,
  BarChart2, Bot, UserCircle, School, CheckSquare, Sparkles,
}

function SidebarLink({ item, onClick }) {
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? 'active' : ''}`
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const { userProfile, logout } = useAuth()
  const navigate   = useNavigate()
  const role       = userProfile?.role ?? 'student'
  const navItems   = role === 'teacher' ? TEACHER_NAV : STUDENT_NAV
  const xp         = userProfile?.xp ?? 0
  const level      = getLevelFromXP(xp)
  const progress   = getLevelProgress(xp)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      {/* Backdrop overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <span className="text-base">🎮</span>
            </div>
            <span className="font-bold text-sm text-white">AI Gamified Platform</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Profile card ─────────────────────────────────────── */}
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3">
            {userProfile?.profileImage ? (
              <img src={userProfile.profileImage} alt="avatar"
                   className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                   style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {(userProfile?.name?.[0] ?? '?').toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userProfile?.name ?? 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs">{level.emoji}</span>
                <span className="text-xs text-slate-400">{level.name}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{xp.toLocaleString()} XP</span>
              <span>Lv {level.level}</span>
            </div>
            <div className="xp-bar" style={{ height: '6px' }}>
              <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className="px-3 py-2 flex-1 overflow-y-auto">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2 mt-1">
            {role === 'teacher' ? 'Teacher' : 'Student'} Menu
          </p>
          {navItems.map(item => (
            <SidebarLink key={item.path} item={item} onClick={onClose} />
          ))}
        </nav>

        {/* ── Logout ──────────────────────────────────────────── */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
