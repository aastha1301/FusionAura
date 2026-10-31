import AdminNavbar from "./AdminNavbar"

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080709] text-zinc-100">
      <AdminNavbar />
      {children}
    </div>
  )
}

export default AdminLayout
