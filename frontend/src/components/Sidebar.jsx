import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Barang', path: '/items', icon: '📦', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Kategori', path: '/categories', icon: '🏷️', roles: ['super_admin', 'admin'] },
  { label: 'Check-in', path: '/checkin', icon: '📥', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Check-out', path: '/checkout', icon: '📤', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Transaksi', path: '/transactions', icon: '📋', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Peminjaman', path: '/loans', icon: '📝', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Notifikasi', path: '/notifications', icon: '🔔', roles: ['super_admin', 'admin', 'staff'] },
  { label: 'Laporan', path: '/reports', icon: '📈', roles: ['super_admin', 'admin'] },
  { label: 'Pengguna', path: '/users', icon: '👥', roles: ['super_admin'] },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const visibleItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-20' : 'w-64'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`font-bold text-lg text-blue-600 ${collapsed ? 'hidden' : 'block'}`}>
            Inventaris
          </h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700 hidden lg:block"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                ${isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`${collapsed ? 'hidden' : 'block'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
