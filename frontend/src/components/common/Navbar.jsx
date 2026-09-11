import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getLevelFromXP } from '../../utils/helpers'
import { Bell, Menu, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function DashboardNavbar({ onMenuClick }) {
  const { userProfile }     = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [showNotif, setShowNotif] = useState(false)
  const xp    = userProfile?.xp ?? 0
  const level = getLevelFromXP(xp)

  // Mock notifications (will be replaced with Firestore in Phase 9)
  const notifications = [
    { id: 1, text: 'New game assigned: OS Quiz', time: '5m ago',  read: false },
    { id: 2, text: 'You earned the "Player" badge!', time: '1h ago', read: false },
    { id: 3, text: 'Revision recommended for DBMS', time: '2h ago', read: true },
  ]
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16"
            style={{
              background: 'rgba(8,12,24,0.9)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginLeft: '256px',
            }}>
      <div className="flex items-center justify-between h-full px-5 md:px-6">
        {/* Left – hamburger (mobile) */}
        <button onClick={onMenuClick}
                className="md:hidden text-slate-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search games, materials, topics…"
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(v => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotif && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                   style={{ background: '#0d1226', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${!n.read ? 'bg-indigo-500/[0.04]' : ''}`}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />}
                        <div className={!n.read ? '' : 'ml-3.5'}>
                          <p className="text-sm text-slate-300">{n.text}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3">
                  <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <Link to={userProfile?.role === 'teacher' ? '/teacher/profile' : '/student/profile'}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-white/[0.05]">
              {userProfile?.profileImage ? (
                <img src={userProfile.profileImage} alt="avatar"
                     className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40" />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {(userProfile?.name?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-none">{userProfile?.name ?? 'User'}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{level.emoji} {level.name}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
