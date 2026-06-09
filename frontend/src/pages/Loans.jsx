import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Loans() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (filter) params.status = filter
      const { data: res } = await api.get('/loans', { params })
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page, filter])

  const handleReturn = async (id) => {
    if (!confirm('Kembalikan barang ini?')) return
    try {
      await api.put(`/loans/${id}/return`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memproses')
    }
  }

  const statusBadge = (status) => {
    const map = {
      borrowed: 'bg-yellow-100 text-yellow-700',
      returned: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
    }
    return map[status] || 'bg-gray-100 text-gray-700'
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date(new Date().toDateString())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Peminjaman</h1>
        <Link to="/loans/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Pinjam Barang
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'borrowed', 'returned', 'overdue'].map((s) => (
          <button key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s || 'Semua'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Barang</th>
              <th className="text-left p-3">Peminjam</th>
              <th className="text-center p-3">Jumlah</th>
              <th className="text-center p-3">Tgl Pinjam</th>
              <th className="text-center p-3">Jatuh Tempo</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Memuat...</td></tr>
            ) : data.loans?.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Tidak ada data</td></tr>
            ) : data.loans?.map((l) => {
              const overdue = l.status === 'borrowed' && isOverdue(l.dueDate)
              return (
                <tr key={l.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                  <td className="p-3 font-medium">{l.Item?.name}</td>
                  <td className="p-3">
                    <div>{l.borrowerName}</div>
                    {l.borrowerPhone && <div className="text-xs text-gray-400">{l.borrowerPhone}</div>}
                  </td>
                  <td className="p-3 text-center">{l.quantity}</td>
                  <td className="p-3 text-center text-gray-500">
                    {new Date(l.loanDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3 text-center">
                    <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                      {new Date(l.dueDate).toLocaleDateString('id-ID')}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(l.status)}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {l.status === 'borrowed' && (
                      <button onClick={() => handleReturn(l.id)}
                        className="text-green-600 hover:text-green-800 text-xs">
                        Kembalikan
                      </button>
                    )}
                  </td>
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
