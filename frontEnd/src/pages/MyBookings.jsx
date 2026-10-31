import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

function MyBookings() {
  const user = useSelector((state) => state.auth.user)
  const bookings = useSelector((state) => state.bookings.bookings)
  if (!user) return <div className="min-h-screen bg-[#080607] flex items-center justify-center px-6"><div className="bg-[#111013] p-10 rounded-2xl text-center"><h1 className="text-2xl font-bold text-white mb-4">Login Required</h1><p className="text-gray-400 mb-6">Please login to view your bookings.</p><Link to="/login" className="bg-[#e85d83] text-white px-6 py-3 rounded-lg">Login</Link></div></div>

  return <div className="min-h-screen bg-[#080607] py-12 px-6"><div className="max-w-5xl mx-auto">
    <div className="text-center mb-10"><h1 className="text-4xl font-bold text-white">My Bookings</h1><p className="text-gray-400 mt-3">View your appointment history and status.</p></div>
    {bookings.length === 0 ? <div className="bg-[#111013] border border-[#302128] rounded-2xl p-10 text-center"><div className="text-5xl mb-4">📅</div><h2 className="text-2xl font-semibold text-white">No Bookings Yet</h2><p className="text-gray-400 mt-2 mb-6">You haven't booked any appointment yet.</p><Link to="/booking" className="bg-[#e85d83] text-white px-6 py-3 rounded-lg">Book Appointment</Link></div> :
    <div className="space-y-5">{bookings.map(b=><div key={b._id} className="bg-[#111013] border border-[#302128] rounded-2xl p-6"><div className="flex flex-col md:flex-row md:justify-between gap-5"><div><h2 className="text-xl font-semibold text-white">{b.service}</h2><p className="text-gray-400 mt-2">📅 {b.date}</p><p className="text-gray-400 mt-1">🕐 {b.time}</p><p className="text-gray-400 mt-1">📞 {b.phone}</p></div><span className={`px-4 py-2 rounded-full text-sm self-start ${b.status==="Pending"?"bg-yellow-500/10 text-yellow-400":b.status==="Confirmed"?"bg-green-500/10 text-green-400":"bg-red-500/10 text-red-400"}`}>{b.status}</span></div></div>)}</div>}
  </div></div>
}
export default MyBookings
