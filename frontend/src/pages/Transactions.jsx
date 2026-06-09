import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Transactions() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await api.get('/transactions', { params: { page, limit: 20 } })
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page])

  const getTypeLabel = (type) => {
    return type === 'check_in' ? { label: 'Masuk', color: 'bg-green-100 text-green-700' }
      : { label: 'Keluar', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Tanggal</th>
              <th className="text-left p-3">Barang</th>
              <th className="text-center p-3">Tipe</th>
              <th className="text-center p-3">Jumlah</th>
              <th className="text-left p-3">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Memuat...</td></tr>
            ) : data.transactions?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada transaksi</td></tr>
            ) : data.transactions?.map((t) => {
              const typeInfo = getTypeLabel(t.type)
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3 font-medium">{t.Item?.name}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="p-3 text-center">{t.quantity}</td>
                  <td className="p-3 text-gray-500">{t.notes || '-'}</td>
                </tr>
              )
            })}
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
