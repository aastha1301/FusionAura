import { useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addBooking } from "../slices/bookingSlice"
import Reveal from "../components/Reveal"
import { bookingServices as defaultBookingServices, findCatalogService } from "../data/serviceMenus"

function serviceKey(service) {
  return JSON.stringify({ menuId: service.menuId, groupTitle: service.groupTitle, serviceName: service.serviceName })
}

function Booking() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const services = useSelector((state) => state.services.services)
  const servicesReady = useSelector((state) => state.services.hasFetched) && services.length > 0 && services.every((service) => service.menuId)
  const bookingOptions = servicesReady
    ? services.map((service) => {
        const catalog = findCatalogService(service.menuId, service.groupTitle, service.name)
        return {
          id: service._id,
          menuId: service.menuId,
          menuTitle: service.menuTitle,
          groupTitle: service.groupTitle,
          serviceName: service.name,
          price: service.priceLabel || `₹${service.price}`,
          detail: service.time === "As arranged" ? "" : service.time,
          includes: service.includes?.length ? service.includes : (catalog?.includes || []),
          optionalAddons: service.optionalAddons?.length ? service.optionalAddons : (catalog?.optionalAddons || []),
        }
      })
    : defaultBookingServices.map((service) => ({ ...service, serviceName: service.name }))

  const requested = {
    menuId: searchParams.get("menuId") || "",
    groupTitle: searchParams.get("groupTitle") || "",
    serviceName: searchParams.get("serviceName") || "",
  }
  const requestedService = requested.menuId && requested.groupTitle && requested.serviceName ? serviceKey(requested) : ""
  const [formData, setFormData] = useState({ name: user?.name || "", phone: user?.phone || "", date: "", time: "" })
  const [selectedServiceKeys, setSelectedServiceKeys] = useState(() => requestedService ? [requestedService] : [])
  const [serviceToAddKey, setServiceToAddKey] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  const selectedServices = selectedServiceKeys.map((key) => bookingOptions.find((option) => serviceKey(option) === key)).filter(Boolean)
  const availableServices = bookingOptions.filter((option) => !selectedServiceKeys.includes(serviceKey(option)))
  const availableMenus = [...new Map(availableServices.map((option) => [option.menuId, option.menuTitle])).entries()]
  const suggestedServices = selectedServices.flatMap((service) => (service.optionalAddons || []).flatMap((name) => availableServices.filter((option) => option.menuId === service.menuId && option.serviceName === name)))
  const serviceToAdd = availableServices.find((option) => serviceKey(option) === serviceToAddKey)

  if (!user) {
    const from = { pathname: location.pathname, search: location.search }
    return <main className="min-h-screen bg-[#080709] flex items-center justify-center px-6">
      <div className="bg-[#101014] p-8 sm:p-10 rounded-2xl text-center max-w-md">
        <div className="text-5xl mb-4">🌸</div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-3">Log in to book</h1>
        <p className="text-zinc-400 mb-6">Your chosen service will still be selected after you log in.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/login" state={{ from }} className="inline-block bg-[#e85b83] text-white px-6 py-3 rounded-lg">Log in</Link>
          <Link to="/signup" state={{ from }} className="inline-block border border-white/15 text-zinc-100 px-6 py-3 rounded-lg">Create account</Link>
        </div>
      </div>
    </main>
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    const nextErrors = {}
    const cleanName = formData.name.trim().replace(/\s+/g, " ")
    if (!/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(cleanName) || cleanName.length > 30) nextErrors.name = "Use letters and spaces only (maximum 30 characters)."
    if (!/^\d{10}$/.test(formData.phone.trim())) nextErrors.phone = "Enter a valid 10-digit phone number."
    if (selectedServices.length === 0) nextErrors.service = "Add at least one service to your booking."
    if (!formData.date) nextErrors.date = "Choose an appointment date."
    else if (formData.date < today) nextErrors.date = "Choose today or a future date."
    if (!formData.time) nextErrors.time = "Choose an appointment time."
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      setLoading(true)
      const selections = selectedServices
      const [primaryService, ...additionalServices] = selections
      const data = {
        name: cleanName,
        phone: formData.phone.trim(),
        service: primaryService.serviceName,
        ...(primaryService.id
          ? { serviceId: primaryService.id }
          : { menuId: primaryService.menuId, groupTitle: primaryService.groupTitle, serviceName: primaryService.serviceName }),
        addOns: additionalServices.map((option) => ({
          ...(option.id ? { serviceId: option.id } : { menuId: option.menuId, groupTitle: option.groupTitle, serviceName: option.serviceName }),
        })),
        date: formData.date,
        time: formData.time,
      }
      const action = await dispatch(addBooking({ data, token }))
      if (addBooking.fulfilled.match(action)) {
        setSuccess({ ...action.payload, selections })
        setFormData((previous) => ({ ...previous, date: "", time: "" }))
      } else {
        setError(action.payload || action.error.message || "Could not create booking.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return <main className="min-h-screen bg-[#080709] flex items-center justify-center px-4 py-10">
      <section className="motion-card bg-[#101014] p-7 sm:p-10 rounded-2xl max-w-lg w-full">
        <div className="text-center"><div className="text-5xl mb-4">✅</div><h1 className="text-3xl font-bold text-zinc-100">Booking requested</h1><p className="text-zinc-400 mt-3">Fusion Aura will contact you to confirm the appointment.</p></div>
        <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#f0a7bd]">{success.selections.length === 1 ? "Your service" : "Your combo"}</p>
          <ul className="mt-3 space-y-3">{success.selections.map((item) => <li key={serviceKey(item)} className="flex items-start justify-between gap-3 text-sm"><span><strong className="text-white">{item.serviceName}</strong><span className="block text-xs text-zinc-400">{item.menuTitle} · {item.groupTitle}</span></span><span className="shrink-0 text-[#edca83]">{item.price}</span></li>)}</ul>
          {success.selections.some((item) => item.includes?.length) && <div className="mt-4 border-t border-white/10 pt-4"><p className="text-xs font-semibold text-zinc-200">Package inclusions</p><ul className="mt-2 grid gap-1 text-sm text-zinc-300 sm:grid-cols-2">{[...new Set(success.selections.flatMap((item) => item.includes || []))].map((item) => <li key={item}>✓ {item}</li>)}</ul></div>}
          <div className="mt-4 border-t border-white/10 pt-4 text-sm text-zinc-300"><p><strong>Date:</strong> {success.date}</p><p className="mt-1"><strong>Time:</strong> {success.time}</p></div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/my-bookings" className="rounded-lg bg-[#e85b83] px-5 py-3 text-sm font-semibold text-white">My Bookings</Link><Link to="/services" className="rounded-lg border border-white/15 px-5 py-3 text-sm text-zinc-200">Back to menu</Link></div>
      </section>
    </main>
  }

  const addServiceToSelection = (service) => {
    const key = serviceKey(service)
    if (selectedServiceKeys.includes(key) || selectedServiceKeys.length >= 5) return
    setSelectedServiceKeys((current) => [...current, key])
    setServiceToAddKey("")
    setFieldErrors((current) => ({ ...current, service: "" }))
  }

  return <main className="min-h-screen bg-[#080709] px-4 py-8 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <Link to="/services" className="text-sm text-[#f0a7bd] hover:text-white">← Back to services menu</Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#edca83]">Appointment request</p><h1 className="mt-2 text-3xl font-bold text-zinc-100 sm:text-4xl">Book your visit</h1><p className="mt-2 text-sm text-zinc-400">Choose one service, or add more to create a combo.</p></div><span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300">{selectedServices.length} of 5 selected</span></div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
          <Reveal as="section" className="motion-card rounded-2xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e85b83]/20 text-sm font-bold text-[#ffc5d6]">1</span><div><h2 className="font-semibold text-white">Services for this booking</h2><p className="text-xs text-zinc-400">Choose one for a single service, or add more to make a combo.</p></div></div>

            <label htmlFor="service-to-add" className="mb-2 block text-sm font-medium text-zinc-200">Select a service from the menu</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select id="service-to-add" value={serviceToAddKey} onChange={(event) => setServiceToAddKey(event.target.value)} disabled={selectedServices.length >= 5 || availableServices.length === 0} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-sm disabled:opacity-50">
                <option value="">{selectedServices.length ? "Choose another service for your combo" : "Choose a service"}</option>
                {suggestedServices.length > 0 && <optgroup label="Suggested with your selection">{suggestedServices.map((option) => <option key={serviceKey(option)} value={serviceKey(option)}>{option.serviceName} — {option.price}</option>)}</optgroup>}
                {availableMenus.map(([menuId, menuTitle]) => <optgroup key={menuId} label={menuTitle}>{availableServices.filter((option) => option.menuId === menuId && !suggestedServices.some((suggested) => serviceKey(suggested) === serviceKey(option))).map((option) => <option key={serviceKey(option)} value={serviceKey(option)}>{option.groupTitle} · {option.serviceName} — {option.price}</option>)}</optgroup>)}
              </select>
              <button type="button" onClick={() => serviceToAdd && addServiceToSelection(serviceToAdd)} disabled={!serviceToAdd || selectedServices.length >= 5} className="shrink-0 rounded-xl border border-[#f0a7bd]/30 bg-[#e85b83]/10 px-5 py-3 text-sm font-semibold text-[#ffdce6] transition hover:bg-[#e85b83]/20 disabled:cursor-not-allowed disabled:opacity-40">Add service</button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Add one service for a simple booking, or select more services to create a combo.</p>
            {fieldErrors.service && <p className="mt-2 text-sm text-red-400">{fieldErrors.service}</p>}

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-white">Selected services</h3><span className="text-xs text-zinc-500">{selectedServices.length}/5</span></div>
              {selectedServices.length > 0 ? <ul className="space-y-2">{selectedServices.map((item) => <li key={serviceKey(item)} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <div className="flex items-start justify-between gap-3"><span className="min-w-0"><strong className="block text-sm text-white">{item.serviceName}</strong><span className="block text-xs text-zinc-400">{item.menuTitle} · {item.groupTitle}</span></span><span className="flex shrink-0 items-center gap-2"><span className="text-sm font-medium text-[#edca83]">{item.price}</span><button type="button" onClick={() => setSelectedServiceKeys((current) => current.filter((key) => key !== serviceKey(item)))} aria-label={`Remove ${item.serviceName}`} className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-zinc-400 hover:border-red-400/40 hover:text-red-300">×</button></span></div>
                {item.detail && <p className="mt-2 text-xs text-zinc-400">{item.detail}</p>}
                {item.includes?.length > 0 && <p className="mt-2 text-xs leading-5 text-zinc-400">Includes: {item.includes.join(" · ")}</p>}
              </li>)}</ul> : <p className="rounded-xl border border-dashed border-white/15 p-4 text-center text-sm text-zinc-400">Your selected services will appear here. Search above to add one.</p>}
              {selectedServices.length >= 5 && <p className="mt-2 text-xs text-zinc-500">You’ve reached the five-service limit for one booking.</p>}
            </div>
          </Reveal>

        <Reveal as="section" delay={90} className="motion-card rounded-2xl border border-white/10 bg-[#101014] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e85b83]/20 text-sm font-bold text-[#ffc5d6]">2</span><div><h2 className="font-semibold text-white">Appointment details</h2><p className="text-xs text-zinc-400">Your contact, then your preferred time.</p></div></div>

          <div className="space-y-5">
            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f0a7bd]">Your contact</legend>
              <div><label htmlFor="booking-name" className="mb-1.5 block text-sm font-medium text-zinc-200">Full name</label><input id="booking-name" type="text" maxLength="30" autoComplete="name" placeholder="Name for the appointment" value={formData.name} aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? "booking-name-error" : undefined} required onChange={(event) => { setFormData({ ...formData, name: event.target.value.replace(/[^\p{L}\p{M} ]/gu, "").replace(/\s+/g, " ").slice(0, 30) }); setFieldErrors({ ...fieldErrors, name: "" }) }} className="w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-sm" />{fieldErrors.name && <p id="booking-name-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>}</div>
              <div><label htmlFor="booking-phone" className="mb-1.5 block text-sm font-medium text-zinc-200">Mobile number</label><input id="booking-phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit phone number" value={formData.phone} maxLength="10" aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? "booking-phone-error" : "booking-phone-hint"} required onChange={(event) => { setFormData({ ...formData, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }); setFieldErrors({ ...fieldErrors, phone: "" }) }} className="w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-sm" />{fieldErrors.phone ? <p id="booking-phone-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.phone}</p> : <p id="booking-phone-hint" className="mt-1.5 text-xs text-zinc-500">We’ll use this number to confirm your request.</p>}</div>
            </fieldset>

            <fieldset className="border-t border-white/10 pt-4">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f0a7bd]">When would you like to visit?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label htmlFor="booking-date" className="mb-1.5 block text-sm font-medium text-zinc-200">Preferred date</label><input id="booking-date" type="date" min={today} value={formData.date} aria-invalid={!!fieldErrors.date} aria-describedby={fieldErrors.date ? "booking-date-error" : undefined} required onChange={(event) => { setFormData({ ...formData, date: event.target.value }); setFieldErrors({ ...fieldErrors, date: "" }) }} className="w-full rounded-xl border border-white/10 bg-[#080709] px-3 py-3 text-sm" />{fieldErrors.date && <p id="booking-date-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.date}</p>}</div>
                <div><label htmlFor="booking-time" className="mb-1.5 block text-sm font-medium text-zinc-200">Preferred time</label><select id="booking-time" value={formData.time} aria-invalid={!!fieldErrors.time} aria-describedby={fieldErrors.time ? "booking-time-error" : undefined} required onChange={(event) => { setFormData({ ...formData, time: event.target.value }); setFieldErrors({ ...fieldErrors, time: "" }) }} className="w-full rounded-xl border border-white/10 bg-[#080709] px-3 py-3 text-sm"><option value="">Choose a time</option>{timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}</select>{fieldErrors.time && <p id="booking-time-error" className="mt-1.5 text-xs text-red-400">{fieldErrors.time}</p>}</div>
              </div>
              <p className="mt-2 text-xs text-zinc-500">Available request times: 10:00 AM–8:00 PM.</p>
            </fieldset>
          </div>

          <div className="mt-5">
            <div className="min-w-0 rounded-2xl border border-[#edca83]/15 bg-gradient-to-br from-[#edca83]/[0.07] to-white/[0.025] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Your booking</p><span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.65rem] text-zinc-400">{selectedServices.length === 1 ? "Single" : selectedServices.length > 1 ? "Combo" : "No service"}</span></div>{selectedServices.length > 0 ? <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">{selectedServices.map((item) => <li key={serviceKey(item)} className="flex gap-3 text-xs"><span className="text-zinc-300">{item.serviceName}</span><span className="shrink-0 text-[#edca83]">{item.price}</span></li>)}</ul> : <p className="mt-2 text-xs text-zinc-500">Add a service to see your summary.</p>}<p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-zinc-400">The salon will confirm availability and the final price with you.</p></div>
            <button disabled={loading || selectedServices.length === 0} className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e85b83]/15 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e85b83]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-52">{loading ? "Sending request…" : "Book appointment"}</button>
          </div>
        </Reveal>
      </form>
    </div>
  </main>
}

export default Booking
