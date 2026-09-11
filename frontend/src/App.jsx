import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// ── Layouts
import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'
import AdminLayout   from './layouts/AdminLayout'

// ── Public pages
import LandingPage  from './pages/public/LandingPage'
import LoginPage    from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// ── Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import MyClassrooms     from './pages/student/MyClassrooms'
import StudyMaterials   from './pages/student/StudyMaterials'
import GenerateGame     from './pages/student/GenerateGame'
import GamesList        from './pages/student/GamesList'
import Leaderboard      from './pages/student/Leaderboard'
import Achievements     from './pages/student/Achievements'
import Analytics        from './pages/student/Analytics'
import AIAssistant      from './pages/student/AIAssistant'
import StudentProfile   from './pages/student/Profile'

// ── Teacher pages
import TeacherDashboard   from './pages/teacher/TeacherDashboard'
import Classrooms         from './pages/teacher/Classrooms'
import Students           from './pages/teacher/Students'
import Materials          from './pages/teacher/Materials'
import GenerateQuestions  from './pages/teacher/GenerateQuestions'
import QuestionReview     from './pages/teacher/QuestionReview'
import TeacherGames       from './pages/teacher/Games'
import TeacherAnalytics   from './pages/teacher/TeacherAnalytics'
import TeacherProfile     from './pages/teacher/TeacherProfile'

// ── Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers    from './pages/admin/ManageUsers'

// ── Game components
import QuizGame       from './games/QuizGame'
import MemoryMatch    from './games/MemoryMatch'
import SequenceBuilder from './games/SequenceBuilder'
import DragAndDrop    from './games/DragAndDrop'
import RevisionMode   from './games/RevisionMode'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1226',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0d1226' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#0d1226' } },
            }}
          />

          <Routes>
            {/* ── Public ───────────────────────────────────────── */}
            <Route path="/"         element={<LandingPage />}  />
            <Route path="/login"    element={<LoginPage />}    />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Student (protected) ──────────────────────────── */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index                element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<StudentDashboard />} />
              <Route path="classrooms"    element={<MyClassrooms />}     />
              <Route path="materials"     element={<StudyMaterials />}   />
              <Route path="generate"      element={<GenerateGame />}     />
              <Route path="games"         element={<GamesList />}        />
              <Route path="leaderboard"   element={<Leaderboard />}      />
              <Route path="achievements"  element={<Achievements />}     />
              <Route path="analytics"     element={<Analytics />}        />
              <Route path="assistant"     element={<AIAssistant />}      />
              <Route path="profile"       element={<StudentProfile />}   />
            </Route>

            {/* ── Game routes (full-screen, no sidebar) ────────── */}
            <Route path="/game/quiz/:id"      element={<ProtectedRoute><QuizGame /></ProtectedRoute>}        />
            <Route path="/game/memory/:id"    element={<ProtectedRoute><MemoryMatch /></ProtectedRoute>}     />
            <Route path="/game/sequence/:id"  element={<ProtectedRoute><SequenceBuilder /></ProtectedRoute>} />
            <Route path="/game/drag/:id"      element={<ProtectedRoute><DragAndDrop /></ProtectedRoute>}     />
            <Route path="/game/revision/:id"  element={<ProtectedRoute><RevisionMode /></ProtectedRoute>}    />

            {/* ── Teacher (protected) ──────────────────────────── */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherLayout />
                </ProtectedRoute>
              }
            >
              <Route index                element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<TeacherDashboard />}  />
              <Route path="classrooms"    element={<Classrooms />}        />
              <Route path="students"      element={<Students />}          />
              <Route path="materials"     element={<Materials />}         />
              <Route path="generate"      element={<GenerateQuestions />} />
              <Route path="review"        element={<QuestionReview />}    />
              <Route path="games"         element={<TeacherGames />}      />
              <Route path="analytics"     element={<TeacherAnalytics />}  />
              <Route path="profile"       element={<TeacherProfile />}    />
            </Route>

            {/* ── Admin (protected) ────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index             element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"  element={<AdminDashboard />} />
              <Route path="users"      element={<ManageUsers />}    />
            </Route>

            {/* ── Catch-all ─────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}
