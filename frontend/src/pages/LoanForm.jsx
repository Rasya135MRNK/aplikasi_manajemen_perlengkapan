import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function LoanForm() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  const [form, setForm] = useState({
    itemId: '', borrowerName: '', borrowerPhone: '',
    quantity: 1, loanDate: new Date().toISOString().split('T')[0],
    dueDate: '', notes: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/items', { params: { limit: 100 } })
      .then(({ data }) => setItems(data.items))
  }, [])

  const selectedItem = items.find(i => i.id === parseInt(form.itemId))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.itemId || !form.borrowerName || !form.quantity || !form.loanDate || !form.dueDate) {
      alert('Semua field wajib diisi')
      return
    }
    if (parseInt(form.quantity) > (selectedItem?.stock || 0)) {
      alert(`Stok tidak mencukupi. Tersedia: ${selectedItem?.stock || 0}`)
      return
    }

    setLoading(true)
    try {
      await api.post('/loans', {
        ...form,
        itemId: parseInt(form.itemId),
        quantity: parseInt(form.quantity),
      })
      navigate('/loans')
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal meminjam')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Peminjaman Barang</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barang *</label>
          <select name="itemId" value={form.itemId} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            <option value="">Pilih barang</option>
            {items.filter(i => i.stock > 0).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (stok: {item.stock})
              </option>
            ))}
          </select>
          {selectedItem && (
            <p className="text-xs text-gray-500 mt-1">
              Stok tersedia: <strong>{selectedItem.stock}</strong> {selectedItem.unit}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam *</label>
            <input name="borrowerName" value={form.borrowerName} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
            <input name="borrowerPhone" value={form.borrowerPhone} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1"
            max={selectedItem?.stock || 1}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam *</label>
            <input type="date" name="loanDate" value={form.loanDate} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo *</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Pinjam'}
          </button>
          <button type="button" onClick={() => navigate('/loans')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
