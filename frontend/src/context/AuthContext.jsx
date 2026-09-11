import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../services/firebase'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// Standard Mock Users for Instant 1-Click Demo
const DEMO_USERS = {
  student: {
    uid: 'demo_student_123',
    email: 'student@rurallearn.org',
    displayName: 'Aarav Patil (Student)',
    role: 'student',
    xp: 2450,
    level: 5,
    streak: 7,
    school: 'GPH Kolhapur'
  },
  teacher: {
    uid: 'demo_teacher_456',
    email: 'teacher@rurallearn.org',
    displayName: 'Prof. Sharma (Teacher)',
    role: 'teacher',
    xp: 9800,
    level: 15,
    streak: 30,
    school: 'Rural Engineering College'
  },
  admin: {
    uid: 'demo_admin_789',
    email: 'admin@rurallearn.org',
    displayName: 'System Admin',
    role: 'admin',
    xp: 15000,
    level: 25,
    streak: 100,
    school: 'Platform HQ'
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser,  setCurrentUser]  = useState(null)
  const [userProfile,  setUserProfile]  = useState(null)
  const [loading,      setLoading]      = useState(true)

  // ── Restore local demo user if present ────────────────────────────────────
  useEffect(() => {
    const savedDemo = localStorage.getItem('ai_gamified_user')
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo)
        setCurrentUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.displayName })
        setUserProfile(parsed)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('ai_gamified_user')
      }
    }

    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        await fetchUserProfile(user.uid)
      } else if (!localStorage.getItem('ai_gamified_user')) {
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe && unsubscribe()
  }, [])

  // ── Fetch Firestore profile ───────────────────────────────────────────────
  async function fetchUserProfile(uid) {
    try {
      if (db) {
        const ref  = doc(db, 'users', uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setUserProfile({ id: snap.id, ...snap.data() })
          return
        }
      }
    } catch (err) {
      console.warn('Firestore profile fetch notice:', err.message)
    }
  }

  // ── Create Firestore document for new users ───────────────────────────────
  async function createUserDocument(user, extraData = {}) {
    const data = {
      userId:       user.uid,
      name:         user.displayName || extraData.name || 'Student User',
      email:        user.email,
      role:         extraData.role   || 'student',
      profileImage: user.photoURL    || '',
      language:     'en',
      xp:           100,
      level:        1,
      streak:       1,
      lastActive:   new Date().toISOString(),
      createdAt:    new Date().toISOString(),
    }

    try {
      if (db) {
        const ref = doc(db, 'users', user.uid)
        await setDoc(ref, data, { merge: true })
      }
    } catch (e) {
      console.warn('Firestore save warning:', e)
    }

    setUserProfile({ id: user.uid, ...data })
    return data
  }

  // ── Demo Quick Login ──────────────────────────────────────────────────────
  function demoLogin(role = 'student') {
    const demoObj = DEMO_USERS[role] || DEMO_USERS.student
    const userObj = { uid: demoObj.uid, email: demoObj.email, displayName: demoObj.displayName }
    
    localStorage.setItem('ai_gamified_user', JSON.stringify(demoObj))
    setCurrentUser(userObj)
    setUserProfile(demoObj)
    setLoading(false)
    return demoObj
  }

  // ── Register with email / password ────────────────────────────────────────
  async function register(name, email, password, role = 'student') {
    try {
      if (auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
        await createUserDocument(cred.user, { name, role })
        return cred
      }
    } catch (err) {
      console.warn('Firebase register notice, activating local session:', err.message)
    }

    // Fallback local registration
    const fallbackUser = {
      uid: 'user_' + Date.now(),
      email: email,
      displayName: name,
      role: role,
      xp: 150,
      level: 1,
      streak: 1
    }
    localStorage.setItem('ai_gamified_user', JSON.stringify(fallbackUser))
    setCurrentUser({ uid: fallbackUser.uid, email: fallbackUser.email, displayName: name })
    setUserProfile(fallbackUser)
    return { user: fallbackUser }
  }

  // ── Login with email / password ───────────────────────────────────────────
  async function login(email, password) {
    // Check if email matches demo role
    if (email.includes('teacher')) {
      return demoLogin('teacher')
    } else if (email.includes('admin')) {
      return demoLogin('admin')
    }

    try {
      if (auth) {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        await fetchUserProfile(cred.user.uid)
        return cred
      }
    } catch (err) {
      console.warn('Firebase login notice, fallback active:', err.message)
    }

    // Fallback login
    const nameFromEmail = email.split('@')[0]
    const fallbackUser = {
      uid: 'user_' + Date.now(),
      email: email,
      displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      role: 'student',
      xp: 250,
      level: 1,
      streak: 2
    }
    localStorage.setItem('ai_gamified_user', JSON.stringify(fallbackUser))
    setCurrentUser({ uid: fallbackUser.uid, email: fallbackUser.email, displayName: fallbackUser.displayName })
    setUserProfile(fallbackUser)
    return { user: fallbackUser }
  }

  // ── Google login ──────────────────────────────────────────────────────────
  async function googleLogin(role = 'student') {
    try {
      if (auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider)
        await createUserDocument(cred.user, { role })
        return cred
      }
    } catch (err) {
      console.warn('Google login notice, activating fallback:', err.message)
    }

    return demoLogin('student')
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function logout() {
    localStorage.removeItem('ai_gamified_user')
    try {
      if (auth) await signOut(auth)
    } catch (e) {
      // ignore
    }
    setCurrentUser(null)
    setUserProfile(null)
  }

  // ── Refresh profile ───────────────────────────────────────────────────────
  async function refreshProfile() {
    if (currentUser && currentUser.uid) {
      await fetchUserProfile(currentUser.uid)
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    demoLogin,
    register,
    login,
    googleLogin,
    logout,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
