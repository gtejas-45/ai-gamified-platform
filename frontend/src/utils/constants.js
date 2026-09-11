// ─── Levels ──────────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: 'Beginner',  minXP: 0,    maxXP: 199,  color: '#94a3b8', emoji: '🌱' },
  { level: 2, name: 'Learner',   minXP: 200,  maxXP: 499,  color: '#10b981', emoji: '📚' },
  { level: 3, name: 'Explorer',  minXP: 500,  maxXP: 999,  color: '#06b6d4', emoji: '🔭' },
  { level: 4, name: 'Skilled',   minXP: 1000, maxXP: 1999, color: '#6366f1', emoji: '⚡' },
  { level: 5, name: 'Expert',    minXP: 2000, maxXP: 3999, color: '#8b5cf6', emoji: '🏆' },
  { level: 6, name: 'Master',    minXP: 4000, maxXP: 7999, color: '#f59e0b', emoji: '👑' },
  { level: 7, name: 'Legend',    minXP: 8000, maxXP: Infinity, color: '#ef4444', emoji: '🌟' },
]

// ─── XP Rules ────────────────────────────────────────────────────────────────
export const XP_RULES = {
  CORRECT_ANSWER:   10,
  FAST_ANSWER:       5,   // bonus for answer within 5 seconds
  GAME_COMPLETE:    20,
  PERFECT_GAME:     50,
  DAILY_STREAK:     10,
  FIRST_GAME:       25,
}

// ─── Scoring ─────────────────────────────────────────────────────────────────
export const SCORE_RULES = {
  CORRECT_ANSWER:    10,
  FAST_BONUS_SECS:    5,  // if answered within this many seconds → bonus
  FAST_BONUS_POINTS:  5,
}

// ─── Badges ──────────────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'first_game',    name: 'First Step',      description: 'Completed your first game',          emoji: '🎮', color: '#6366f1' },
  { id: 'streak_3',      name: 'On Fire',          description: '3-day learning streak',              emoji: '🔥', color: '#ef4444' },
  { id: 'streak_7',      name: 'Week Warrior',     description: '7-day learning streak',              emoji: '⚔️', color: '#f59e0b' },
  { id: 'perfect_quiz',  name: 'Perfect Score',    description: 'Got 100% on a quiz',                 emoji: '💯', color: '#10b981' },
  { id: 'speed_demon',   name: 'Speed Demon',      description: 'Answered 10 questions in under 5s',  emoji: '⚡', color: '#06b6d4' },
  { id: 'games_5',       name: 'Player',           description: 'Completed 5 games',                  emoji: '🏅', color: '#8b5cf6' },
  { id: 'games_25',      name: 'Veteran',          description: 'Completed 25 games',                 emoji: '🏆', color: '#f59e0b' },
  { id: 'quiz_master',   name: 'Quiz Master',      description: 'Completed 10 quizzes',               emoji: '🧠', color: '#6366f1' },
  { id: 'memory_pro',    name: 'Memory Pro',       description: 'Won 5 Memory Match games',           emoji: '🃏', color: '#06b6d4' },
  { id: 'level_3',       name: 'Explorer Badge',   description: 'Reached Level 3',                    emoji: '🔭', color: '#06b6d4' },
  { id: 'level_5',       name: 'Expert Badge',     description: 'Reached Level 5',                    emoji: '🌟', color: '#f59e0b' },
  { id: 'accuracy_90',   name: 'Sharpshooter',     description: 'Maintained 90%+ accuracy',           emoji: '🎯', color: '#10b981' },
  { id: 'revision_done', name: 'Self Improver',    description: 'Completed a revision game',          emoji: '📈', color: '#8b5cf6' },
]

