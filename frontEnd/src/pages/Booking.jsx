import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addBooking } from "../slices/bookingSlice"
import { bookingServices as defaultBookingServices } from "../data/serviceMenus"

function Booking() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const services = useSelector((state) => state.services.services)
  const servicesReady = useSelector((state) => state.services.hasFetched) && services.every((service) => service.menuId)
  const bookingOptions = servicesReady
    ? services.map((service) => ({
        id: service._id,
        menuId: service.menuId,
        groupTitle: service.groupTitle,
        serviceName: service.name,
        name: `${service.menuTitle} · ${service.groupTitle} · ${service.name}`,
        price: service.priceLabel || `₹${service.price}`,
      }))
    : defaultBookingServices.map((service) => ({
        menuId: service.menuId,
        groupTitle: service.groupTitle,
        serviceName: service.name,
        name: `${service.menuTitle} · ${service.groupTitle} · ${service.name}`,
        price: service.price,
      }))
  const [formData, setFormData] = useState({ name: user?.name || "", phone: user?.phone || "", service: "", date: "", time: "" })
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const timeSlots = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"]
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  if (!user) {
    return <div className="min-h-screen bg-[#080709] flex items-center justify-center px-6">
      <div className="bg-[#101014] p-10 rounded-2xl text-center max-w-md">
        <div className="text-5xl mb-4">🌸</div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-3">Login Required</h1>
        <p className="text-zinc-400 mb-6">Please login before booking an appointment.</p>
        <Link to="/login" className="inline-block bg-[#e85b83] text-white px-6 py-3 rounded-lg">Login</Link>
      </div>
    </div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const nextErrors = {}
    const cleanName = formData.name.trim().replace(/\s+/g, " ")
    if (!/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(cleanName) || cleanName.length > 30) {
      nextErrors.name = "Use letters and spaces only (maximum 30 characters)."
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) nextErrors.phone = "Enter a valid 10-digit phone number."
    if (!formData.service) nextErrors.service = "Choose a service from the list."
    if (!formData.date) nextErrors.date = "Choose an appointment date."
    else if (formData.date < today) nextErrors.date = "Choose today or a future date."
    if (!formData.time) nextErrors.time = "Choose an appointment time."
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setLoading(true)
      const selectedService = bookingOptions.find((option) => (option.id || JSON.stringify({ menuId: option.menuId, groupTitle: option.groupTitle, serviceName: option.serviceName })) === formData.service)
      const data = {
        name: cleanName,
        phone: formData.phone.trim(),
        // Keep the short name for compatibility while an older backend is still running.
        service: selectedService?.serviceName,
        ...(selectedService?.id
          ? { serviceId: selectedService.id }
          : { menuId: selectedService?.menuId, groupTitle: selectedService?.groupTitle, serviceName: selectedService?.serviceName }),
        date: formData.date,
        time: formData.time,
      }
      const action = await dispatch(addBooking({ data, token }))
      if (addBooking.fulfilled.match(action)) {
        setSuccess(action.payload)
        setFormData((prev) => ({ ...prev, service: "", date: "", time: "" }))
      } else {
        setError(action.payload || action.error.message || "Could not create booking.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return <div className="min-h-screen bg-[#080709] flex items-center justify-center px-6">
      <div className="bg-[#101014] p-10 rounded-2xl text-center max-w-lg w-full">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-3">Booking Submitted!</h1>
        <p className="text-zinc-400 mb-6">Your appointment request has been sent to Fusion Aura.</p>
        <div className="bg-[#080709] rounded-xl p-5 text-left mb-6">
          <p className="mb-2"><strong>Service:</strong> {success.service}</p>
          <p className="mb-2"><strong>Date:</strong> {success.date}</p>
          <p><strong>Time:</strong> {success.time}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/my-bookings" className="bg-[#e85b83] text-white px-5 py-3 rounded-lg">My Bookings</Link>
          <Link to="/" className="border border-[#e85b83] text-[#f06b91] px-5 py-3 rounded-lg">Home</Link>
        </div>
      </div>
    </div>
  }

  return <div className="min-h-screen bg-[#080709] py-12 px-6">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">Book Your Appointment</h1>
        <p className="text-zinc-400 mt-3">Choose your service, date and preferred time.</p>
      </div>
      <div className="bg-[#101014] rounded-2xl p-4 sm:p-6 md:p-8">
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium mb-2">Full Name</label><input type="text" maxLength="30" autoComplete="name" value={formData.name} aria-invalid={!!fieldErrors.name} onChange={(e)=>{setFormData({...formData,name:e.target.value.replace(/[^\p{L}\p{M} ]/gu, "").replace(/\s+/g, " ").slice(0, 30)});setFieldErrors({...fieldErrors,name:""})}} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" />{fieldErrors.name && <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>}</div>
          <div><label className="block text-sm font-medium mb-2">Phone Number</label><input type="tel" inputMode="numeric" autoComplete="tel" value={formData.phone} maxLength="10" aria-invalid={!!fieldErrors.phone} onChange={(e)=>{setFormData({...formData,phone:e.target.value.replace(/\D/g, "").slice(0, 10)});setFieldErrors({...fieldErrors,phone:""})}} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" />{fieldErrors.phone && <p className="text-red-400 text-sm mt-1">{fieldErrors.phone}</p>}</div>
          <div><label className="block text-sm font-medium mb-2">Select Service</label><select value={formData.service} aria-invalid={!!fieldErrors.service} onChange={(e)=>{setFormData({...formData,service:e.target.value});setFieldErrors({...fieldErrors,service:""})}} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3"><option value="">Choose a service</option>{bookingOptions.map((service, index) => <option key={`${service.name}-${index}`} value={service.id || JSON.stringify({ menuId: service.menuId, groupTitle: service.groupTitle, serviceName: service.serviceName })}>{service.name} — {service.price}</option>)}</select>{fieldErrors.service && <p className="text-red-400 text-sm mt-1">{fieldErrors.service}</p>}</div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium mb-2">Select Date</label><input type="date" min={today} value={formData.date} aria-invalid={!!fieldErrors.date} onChange={(e)=>{setFormData({...formData,date:e.target.value});setFieldErrors({...fieldErrors,date:""})}} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" />{fieldErrors.date && <p className="text-red-400 text-sm mt-1">{fieldErrors.date}</p>}</div>
            <div><label className="block text-sm font-medium mb-2">Select Time</label><select value={formData.time} aria-invalid={!!fieldErrors.time} onChange={(e)=>{setFormData({...formData,time:e.target.value});setFieldErrors({...fieldErrors,time:""})}} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3"><option value="">Choose a time</option>{timeSlots.map(t=><option key={t} value={t}>{t}</option>)}</select>{fieldErrors.time && <p className="text-red-400 text-sm mt-1">{fieldErrors.time}</p>}</div>
          </div>
          <button disabled={loading} className="w-full bg-[#e85b83] text-white py-3 rounded-lg font-medium hover:bg-[#c9476d] disabled:opacity-60">{loading ? "Submitting..." : "Book Appointment"}</button>
        </form>
      </div>
    </div>
  </div>
}
export default Booking
