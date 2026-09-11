import { motion } from 'framer-motion'
import { BADGES } from '../../utils/constants'

const MOCK_UNLOCKED = ['first_game', 'streak_3', 'games_5', 'quiz_master', 'accuracy_90']

export default function Achievements() {
  const unlocked = new Set(MOCK_UNLOCKED)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Achievements</h1>
        <p className="text-slate-400 text-sm mt-1">
          {MOCK_UNLOCKED.length}/{BADGES.length} badges unlocked
        </p>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-white">Overall Progress</p>
          <span className="badge badge-success">{Math.round((MOCK_UNLOCKED.length/BADGES.length)*100)}% Complete</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-bar-fill" style={{ width: `${(MOCK_UNLOCKED.length/BADGES.length)*100}%`, background: 'linear-gradient(90deg,#10b981,#06b6d4)' }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">{BADGES.length - MOCK_UNLOCKED.length} badges remaining</p>
      </div>

      {/* Unlocked */}
      <div>
        <h3 className="font-bold text-white mb-3">🏆 Unlocked ({MOCK_UNLOCKED.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BADGES.filter(b => unlocked.has(b.id)).map((badge, i) => (
            <motion.div key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="achievement-card unlocked"
            >
              <div className="text-4xl mb-3">{badge.emoji}</div>
              <p className="text-sm font-bold text-white">{badge.name}</p>
              <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked */}
      <div>
        <h3 className="font-bold text-white mb-3">🔒 Locked ({BADGES.length - MOCK_UNLOCKED.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BADGES.filter(b => !unlocked.has(b.id)).map((badge, i) => (
            <div key={badge.id} className="achievement-card opacity-40 grayscale">
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-sm font-bold text-white">{badge.name}</p>
              <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
