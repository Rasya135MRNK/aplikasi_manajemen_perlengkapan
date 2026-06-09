import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchCategories = async () => {
    const { data } = await api.get('/categories')
    setCategories(data.categories)
  }

  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => {
    setEditId(null); setName(''); setDescription(''); setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditId(cat.id); setName(cat.name); setDescription(cat.description || ''); setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name, description })
      } else {
        await api.post('/categories', { name, description })
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return
    try {
      await api.delete(`/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menghapus')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kategori</h1>
        <button onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Deskripsi</th>
              <th className="text-center p-3">Jumlah Barang</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">Tidak ada data</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-gray-500">{cat.description || '-'}</td>
                <td className="p-3 text-center">{cat.itemCount || 0}</td>
                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => openEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                    <button onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editId ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Nama kategori" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi (opsional)" rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
