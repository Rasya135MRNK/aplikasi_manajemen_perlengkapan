import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', password: '', phone: '' })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users')
      setUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.username || !form.password) return
    try {
      await api.post('/auth/register', form)
      setShowModal(false)
      setForm({ name: '', username: '', password: '', phone: '' })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membuat user')
    }
  }

  const toggleActive = async (user) => {
    try {
      await api.put(`/users/${user.id}/toggle-active`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengubah status')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Pengguna</h1>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Tambah User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Username</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">Memuat...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">Tidak ada data</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-gray-500">{u.username}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleActive(u)}
                    className={`text-xs ${u.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Tambah User</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Nama" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" name="username" value={form.username} onChange={handleChange}
                placeholder="Username" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Password" required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="No. HP" pattern="[0-9]{10,15}"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
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
