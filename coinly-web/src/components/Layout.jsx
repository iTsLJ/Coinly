import { NavLink, useNavigate } from 'react-router-dom'
import { Users, Building2, LayoutDashboard, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alunos', icon: Users, label: 'Alunos' },
  { to: '/empresas', icon: Building2, label: 'Empresas Parceiras' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('coinly_user')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1E1B2E] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[#FFC633] text-2xl font-black">C</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">Coinly</p>
              <p className="text-[#A78BFA] text-xs">Moeda Estudantil</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#6C4DFF] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
