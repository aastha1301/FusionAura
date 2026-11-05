import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllBookings, updateBookingStatus, deleteBooking } from "../../slices/bookingSlice"

function ManageBookings() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.adminToken)
  const bookings = useSelector((state) => state.bookings.allBookings)
  useEffect(() => { dispatch(fetchAllBookings(token)) }, [dispatch, token])

  const change = async (id,status) => { await dispatch(updateBookingStatus({id,status,token})) }
  const remove = async (id) => { if(window.confirm("Delete this booking?")) await dispatch(deleteBooking({id,token})) }
  const pending = bookings.filter(b=>b.status==="Pending").length
  const confirmed = bookings.filter(b=>b.status==="Confirmed").length
  const cancelled = bookings.filter(b=>b.status==="Cancelled").length

  return <div className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl min-w-0"><h1 className="mb-6 text-2xl font-bold text-zinc-100 sm:mb-8 sm:text-3xl">Manage Bookings</h1>
    <div className="mb-7 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-5 xl:grid-cols-4">{[["Total",bookings.length,"text-white"],["Pending",pending,"text-yellow-500"],["Confirmed",confirmed,"text-green-500"],["Cancelled",cancelled,"text-red-500"]].map(([label,num,color])=><div key={label} className="rounded-2xl border border-white/10 bg-[#101014] p-4 sm:p-6"><p className="text-sm text-zinc-500">{label}</p><h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${color}`}>{num}</h2></div>)}</div>
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014]">{bookings.length===0?<div className="p-8 text-center text-zinc-500 sm:p-10">No bookings available.</div>:<>
      <div className="divide-y divide-white/10 xl:hidden">{bookings.map(b=><article key={b._id} className="space-y-4 p-4 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words font-semibold text-zinc-100">{b.name}</h2><p className="mt-1 break-all text-sm text-zinc-500">{b.phone} · {b.email}</p></div><span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">{b.status}</span></div>
        <p className="break-words text-sm leading-6 text-[#edca83]">{b.service}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400"><span>{b.date} · {b.time}</span><select aria-label={`Status for ${b.name}`} value={b.status} onChange={e=>change(b._id,e.target.value)} className="max-w-full rounded-lg border border-white/10 bg-[#080709] px-3 py-2"><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></div>
        <button onClick={()=>remove(b._id)} className="w-full rounded-lg border border-red-500/25 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 sm:w-auto">Delete booking</button>
      </article>)}</div>
      <div className="hidden overflow-x-auto xl:block"><table className="w-full min-w-[950px]"><thead className="bg-[#080709]"><tr>{["Customer","Contact","Service","Date","Time","Status","Action"].map(h=><th key={h} className="p-4 text-left">{h}</th>)}</tr></thead>
      <tbody>{bookings.map(b=><tr key={b._id} className="border-t border-white/10"><td className="p-4 font-medium">{b.name}</td><td className="p-4 text-sm text-zinc-500"><div>{b.phone}</div><div>{b.email}</div></td><td className="max-w-xs break-words p-4">{b.service}</td><td className="whitespace-nowrap p-4">{b.date}</td><td className="whitespace-nowrap p-4">{b.time}</td><td className="p-4"><select aria-label={`Status for ${b.name}`} value={b.status} onChange={e=>change(b._id,e.target.value)} className="rounded-lg border border-white/10 bg-[#080709] px-3 py-2"><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></td><td className="p-4"><button onClick={()=>remove(b._id)} className="whitespace-nowrap rounded-lg bg-red-500 px-4 py-2 text-white">Delete</button></td></tr>)}</tbody></table></div>
    </>}
    </div>
  </div></div>
}
export default ManageBookings
