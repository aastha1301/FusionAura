import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../slices/authSlice"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser())
    setMenuOpen(false)
    navigate("/")
  }

  const isActive = (path) => location.pathname === path
  const linkClass = (path) =>
    `relative rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      isActive(path)
        ? "bg-white/[0.07] text-[#ffc0d1] shadow-[inset_0_0_0_1px_rgba(232,91,131,0.3)]"
        : "text-zinc-300 hover:bg-white/[0.05] hover:text-[#f06b91]"
    }`

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e85b83]/20 bg-[#080709]/95 shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#e85b83] to-transparent opacity-80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <Link to="/" onClick={closeMenu} className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e85b83]/40 bg-gradient-to-br from-[#e85b83]/15 to-transparent shadow-[0_0_22px_rgba(232,91,131,0.12)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#f06b91]/80">
            <img src="/peacock-feather.svg" alt="" className="h-7 w-7 object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-wide text-[#fff4dc] sm:text-xl">Fusion Aura</span>
            <span className="mt-0.5 text-[0.58rem] uppercase tracking-[0.22em] text-[#f06b91]">by Jyotika Sharma</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-black/20 p-1">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/services" className={linkClass("/services")}>Services</Link>
          <Link to="/about" className={linkClass("/about")}>About Us</Link>
          <Link to="/reviews" className={linkClass("/reviews")}>Reviews</Link>
          <Link to="/contact" className={linkClass("/contact")}>Contact Us</Link>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition-all duration-300 hover:border-[#e85b83]/70 hover:text-[#f06b91]">Login</Link>
              <Link to="/signup" className="rounded-full bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-4 py-2 text-sm font-semibold text-white shadow-[0_5px_20px_rgba(232,91,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,91,131,0.32)]">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/booking" className="rounded-full bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-4 py-2 text-sm font-semibold text-white shadow-[0_5px_20px_rgba(232,91,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,91,131,0.3)]">Book Now</Link>
              <Link to="/my-bookings" className={`hidden xl:block ${linkClass("/my-bookings")}`}>My Bookings</Link>
              <span className="hidden 2xl:block text-sm text-zinc-300 ml-1">Hi, {user.name}</span>
              <button onClick={handleLogout} className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition-all duration-300 hover:border-[#e85b83]/70 hover:text-[#f06b91]">Logout</button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#e85b83]/35 bg-white/[0.03] text-[#f06b91] transition-all duration-300 hover:rotate-3 hover:bg-[#e85b83]/10"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`${menuOpen ? "visible max-h-[32rem] translate-y-0 opacity-100" : "invisible max-h-0 -translate-y-2 overflow-hidden opacity-0"} flex sm:hidden flex-col gap-2 border-t border-[#e85b83]/15 bg-[#080709] px-4 pb-4 pt-3 transition-all duration-300 ease-in-out`}>
        <Link onClick={closeMenu} to="/" className={linkClass("/")}>Home</Link>
        <Link onClick={closeMenu} to="/services" className={linkClass("/services")}>Services</Link>
        <Link onClick={closeMenu} to="/about" className={linkClass("/about")}>About Us</Link>
        <Link onClick={closeMenu} to="/reviews" className={linkClass("/reviews")}>Reviews</Link>
        <Link onClick={closeMenu} to="/contact" className={linkClass("/contact")}>Contact Us</Link>
        {!user ? (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link onClick={closeMenu} to="/login" className="rounded-xl border border-white/15 px-3 py-2.5 text-center text-sm text-zinc-200 transition-colors hover:border-[#e85b83]/60 hover:text-[#f06b91]">Login</Link>
            <Link onClick={closeMenu} to="/signup" className="rounded-xl bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-3 py-2.5 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02]">Signup</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link onClick={closeMenu} to="/booking" className="rounded-xl bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-3 py-2.5 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02]">Book Now</Link>
            <Link onClick={closeMenu} to="/my-bookings" className="rounded-xl border border-white/15 px-3 py-2.5 text-center text-sm text-zinc-200">My Bookings</Link>
            <button onClick={handleLogout} className="col-span-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-zinc-200">Logout</button>
          </div>
        )}
      </div>

      <div className="hidden sm:flex lg:hidden justify-start gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/services" className={linkClass("/services")}>Services</Link>
        <Link to="/about" className={linkClass("/about")}>About</Link>
        <Link to="/reviews" className={linkClass("/reviews")}>Reviews</Link>
        <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
      </div>
    </nav>
  )
}
export default Navbar
