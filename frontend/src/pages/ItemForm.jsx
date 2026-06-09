import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function ItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '', sku: '', categoryId: '', description: '',
    stock: 0, minStock: 5, unit: 'pcs',
  })
  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories))
    if (isEdit) {
      api.get(`/items/${id}`).then(({ data }) => {
        const item = data.item
        setForm({
          name: item.name, sku: item.sku || '', categoryId: item.categoryId,
          description: item.description || '', stock: item.stock, minStock: item.minStock, unit: item.unit,
        })
        if (item.image) {
          const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''
          setPreview(`${baseUrl}/${item.image}`)
        }
      })
    }
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Format file harus JPG/PNG/WEBP')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File maksimal 2MB')
        return
      }
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.categoryId) {
      alert('Nama dan kategori wajib diisi')
      return
    }
    if (!isEdit && !image) {
      alert('Gambar barang wajib diupload')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)

      if (isEdit) {
        await api.put(`/items/${id}`, fd)
      } else {
        await api.post('/items', fd)
      }
      navigate('/items')
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {isEdit ? 'Edit Barang' : 'Tambah Barang'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang *</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Stok</label>
            <input type="number" name="minStock" value={form.minStock} onChange={handleChange} min="0"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
            <select name="unit" value={form.unit} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="pcs">pcs</option>
              <option value="unit">unit</option>
              <option value="kg">kg</option>
              <option value="liter">liter</option>
              <option value="box">box</option>
              <option value="pack">pack</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar {!isEdit && '* '}
            <span className="text-gray-400 text-xs">(JPG/PNG/WEBP, max 2MB)</span>
          </label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : (isEdit ? 'Simpan' : 'Tambah')}
          </button>
          <button type="button" onClick={() => navigate('/items')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
