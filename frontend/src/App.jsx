import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Items from './pages/Items'
import ItemForm from './pages/ItemForm'
import Categories from './pages/Categories'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Transactions from './pages/Transactions'
import Loans from './pages/Loans'
import LoanForm from './pages/LoanForm'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/add" element={<ItemForm />} />
        <Route path="/items/:id/edit" element={<ItemForm />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/add" element={<LoanForm />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<PrivateRoute roles={['super_admin']}><Users /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
