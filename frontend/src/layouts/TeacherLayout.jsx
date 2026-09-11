import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import DashboardNavbar from '../components/common/Navbar'

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="pt-16 min-h-screen" style={{ marginLeft: '256px' }}>
        <div className="p-5 md:p-7 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
