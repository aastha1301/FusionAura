import { Link } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyBookings } from "../slices/bookingSlice"
import Reveal from "../components/Reveal"

function MyBookings() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const { myBookings, loadingMy, errorMy } = useSelector((state) => state.bookings)
  const userId = user?._id || user?.id
  // Keep the customer boundary on both the API and UI sides, even if cached or
  // delayed data from a previous session reaches this screen.
  const bookings = myBookings.filter((booking) => {
    const owner = booking.user
    const bookingUserId = owner?._id || owner?.id || owner
    return String(bookingUserId || "") === String(userId || "")
  })

  const retryLoad = () => {
    if (token) dispatch(fetchMyBookings(token))
  }

  useEffect(() => {
    if (!userId || !token) return undefined
    const request = dispatch(fetchMyBookings(token))
    return () => request.abort()
  }, [dispatch, token, userId])

  if (!user) {
    return <main className="min-h-screen bg-[#080607] flex items-center justify-center px-6">
      <div className="bg-[#111013] p-10 rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
        <p className="text-gray-400 mb-6">Please log in to view your bookings.</p>
        <Link to="/login" className="bg-[#e85d83] text-white px-6 py-3 rounded-lg">Login</Link>
      </div>
    </main>
  }

  return <main className="min-h-screen bg-[#080607] py-12 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">My Bookings</h1>
        <p className="text-gray-400 mt-3">View your appointment details and status.</p>
      </div>
      {errorMy ? <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center"><p className="text-sm text-red-300">{errorMy}</p><button type="button" onClick={retryLoad} className="mt-4 rounded-lg border border-red-300/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10">Try again</button></div> : loadingMy ? <div role="status" className="rounded-2xl border border-white/10 bg-[#111013] p-8 text-center text-sm text-zinc-300">Loading your bookings…</div> : bookings.length === 0 ? <div className="bg-[#111013] border border-[#302128] rounded-2xl p-8 sm:p-10 text-center">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-2xl font-semibold text-white">No Bookings Yet</h2>
        <p className="text-gray-400 mt-2 mb-6">Choose a service from the menu to get started.</p>
        <Link to="/services" className="bg-[#e85b83] text-white px-6 py-3 rounded-lg">Browse services</Link>
      </div> : <div className="space-y-5">{bookings.map((booking, index) => <Reveal as="article" key={booking._id} delay={index % 5 * 70} className="motion-card rounded-2xl border border-[#302128] bg-[#111013] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-white">{booking.service}</h2>
            {booking.packageIncludes?.length > 0 && <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#f0a7bd]">Included in this package</p>
              <ul className="mt-2 grid gap-x-5 gap-y-1 text-sm text-zinc-300 sm:grid-cols-2">{booking.packageIncludes.map((item) => <li key={item}>✓ {item}</li>)}</ul>
            </div>}
            {booking.addons?.length > 0 && <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#f0a7bd]">Other services in this combo</p>
              <ul className="mt-2 space-y-2 text-sm text-zinc-300">{booking.addons.map((item) => <li key={item.serviceId}><span>＋ {item.name} · {item.priceLabel}</span>{item.includes?.length > 0 && <ul className="ml-5 mt-1 text-xs text-zinc-400">{item.includes.map((included) => <li key={included}>✓ {included}</li>)}</ul>}</li>)}</ul>
            </div>}
            <div className="mt-4 space-y-1 text-sm text-gray-400">
              <p>📅 {booking.date}</p>
              <p>🕐 {booking.time}</p>
              <p>📞 {booking.phone}</p>
            </div>
          </div>
          <span className={`self-start rounded-full px-4 py-2 text-sm ${booking.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" : booking.status === "Confirmed" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{booking.status}</span>
        </div>
      </Reveal>)}</div>}
    </div>
  </main>
}

export default MyBookings
