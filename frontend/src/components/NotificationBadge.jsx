import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function NotificationBadge() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count')
        setCount(data.count)
      } catch { }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
    >
      <span className="text-lg">🔔</span>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  )
}
