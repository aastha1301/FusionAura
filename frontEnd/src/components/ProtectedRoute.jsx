import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function ProtectedRoute({ children }) {
  const admin = useSelector((state) => state.auth.admin)
  const adminToken = useSelector((state) => state.auth.adminToken)
  if (!admin || !adminToken) return <Navigate to="/admin/login" replace />
  return children
}
export default ProtectedRoute
