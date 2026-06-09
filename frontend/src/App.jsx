import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <PrivateRoute>
          <div className="p-8 text-center text-xl">
            Aplikasi Manajemen Perlengkapan
          </div>
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
