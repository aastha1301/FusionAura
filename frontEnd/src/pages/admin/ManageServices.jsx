import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addService, updateService, deleteService } from "../../slices/serviceSlice"
import { serviceMenus } from "../../data/serviceMenus"
import Reveal from "../../components/Reveal"

const firstMenu = serviceMenus[0]
const emptyForm = {
  menuId: firstMenu.id,
  menuTitle: firstMenu.title,
  categoryChoice: firstMenu.groups[0].title,
  newGroupTitle: "",
  name: "",
  priceLabel: "",
  time: "As arranged",
  description: "",
  includes: "",
  optionalAddons: "",
}

function ManageServices() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.adminToken)
  const services = useSelector((state) => state.services.services)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const selectedMenu = serviceMenus.find((menu) => menu.id === form.menuId) || firstMenu
  const groupTitle = form.categoryChoice === "__new__" ? form.newGroupTitle.trim() : form.categoryChoice

  const reset = () => {
    setEditId(null)
    setForm(emptyForm)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    setMessage("")
    if (!form.name.trim() || !form.priceLabel.trim() || !groupTitle) {
      setError("Please enter a service name and price, and choose a category.")
      return
    }

    const selected = serviceMenus.find((menu) => menu.id === form.menuId) || firstMenu
    const data = new FormData()
    data.append("menuId", selected.id)
    data.append("menuTitle", selected.title)
    data.append("groupTitle", groupTitle)
    data.append("name", form.name.trim())
    data.append("priceLabel", form.priceLabel.trim())
    data.append("time", form.time.trim() || "As arranged")
    data.append("description", form.description.trim() || selected.description)
    data.append("includes", form.includes)
    data.append("optionalAddons", form.optionalAddons)

    setSaving(true)
    try {
      const action = editId
        ? await dispatch(updateService({ id: editId, formData: data, token }))
        : await dispatch(addService({ formData: data, token }))
      if ((editId ? updateService : addService).fulfilled.match(action)) {
        setMessage(editId ? "Saved. The customer menu and booking list are updated." : "Added. The customer menu and booking list are updated.")
        reset()
      } else {
        setError(action.payload || action.error.message || "Could not save this service.")
      }
    } finally {
      setSaving(false)
    }
  }

  const edit = (service) => {
    const menu = serviceMenus.find((entry) => entry.id === service.menuId) || firstMenu
    const isExistingGroup = menu.groups.some((group) => group.title === service.groupTitle)
    setEditId(service._id)
    setForm({
      menuId: menu.id,
      menuTitle: menu.title,
      categoryChoice: isExistingGroup ? service.groupTitle : "__new__",
      newGroupTitle: isExistingGroup ? "" : service.groupTitle || "",
      name: service.name,
      priceLabel: service.priceLabel || `₹${service.price}`,
      time: service.time || "As arranged",
      description: service.description || "",
      includes: (service.includes || []).join("\n"),
      optionalAddons: (service.optionalAddons || []).join("\n"),
    })
    setError("")
    setMessage("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const startAddingTo = (menu) => {
    setEditId(null)
    setForm({
      ...emptyForm,
      menuId: menu.id,
      menuTitle: menu.title,
      categoryChoice: menu.groups[0].title,
    })
    setError("")
    setMessage("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const remove = async (service) => {
    if (!window.confirm(`Remove ${service.name} from ${service.menuTitle || "the menu"}?`)) return
    const action = await dispatch(deleteService({ id: service._id, token }))
    if (deleteService.fulfilled.match(action)) setMessage("Service removed from the customer menus.")
    else setError(action.error.message || "Could not remove this service.")
  }

  return (
    <div className="min-h-screen bg-[#080706] p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#d8b86e]">Fusion Aura · Jyotika Sharma</p>
          <h1 className="mt-2 font-serif text-3xl text-[#fff1cc] sm:text-4xl">Manage Service Menus</h1>
          <p className="mt-2 text-sm text-zinc-400">Choose a menu, enter a service name and price. Changes show on the customer menu and booking list.</p>
        </div>

        {(error || message) && <div className={`mb-5 rounded-xl border p-3 text-sm ${error ? "border-red-500/20 bg-red-500/10 text-red-400" : "border-green-500/20 bg-green-500/10 text-green-400"}`}>{error || message}</div>}

        <section className="motion-card mb-9 rounded-3xl border border-[#c9a765]/30 bg-[#100e0d] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d8b86e]">{editId ? "Update menu item" : "Quick add"}</p>
              <h2 className="mt-1 font-serif text-2xl text-[#fff1cc]">{editId ? "Edit Service" : "Add a Service"}</h2>
            </div>
            {editId && <button type="button" onClick={reset} className="text-sm text-zinc-400 hover:text-white">Cancel edit</button>}
          </div>

          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-zinc-300">Menu
              <select value={form.menuId} onChange={(event) => {
                const menu = serviceMenus.find((entry) => entry.id === event.target.value) || firstMenu
                setForm({ ...form, menuId: menu.id, menuTitle: menu.title, categoryChoice: menu.groups[0].title, newGroupTitle: "" })
              }} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100">
                {serviceMenus.map((menu) => <option key={menu.id} value={menu.id}>{menu.title}</option>)}
              </select>
            </label>
            <label className="text-sm text-zinc-300">Category <span className="text-zinc-500">(optional)</span>
              <select value={form.categoryChoice} onChange={(event) => setForm({ ...form, categoryChoice: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100">
                {selectedMenu.groups.map((group) => <option key={group.title} value={group.title}>{group.title}</option>)}
                <option value="__new__">Add a new category…</option>
              </select>
            </label>
            {form.categoryChoice === "__new__" && <label className="text-sm text-zinc-300">New category name
              <input value={form.newGroupTitle} onChange={(event) => setForm({ ...form, newGroupTitle: event.target.value })} placeholder="e.g. Hair Styling" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
            </label>}
            <label className="text-sm text-zinc-300">Service name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Bridal Makeup" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
            </label>
            <label className="text-sm text-zinc-300">Price as shown
              <input value={form.priceLabel} onChange={(event) => setForm({ ...form, priceLabel: event.target.value })} placeholder="e.g. ₹2,000 or ₹1,999–₹2,499" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
            </label>
            <details className="sm:col-span-2">
              <summary className="w-fit cursor-pointer text-sm text-zinc-400 hover:text-[#edca83]">Optional details</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-zinc-300">Duration / booking note
                  <input value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} placeholder="As arranged" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
                </label>
                <label className="text-sm text-zinc-300">Short description
                  <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Optional" className="mt-2 w-full rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
                </label>
                <label className="text-sm text-zinc-300 sm:col-span-2">What’s included <span className="text-zinc-500">(one item per line, for packages)</span>
                  <textarea value={form.includes} onChange={(event) => setForm({ ...form, includes: event.target.value })} rows={3} placeholder={"Hair styling\nDupatta draping\nLashes"} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
                </label>
                <label className="text-sm text-zinc-300 sm:col-span-2">Optional bookable add-ons <span className="text-zinc-500">(match a service name in this menu, one per line)</span>
                  <textarea value={form.optionalAddons} onChange={(event) => setForm({ ...form, optionalAddons: event.target.value })} rows={2} placeholder="Hair Styling Artist" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080709] px-4 py-3 text-zinc-100" />
                </label>
              </div>
            </details>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              {error && <p role="alert" className="w-full rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
              <button disabled={saving} className="rounded-xl bg-[#d6b16d] px-6 py-3 font-semibold text-[#17110a] transition hover:bg-[#edca83] disabled:opacity-60">{saving ? "Saving…" : editId ? "Save Changes" : "Add Service"}</button>
              {editId && <button type="button" onClick={reset} className="rounded-xl border border-white/15 px-5 py-3 text-zinc-300">Cancel</button>}
            </div>
          </form>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {serviceMenus.map((menu, index) => {
            const count = services.filter((service) => service.menuId === menu.id).length
            return <Reveal key={menu.id} delay={index * 65} className="motion-card rounded-2xl border border-[#c9a765]/25 bg-[#100e0d] p-4"><span className="text-xs tracking-[0.2em] text-[#d8b86e]">MENU 0{index + 1}</span><h2 className="mt-2 font-serif text-lg text-[#fff1cc]">{menu.title}</h2><p className="mt-1 text-xs text-zinc-500">{count} services</p><button onClick={() => startAddingTo(menu)} className="mt-4 rounded-lg border border-[#d6b16d]/30 px-3 py-2 text-xs text-[#edca83] transition hover:bg-[#d6b16d]/10">+ Add service here</button></Reveal>
          })}
        </div>

        <div className="mt-7 space-y-7">
          {serviceMenus.map((menu, index) => {
            const menuServices = services.filter((service) => service.menuId === menu.id)
            const groupTitles = [...new Set([...menu.groups.map((group) => group.title), ...menuServices.map((service) => service.groupTitle).filter(Boolean)])]
            return (
              <Reveal as="section" id={`admin-${menu.id}`} key={menu.id} delay={index * 70} className="motion-card scroll-mt-24 overflow-hidden rounded-3xl border border-[#c9a765]/30 bg-[#100e0d]">
                <div className="border-b border-[#c9a765]/20 bg-[radial-gradient(ellipse_at_top_right,rgba(195,148,70,0.12),transparent_60%)] px-5 py-6 sm:px-8">
                  <p className="text-xs uppercase tracking-[0.23em] text-[#d8b86e]">Menu 0{index + 1} · {menu.eyebrow}</p>
                  <h2 className="mt-2 font-serif text-2xl text-[#fff1cc] sm:text-3xl">{menu.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{menu.description}</p>
                </div>
                <div className="grid gap-x-10 gap-y-7 px-5 py-6 sm:grid-cols-2 sm:px-8">
                  {groupTitles.map((groupTitle) => {
                    const groupServices = menuServices.filter((service) => service.groupTitle === groupTitle)
                    if (!groupServices.length) return null
                    return <div key={groupTitle}>
                      <h3 className="mb-3 border-b border-[#c9a765]/20 pb-2 font-serif text-lg text-[#e8c77d]">{groupTitle}</h3>
                      <div className="divide-y divide-white/5">
                        {groupServices.map((service) => <div key={service._id} className="flex min-w-0 items-start justify-between gap-3 py-3">
                          <div className="min-w-0 flex-1"><p className="break-words text-sm text-zinc-100">{service.name}</p><p className="mt-1 break-words text-xs text-zinc-500">{service.time || "As arranged"}</p></div>
                          <div className="flex shrink-0 flex-col items-end gap-2"><span className="max-w-[9rem] break-words text-right text-sm font-semibold text-[#edca83]">{service.priceLabel || `₹${service.price}`}</span><div className="flex gap-2"><button onClick={() => edit(service)} className="rounded-lg border border-[#d6b16d]/30 px-3 py-1 text-xs text-[#edca83] hover:bg-[#d6b16d]/10">Edit</button><button onClick={() => remove(service)} className="rounded-lg border border-red-500/25 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">Delete</button></div></div>
                        </div>)}
                      </div>
                    </div>
                  })}
                  {menuServices.length === 0 && <p className="text-sm text-zinc-500">No services in this menu yet. Use the form above to add one.</p>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ManageServices
