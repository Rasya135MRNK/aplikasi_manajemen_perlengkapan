import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Notifications() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await api.get('/notifications', { params: { page, limit: 20 } })
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page])

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`)
    fetchData()
  }

  const getTypeIcon = (type) => {
    return type === 'low_stock' ? '⚠️' : '🔴'
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Tipe</th>
              <th className="text-left p-3">Pesan</th>
              <th className="text-left p-3">Barang</th>
              <th className="text-center p-3">Waktu</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">Memuat...</td></tr>
            ) : data.notifications?.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">Belum ada notifikasi</td></tr>
            ) : data.notifications?.map((n) => (
              <tr key={n.id} className={`hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50' : ''}`}>
                <td className="p-3 text-center text-lg">{getTypeIcon(n.type)}</td>
                <td className="p-3">{n.message}</td>
                <td className="p-3">{n.Item?.name || '-'}</td>
                <td className="p-3 text-center text-gray-500 text-xs">
                  {new Date(n.sentAt).toLocaleString('id-ID')}
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${n.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                    {n.isRead ? 'Dibaca' : 'Baru'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs">
                      Tandai dibaca
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.total > 20 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-40">Prev</button>
          <span className="px-3 py-1 text-sm">{page} / {Math.ceil(data.total / 20)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 20)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
