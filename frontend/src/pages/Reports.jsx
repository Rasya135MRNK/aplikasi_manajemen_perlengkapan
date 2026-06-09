import { useState } from 'react'
import api from '../api/axios'

export default function Reports() {
  const [tab, setTab] = useState('stock')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ startDate: '', endDate: '', type: '', status: '' })

  const fetchReport = async (reportType) => {
    setLoading(true)
    try {
      const params = {}
      if (reportType === 'transactions') {
        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        if (filters.type) params.type = filters.type
      }
      if (reportType === 'loans') {
        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        if (filters.status) params.status = filters.status
      }

      const { data: res } = await api.get(`/reports/${reportType}`, { params })
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setData(null)
  }

  const exportCSV = () => {
    if (!data) return
    let csv = ''
    const rows = data.items || data.transactions || data.loans || []
    if (rows.length === 0) return

    const headers = Object.keys(rows[0]).join(',')
    csv += headers + '\n'
    rows.forEach(row => {
      csv += Object.values(row).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tab}_report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { key: 'stock', label: 'Stok Barang' },
    { key: 'transactions', label: 'Transaksi' },
    { key: 'loans', label: 'Peminjaman' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2 rounded-lg text-sm ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'transactions' || tab === 'loans') && (
        <div className="flex gap-3 flex-wrap items-end bg-white p-4 rounded-xl shadow-sm">
          <div>
            <label className="text-xs text-gray-500">Dari</label>
            <input type="date" value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-1.5 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Sampai</label>
            <input type="date" value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-1.5 border rounded-lg text-sm" />
          </div>
          {tab === 'transactions' && (
            <div>
              <label className="text-xs text-gray-500">Tipe</label>
              <select value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="">Semua</option>
                <option value="check_in">Masuk</option>
                <option value="check_out">Keluar</option>
              </select>
            </div>
          )}
          {tab === 'loans' && (
            <div>
              <label className="text-xs text-gray-500">Status</label>
              <select value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="">Semua</option>
                <option value="borrowed">Dipinjam</option>
                <option value="returned">Dikembalikan</option>
                <option value="overdue">Terlambat</option>
              </select>
            </div>
          )}
          <button onClick={() => fetchReport(tab)}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
            Tampilkan
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {tab === 'stock' && (
          <div className="p-6">
            <p className="text-gray-500 mb-4">
              *Laporan stok dapat diakses langsung dari menu Barang
            </p>
            <button onClick={() => fetchReport('stock')}
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
              Muat Data Stok
            </button>

            {loading && <p className="mt-4 text-gray-400">Memuat...</p>}

            {data?.items && !loading && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left p-2">Nama</th>
                      <th className="text-left p-2">Kategori</th>
                      <th className="text-center p-2">Stok</th>
                      <th className="text-center p-2">Min Stok</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.Category?.name || '-'}</td>
                        <td className="p-2 text-center">{item.stock}</td>
                        <td className="p-2 text-center">{item.minStock}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${item.stock <= item.minStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {item.stock <= item.minStock ? 'Menipis' : 'Aman'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(tab === 'transactions' || tab === 'loans') && (
          <div className="p-6">
            {!data && !loading && (
              <p className="text-gray-400">Atur filter dan klik Tampilkan</p>
            )}
            {loading && <p className="text-gray-400">Memuat...</p>}

            {data && !loading && (
              <>
                {data.summary && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.entries(data.summary).map(([key, val]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-xl font-bold">{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        {tab === 'transactions' && (
                          <>
                            <th className="text-left p-2">Tanggal</th>
                            <th className="text-left p-2">Barang</th>
                            <th className="text-center p-2">Tipe</th>
                            <th className="text-center p-2">Jumlah</th>
                          </>
                        )}
                        {tab === 'loans' && (
                          <>
                            <th className="text-left p-2">Barang</th>
                            <th className="text-left p-2">Peminjam</th>
                            <th className="text-center p-2">Jumlah</th>
                            <th className="text-center p-2">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(data.transactions || data.loans)?.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          {tab === 'transactions' && (
                            <>
                              <td className="p-2">{new Date(row.createdAt).toLocaleDateString('id-ID')}</td>
                              <td className="p-2">{row.Item?.name}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${row.type === 'check_in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {row.type === 'check_in' ? 'Masuk' : 'Keluar'}
                                </span>
                              </td>
                              <td className="p-2 text-center">{row.quantity}</td>
                            </>
                          )}
                          {tab === 'loans' && (
                            <>
                              <td className="p-2">{row.Item?.name}</td>
                              <td className="p-2">{row.borrowerName}</td>
                              <td className="p-2 text-center">{row.quantity}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'borrowed' ? 'bg-yellow-100 text-yellow-700' : row.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {row.status}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {data && (
        <button onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          Export CSV
        </button>
      )}
    </div>
  )
}
