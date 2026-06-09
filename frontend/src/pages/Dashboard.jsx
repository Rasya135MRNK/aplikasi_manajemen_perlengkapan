import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Total Barang', value: data?.summary?.totalItems || 0, color: 'blue' },
    { label: 'Stok Menipis', value: data?.summary?.lowStockItems || 0, color: 'red' },
    { label: 'Dipinjam', value: data?.summary?.activeLoans || 0, color: 'yellow' },
    { label: 'Notifikasi', value: data?.summary?.unreadNotifications || 0, color: 'purple' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl shadow-sm p-5 border-l-4
              ${card.color === 'blue' ? 'border-blue-500' : ''}
              ${card.color === 'red' ? 'border-red-500' : ''}
              ${card.color === 'yellow' ? 'border-yellow-500' : ''}
              ${card.color === 'purple' ? 'border-purple-500' : ''}
            `}
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Transaksi Terbaru</h2>
          {data?.recentTransactions?.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada transaksi</p>
          ) : (
            <div className="space-y-2">
              {data?.recentTransactions?.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
                  <span>{t.Item?.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs
                    ${t.type === 'check_in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {t.type === 'check_in' ? 'Masuk' : 'Keluar'} ({t.quantity})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Peminjaman Terbaru</h2>
          {data?.recentLoans?.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada peminjaman</p>
          ) : (
            <div className="space-y-2">
              {data?.recentLoans?.map((l) => (
                <div key={l.id} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
                  <div>
                    <span className="font-medium">{l.Item?.name}</span>
                    <span className="text-gray-500 ml-2">- {l.borrowerName}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs
                    ${l.status === 'borrowed' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${l.status === 'returned' ? 'bg-green-100 text-green-700' : ''}
                    ${l.status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
