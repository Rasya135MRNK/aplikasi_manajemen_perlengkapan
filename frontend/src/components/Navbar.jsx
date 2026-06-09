import useAuthStore from '../stores/authStore'
import NotificationBadge from './NotificationBadge'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <NotificationBadge />
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          Keluar
        </button>
      </div>
    </header>
  )
}
