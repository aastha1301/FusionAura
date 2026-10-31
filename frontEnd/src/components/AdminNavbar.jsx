import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutAdmin } from "../slices/authSlice"

function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const active = (path) => location.pathname === path
  const cls = (path) => `block whitespace-nowrap px-4 py-2.5 rounded-lg text-sm transition-colors ${active(path) ? "bg-[#e85b83] text-white" : "text-zinc-300 hover:bg-white/5"}`
  const closeMenu = () => setMenuOpen(false)
  const logout = () => { dispatch(logoutAdmin()); closeMenu(); navigate("/admin/login") }

  return <header className="sticky top-0 z-50 bg-[#080709]/95 backdrop-blur-xl border-b border-white/10">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
      <Link to="/admin" onClick={closeMenu} className="flex min-w-0 items-center gap-2 text-white font-semibold"><img src="/peacock-feather.svg" className="h-8 w-8 shrink-0" alt="" /><span className="truncate">Fusion Aura</span><span className="text-[#f06b91] text-xs">ADMIN</span></Link>
      <button type="button" aria-label={menuOpen ? "Close admin navigation" : "Open admin navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-xl text-[#edca83] transition hover:border-[#e85b83] lg:hidden">{menuOpen ? "×" : "☰"}</button>
      <nav className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 border-t border-white/10 pt-3 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:pt-0`}>
        <Link onClick={closeMenu} to="/admin" className={cls("/admin")}>Dashboard</Link>
        <Link onClick={closeMenu} to="/admin/services" className={cls("/admin/services")}>Services</Link>
        <Link onClick={closeMenu} to="/admin/bookings" className={cls("/admin/bookings")}>Bookings</Link>
        <Link onClick={closeMenu} to="/" className="rounded-lg border border-[#d6b16d]/35 px-4 py-2.5 text-sm text-[#edca83] transition hover:bg-[#d6b16d]/10 lg:ml-2">Customer Site</Link>
        <button onClick={logout} className="rounded-lg border border-white/15 px-4 py-2.5 text-left text-sm transition hover:border-[#e85b83] lg:ml-2">Logout</button>
      </nav>
    </div>
  </header>
  
}
export default AdminNavbar
