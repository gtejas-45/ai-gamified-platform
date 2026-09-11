import { LEVELS, MASTERY, XP_RULES } from './constants'

// ─── Level helpers ────────────────────────────────────────────────────────────
/**
 * Returns the level object for a given total XP amount.
 */
export function getLevelFromXP(xp = 0) {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) ?? LEVELS[0]
}

/**
 * Returns percentage progress toward the next level (0–100).
 */
export function getLevelProgress(xp = 0) {
  const current = getLevelFromXP(xp)
  if (current.maxXP === Infinity) return 100
  const range = current.maxXP - current.minXP + 1
  const done  = xp - current.minXP
  return Math.min(100, Math.round((done / range) * 100))
}

// ─── XP calculation ───────────────────────────────────────────────────────────
/**
 * Calculates XP earned from a single answer.
 * @param {boolean} isCorrect
 * @param {number}  timeTakenSecs
 */
export function calculateAnswerXP(isCorrect, timeTakenSecs = 99) {
  if (!isCorrect) return 0
  let xp = XP_RULES.CORRECT_ANSWER
  if (timeTakenSecs <= 5) xp += XP_RULES.FAST_ANSWER
  return xp
}

// ─── Accuracy ────────────────────────────────────────────────────────────────
export function calcAccuracy(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

// ─── Topic mastery ────────────────────────────────────────────────────────────
export function getMasteryLevel(accuracy = 0) {
  if (accuracy >= MASTERY.STRONG.minAccuracy) return MASTERY.STRONG
  if (accuracy >= MASTERY.MEDIUM.minAccuracy) return MASTERY.MEDIUM
  return MASTERY.WEAK
}

// ─── Weak topics ─────────────────────────────────────────────────────────────
/**
 * Returns topics where accuracy < 60%, sorted worst first.
 * @param {Array<{topic: string, accuracy: number}>} topicStats
 */
export function getWeakTopics(topicStats = []) {
  return topicStats
    .filter(t => t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
}

// ─── String helpers ───────────────────────────────────────────────────────────
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str = '', maxLength = 60) {
  return str.length <= maxLength ? str : str.slice(0, maxLength - 3) + '...'
}

// ─── Classroom code generator ─────────────────────────────────────────────────
export function generateClassroomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ─── Time formatting ──────────────────────────────────────────────────────────
export function formatSeconds(secs = 0) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function formatRelativeTime(dateOrTimestamp) {
  const date = dateOrTimestamp?.toDate ? dateOrTimestamp.toDate() : new Date(dateOrTimestamp)
  const diff = Date.now() - date.getTime()
  const m    = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const d    = Math.floor(diff / 86400000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7)  return `${d}d ago`
  return date.toLocaleDateString()
}

// ─── File validation ──────────────────────────────────────────────────────────
export function validatePDF(file) {
  const MAX_BYTES = 20 * 1024 * 1024   // 20 MB
  if (!file)                             return { valid: false, error: 'No file selected.' }
  if (file.type !== 'application/pdf')   return { valid: false, error: 'Only PDF files are allowed.' }
  if (file.size > MAX_BYTES)             return { valid: false, error: 'File is too large (max 20 MB).' }
  return { valid: true, error: null }
}

// ─── Score helpers ────────────────────────────────────────────────────────────
export function getRankSuffix(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

// ─── Color for accuracy ───────────────────────────────────────────────────────
export function accuracyColor(pct) {
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#f59e0b'
  return '#ef4444'
}

// ─── Shuffle array ────────────────────────────────────────────────────────────
export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Delay helper ─────────────────────────────────────────────────────────────
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
