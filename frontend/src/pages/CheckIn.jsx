import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CheckIn() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/items', { params: { limit: 100 } })
      .then(({ data }) => setItems(data.items))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemId || !quantity) return
    setLoading(true)
    try {
      await api.post('/transactions/checkin', { itemId: parseInt(itemId), quantity: parseInt(quantity), notes })
      navigate('/transactions')
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal check-in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Check-in Barang</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barang *</label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            <option value="">Pilih barang</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (stok: {item.stock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Memproses...' : 'Check-in'}
        </button>
      </form>
    </div>
  )
}
