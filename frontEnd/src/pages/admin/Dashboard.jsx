import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllBookings } from "../../slices/bookingSlice"
import { fetchServices } from "../../slices/serviceSlice"

function Dashboard() {
  const dispatch = useDispatch()
  const token = useSelector((state)=>state.auth.adminToken)
  const bookings = useSelector((state)=>state.bookings.bookings)
  const services = useSelector((state)=>state.services.services)
  useEffect(()=>{ dispatch(fetchServices()); dispatch(fetchAllBookings(token)) },[dispatch,token])
  const serviceCount = services.length
  const pending = bookings.filter(b=>b.status==="Pending").length
  const customers = new Set(bookings.map(b=>b.email)).size
  const recent = bookings.slice(0,5)

  return <div className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl min-w-0">
    <h1 className="mb-6 text-2xl font-bold text-zinc-100 sm:mb-8 sm:text-3xl">Admin Dashboard</h1>
    <div className="mb-7 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-5 xl:grid-cols-4">{[["Menu Services",serviceCount,"text-[#f06b91]"],["Total Bookings",bookings.length,"text-white"],["Pending Bookings",pending,"text-yellow-500"],["Customers",customers,"text-white"]].map(([l,n,c])=><div key={l} className="rounded-2xl border border-white/10 bg-[#101014] p-4 sm:p-6"><p className="text-xs text-zinc-500 sm:text-sm">{l}</p><h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${c}`}>{n}</h2></div>)}</div>
    <div className="mb-7 grid gap-4 sm:mb-10 sm:gap-6 md:grid-cols-2"><Link to="/admin/services" className="rounded-2xl border border-white/10 bg-[#101014] p-5 transition hover:border-[#e85b83]/40 sm:p-6"><h2 className="text-lg font-semibold sm:text-xl">Manage Service Menus</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Add, edit or remove services. Changes update the customer menus and booking choices.</p></Link><Link to="/admin/bookings" className="rounded-2xl border border-white/10 bg-[#101014] p-5 transition hover:border-[#e85b83]/40 sm:p-6"><h2 className="text-lg font-semibold sm:text-xl">Manage Bookings</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Review appointments and confirm or cancel them.</p></Link></div>
    <div className="rounded-2xl border border-white/10 bg-[#101014] p-4 sm:p-6"><h2 className="mb-5 text-lg font-semibold sm:text-xl">Recent Bookings</h2>{recent.length===0?<p className="text-zinc-500">No bookings yet.</p>:<div className="space-y-4">{recent.map(b=><div key={b._id} className="flex min-w-0 flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0"><p className="font-medium">{b.name}</p><p className="break-words text-sm text-zinc-500">{b.service}</p></div><div className="text-sm text-zinc-500">{b.date} • {b.time}</div><span className="self-start rounded-full bg-[#1b1015] px-3 py-1 text-sm text-[#f06b91]">{b.status}</span></div>)}</div>}</div>
  </div></div>
}
export default Dashboard
