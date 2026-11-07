import AdminNavbar from "./AdminNavbar"
import { useLocation } from "react-router-dom"

function AdminLayout({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080709] text-zinc-100">
      <AdminNavbar />
      <div key={pathname} className="page-enter">{children}</div>
    </div>
  )
}

export default AdminLayout
