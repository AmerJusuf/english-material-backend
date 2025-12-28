import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, FileText, DollarSign, LogOut } from 'lucide-react'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <BookOpen size={32} />
          <h2>Material Generator</h2>
        </div>

        <div className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FileText size={20} />
            <span>My Materials</span>
          </NavLink>
          <NavLink to="/generator" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <BookOpen size={20} />
            <span>Generate New</span>
          </NavLink>
          <NavLink to="/tokens" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <DollarSign size={20} />
            <span>Token Usage</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username.charAt(0).toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

