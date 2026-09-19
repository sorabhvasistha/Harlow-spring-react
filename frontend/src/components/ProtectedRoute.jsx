import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, fallback = null }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : fallback
}