// ─── Difficulty Options ───────────────────────────────────────────────────────
export const DIFFICULTY_OPTIONS = [
  { value: 'easy',   label: 'Easy',   color: '#10b981', emoji: '🟢' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', emoji: '🟡' },
  { value: 'hard',   label: 'Hard',   color: '#ef4444', emoji: '🔴' },
  { value: 'mixed',  label: 'Mixed',  color: '#6366f1', emoji: '🎲' },
]

// ─── Game Types ───────────────────────────────────────────────────────────────
export const GAME_TYPES = [
  {
    id:          'quiz',
    name:        'Quiz',
    description: 'Multiple choice questions with timer and instant feedback',
    emoji:       '🧠',
    color:       '#6366f1',
    gradient:    'from-indigo-600 to-purple-600',
  },
  {
    id:          'memory_match',
    name:        'Memory Match',
    description: 'Flip cards to match questions with their answers',
    emoji:       '🃏',
    color:       '#06b6d4',
    gradient:    'from-cyan-500 to-blue-600',
  },
  {
    id:          'sequence',
    name:        'Sequence Builder',
    description: 'Arrange steps or concepts in the correct order',
    emoji:       '🔢',
    color:       '#8b5cf6',
    gradient:    'from-purple-600 to-pink-600',
  },
  {
    id:          'drag_drop',
    name:        'Drag & Drop',
    description: 'Drag items into the correct categories',
    emoji:       '🎯',
    color:       '#f59e0b',
    gradient:    'from-amber-500 to-orange-600',
  },
]

// ─── Question Types ───────────────────────────────────────────────────────────
export const QUESTION_TYPES = [
  { value: 'mcq',       label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False'   },
  { value: 'sequence',  label: 'Sequence'         },
  { value: 'drag_drop', label: 'Drag & Drop'      },
]

// ─── Question Statuses ────────────────────────────────────────────────────────
export const QUESTION_STATUS = {
  PENDING:  'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// ─── Mastery Levels ───────────────────────────────────────────────────────────
export const MASTERY = {
  WEAK:   { label: 'Weak',   color: '#ef4444', minAccuracy: 0,   maxAccuracy: 59  },
  MEDIUM: { label: 'Medium', color: '#f59e0b', minAccuracy: 60,  maxAccuracy: 79  },
  STRONG: { label: 'Strong', color: '#10b981', minAccuracy: 80,  maxAccuracy: 100 },
}

// ─── Languages ───────────────────────────────────────────────────────────────
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English',  flag: '🇬🇧' },
  { value: 'hi', label: 'Hindi',    flag: '🇮🇳' },
  { value: 'mr', label: 'Marathi',  flag: '🇮🇳' },
]

// ─── Quiz Timer ───────────────────────────────────────────────────────────────
export const QUIZ_TIMER_SECS = 30   // seconds per question
export const FAST_ANSWER_SECS = 5   // threshold for fast-answer bonus

// ─── File Upload ──────────────────────────────────────────────────────────────
export const MAX_FILE_SIZE_MB   = 20
export const ALLOWED_FILE_TYPES = ['application/pdf']

// ─── API Base ─────────────────────────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// ─── Nav links ───────────────────────────────────────────────────────────────
export const STUDENT_NAV = [
  { path: '/student/dashboard',   label: 'Dashboard',    icon: 'LayoutDashboard' },
  { path: '/student/classrooms',  label: 'Classrooms',   icon: 'Users'           },
  { path: '/student/materials',   label: 'Materials',    icon: 'FileText'        },
  { path: '/student/games',       label: 'My Games',     icon: 'Gamepad2'        },
  { path: '/student/leaderboard', label: 'Leaderboard',  icon: 'Trophy'          },
  { path: '/student/achievements',label: 'Achievements', icon: 'Star'            },
  { path: '/student/analytics',   label: 'Analytics',    icon: 'BarChart2'       },
  { path: '/student/assistant',   label: 'AI Assistant', icon: 'Bot'             },
  { path: '/student/profile',     label: 'Profile',      icon: 'UserCircle'      },
]

export const TEACHER_NAV = [
  { path: '/teacher/dashboard',   label: 'Dashboard',        icon: 'LayoutDashboard' },
  { path: '/teacher/classrooms',  label: 'Classrooms',       icon: 'School'          },
  { path: '/teacher/students',    label: 'Students',         icon: 'Users'           },
  { path: '/teacher/materials',   label: 'Materials',        icon: 'FileText'        },
  { path: '/teacher/generate',    label: 'Generate AI Qs',   icon: 'Sparkles'        },
  { path: '/teacher/review',      label: 'Question Review',  icon: 'CheckSquare'     },
  { path: '/teacher/games',       label: 'Games',            icon: 'Gamepad2'        },
  { path: '/teacher/analytics',   label: 'Analytics',        icon: 'BarChart2'       },
  { path: '/teacher/profile',     label: 'Profile',          icon: 'UserCircle'      },
]
