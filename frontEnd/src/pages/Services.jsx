import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { findCatalogService, serviceMenus } from "../data/serviceMenus"

function bookingLink(menuId, groupTitle, serviceName) {
  const query = new URLSearchParams({ menuId, groupTitle, serviceName })
  return `/booking?${query.toString()}`
}

function describeService(item, menuTitle, menuDescription, groupTitle) {
  if (item.description && item.description !== "Professional beauty and salon service.") return item.description
  if (menuTitle === "Makeup & Bridal") {
    return `${item.name} is the makeup option listed for ${groupTitle}. Check the package list below for the exact inclusions; the salon can confirm the look and timing for your event.`
  }
  if (groupTitle === "Facials") {
    return `${item.name} is one of the facial options on the menu. The menu doesn’t specify the products or treatment steps, so contact the salon if you want those details before booking.`
  }
  if (groupTitle === "Clean-ups") {
    return `${item.name} is a clean-up option from the salon menu. Exact products and steps aren’t listed; the salon can confirm them before your appointment.`
  }
  if (groupTitle === "Bleach & Body") {
    return `${item.name} is listed under Bleach & Body. The menu doesn’t specify the application area or product details, so please confirm those with the salon.`
  }
  if (groupTitle === "Hands & Feet") {
    const descriptions = {
      Manicure: "A hand and nail grooming service. Ask the salon which steps and finish are included in this option.",
      Pedicure: "A foot and toenail grooming service. Ask the salon which steps and finish are included in this option.",
      "Nail Paint": "Nail color application from the Hands & Feet menu. Confirm available shades and whether removal is included with the salon.",
      "Hand Scrub": "A scrub service for the hands. Confirm the product and treatment details with the salon.",
      "Foot Scrub": "A scrub service for the feet. Confirm the product and treatment details with the salon.",
      "D-Tan": "A D-Tan option from the Hands & Feet menu. Confirm the application area and product details with the salon.",
    }
    return descriptions[item.name] || `${item.name} is available from the Hands & Feet menu. Ask the salon to confirm the exact steps.`
  }
  if (groupTitle === "Flower Mask / Power Mask") {
    return `${item.name} is a mask option from the salon menu. The menu doesn’t list the product or steps; contact the salon for details before booking.`
  }
  if (groupTitle === "Pricing per day" && item.name === "Hair Styling Artist") {
    return "An optional hair-styling service that you can add to a pre-wedding makeup appointment. The listed price is per day."
  }
  if (groupTitle === "Pricing per day" && item.name === "Full-Day Professional Makeup") {
    return "A professional makeup booking for the full day, with service available for up to 12 hours. The listed package includes premium-quality products and a camera-ready finish."
  }
  return `${item.name} is offered as part of ${menuTitle}. ${menuDescription}`
}

function PriceList({ items, menuId, menuTitle, menuDescription, menuNotes, groupTitle }) {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!selected) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const closeOnEscape = (event) => { if (event.key === "Escape") setSelected(null) }
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  const serviceDescription = selected ? describeService(selected, menuTitle, menuDescription, groupTitle) : ""

  return (
    <div className="divide-y divide-[#d6b16d]/15">
      {items.map((item) => (
        <div key={`${item.name}-${item.price}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <button type="button" onClick={() => setSelected(item)} aria-label={`Show details for ${item.name}`} aria-haspopup="dialog" className="group inline-flex items-center gap-2 text-left text-sm font-semibold text-zinc-100 sm:text-base">
              <span className="decoration-[#f0a7bd]/70 underline-offset-4 group-hover:underline">{item.name}</span>
              <span aria-hidden="true" className="text-xs text-[#f0a7bd]">ⓘ</span>
            </button>
            {item.detail && <p className="mt-1 text-xs text-zinc-400">{item.detail}</p>}
            {item.includes?.length > 0 && <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#f0c4d2]">Included in this package</p>
              <ul className="mt-1.5 grid gap-x-4 gap-y-1 text-xs leading-5 text-zinc-300 sm:grid-cols-2">
                {item.includes.map((included) => <li key={included} className="flex gap-2"><span className="text-[#edca83]">✓</span><span>{included}</span></li>)}
              </ul>
            </div>}
            {item.optionalAddons?.length > 0 && <p className="mt-2 text-xs text-zinc-400"><span className="font-semibold text-[#f0c4d2]">Optional add-on:</span> {item.optionalAddons.join(", ")} — select it while booking.</p>}
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
            <span className="text-sm sm:text-base font-semibold text-[#edca83]">{item.price}</span>
            <Link to={bookingLink(menuId, groupTitle, item.name)} className="inline-flex items-center justify-center rounded-full border border-[#f0a7bd]/40 bg-[#e85b83]/15 px-4 py-2 text-xs font-semibold text-[#ffdce6] transition hover:bg-[#e85b83]/30">Book this service →</Link>
          </div>
        </div>
      ))}
      {selected && createPortal(<div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overscroll-contain bg-[#09070cdb] px-3 py-4 backdrop-blur-md sm:px-5 sm:py-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="service-details-title" className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-white/15 bg-[#1b151f]/[0.98] shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#211923]/95 bg-gradient-to-br from-[#e85b83]/15 via-[#211923]/95 to-[#edca83]/[0.06] px-5 pb-5 pt-6 backdrop-blur-2xl sm:px-7 sm:pb-6">
            <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Close service details" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/20 text-lg text-zinc-300 transition hover:bg-white/10">×</button>
            <p className="pr-12 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#edca83]">Service details</p>
            <h2 id="service-details-title" className="mt-2 pr-10 font-serif text-2xl leading-tight text-white sm:text-3xl">{selected.name}</h2>
            <p className="mt-2 text-xs text-zinc-400">{menuTitle}<span className="mx-2 text-[#edca83]">/</span>{groupTitle}</p>
            {selected.optionalAddons?.length > 0 && <span className="mt-3 inline-flex rounded-full border border-[#edca83]/20 bg-[#edca83]/10 px-3 py-1 text-[0.68rem] font-medium text-[#f6dda1]">Combo extra available</span>}
          </header>

          <div className="space-y-4 px-5 py-5 sm:px-7">
            <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e85b83]/15 text-xs font-bold text-[#f5b3c7]">01</span><h3 className="text-sm font-semibold text-white">About the service</h3></div>
              <p className="pl-8 text-sm leading-6 text-zinc-300">{serviceDescription}</p>
            </section>

            <section className={`rounded-2xl border p-4 sm:p-5 ${selected.includes?.length ? "border-[#edca83]/20 bg-[#edca83]/[0.055]" : "border-white/10 bg-white/[0.025]"}`}>
              <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#edca83]/10 text-xs font-bold text-[#edca83]">02</span><h3 className="text-sm font-semibold text-white">{selected.includes?.length ? "What’s included" : "Package details"}</h3></div>
              {selected.includes?.length > 0 ? <ul className="mt-3 grid gap-2 pl-8 sm:grid-cols-2">{selected.includes.map((included) => <li key={included} className="flex items-start gap-2 text-sm leading-5 text-zinc-200"><span className="mt-0.5 text-[#edca83]">✓</span><span>{included}</span></li>)}</ul> : <p className="mt-2 pl-8 text-xs leading-5 text-zinc-400">The menu doesn’t list what’s included in this service. Ask the salon to confirm products and treatment steps before booking.</p>}
              {selected.detail && <p className="mt-3 border-t border-white/10 pt-3 pl-8 text-xs text-zinc-400">{selected.detail}</p>}
            </section>

            {selected.optionalAddons?.length > 0 && <section className="rounded-2xl border border-[#f0a7bd]/15 bg-[#e85b83]/[0.06] p-4 sm:p-5"><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e85b83]/15 text-xs font-bold text-[#f0a7bd]">＋</span><h3 className="text-sm font-semibold text-white">Add to make a combo</h3></div><p className="mt-2 pl-8 text-sm text-zinc-300">{selected.optionalAddons.join(", ")}</p><p className="mt-1 pl-8 text-xs text-zinc-500">Choose this or other services in the booking form.</p></section>}

            {menuNotes?.length > 0 && <details className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><summary className="cursor-pointer text-xs font-semibold text-zinc-300">Read menu terms and notes</summary><ul className="mt-3 space-y-2 text-xs leading-5 text-zinc-400">{menuNotes.map((note) => <li key={note}>{note}</li>)}</ul></details>}
          </div>

          <footer className="sticky bottom-0 flex items-center gap-3 border-t border-white/10 bg-[#17121b]/[0.98] px-5 py-4 backdrop-blur-2xl sm:px-7">
            <div className="min-w-0 flex-1"><p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-zinc-500">Listed menu price</p><p className="mt-0.5 truncate text-sm font-semibold text-[#edca83]">{selected.price}</p></div>
            <Link to={bookingLink(menuId, groupTitle, selected.name)} className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#e85b83] to-[#f39ab3] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e85b83]/15 transition hover:-translate-y-0.5">Book this service <span className="ml-2">→</span></Link>
          </footer>
        </section>
      </div>, document.body)}
    </div>
  )
}

function MenuSection({ menu, index }) {
  return (
    <section id={menu.id} className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-[#c9a765]/35 bg-[#100e0d] shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
      <div className="relative border-b border-[#c9a765]/20 px-6 py-7 sm:px-9 sm:py-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(195,148,70,0.12),transparent_55%)]" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9b76f]/50 text-2xl text-[#edca83]">{menu.icon}</div>
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.25em] text-[#d8b86e]">Menu 0{index + 1} · {menu.eyebrow}</p>
            <h2 className="mt-2 font-serif text-3xl text-[#fff1cc] sm:text-4xl">{menu.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{menu.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-7 px-6 py-7 sm:px-9 sm:py-9 lg:grid-cols-2">
        {menu.groups.map((group) => (
          <div key={group.title} className={group.columns ? "lg:col-span-2" : ""}>
            <h3 className="mb-3 flex items-center gap-3 font-serif text-lg text-[#e8c77d]">
              <span className="h-px flex-1 bg-[#c9a765]/25" />{group.title}<span className="h-px flex-1 bg-[#c9a765]/25" />
            </h3>
            <PriceList items={group.items} menuId={menu.id} menuTitle={menu.title} menuDescription={menu.description} menuNotes={menu.notes} groupTitle={group.title} />
          </div>
        ))}
      </div>

      {menu.notes.length > 0 && (
        <div className="border-t border-[#c9a765]/20 bg-black/20 px-6 py-6 sm:px-9">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8b86e]">{menu.id === "makeup" ? "Inclusions & important notes" : menu.id === "pre-wedding" ? "What you get & booking terms" : "Menu note"}</h3>
          <ul className="grid gap-2 text-sm leading-6 text-zinc-400 sm:grid-cols-2">
            {menu.notes.map((note) => <li key={note} className="flex gap-2"><span className="text-[#d8b86e]">✦</span><span>{note}</span></li>)}
          </ul>
        </div>
      )}
    </section>
  )
}

function Services() {
  const services = useSelector((state) => state.services.services)
  const hasFetched = useSelector((state) => state.services.hasFetched)
  const catalogReady = hasFetched && services.every((service) => service.menuId && service.groupTitle)
  const menus = catalogReady
    ? serviceMenus.map((menu) => {
        const menuServices = services.filter((service) => service.menuId === menu.id)
        const groups = menu.groups.flatMap((group) => {
          const groupServices = menuServices.filter((service) => service.groupTitle === group.title)
          return groupServices.length ? [{ ...group, items: groupServices.map((service) => ({ name: service.name, price: service.priceLabel || `₹${service.price}`, detail: service.time === "As arranged" ? "" : service.time, description: service.description || "", includes: service.includes || [], optionalAddons: service.optionalAddons || [] })) }] : []
        })
        const extraGroups = [...new Set(menuServices.map((service) => service.groupTitle))]
          .filter((title) => !menu.groups.some((group) => group.title === title))
          .map((title) => ({ title, items: menuServices.filter((service) => service.groupTitle === title).map((service) => ({ name: service.name, price: service.priceLabel || `₹${service.price}`, detail: service.time === "As arranged" ? "" : service.time, description: service.description || "", includes: service.includes || [], optionalAddons: service.optionalAddons || [] })) }))
        return { ...menu, groups: [...groups, ...extraGroups] }
      })
    : serviceMenus

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="relative mb-10 overflow-hidden rounded-[2rem] border border-[#c9a765]/35 bg-[#100e0d] px-6 py-12 text-center sm:mb-14 sm:px-10 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(195,148,70,0.18),transparent_60%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b86e]">Fusion Aura · by Jyotika Sharma</p>
            <h1 className="mt-4 font-serif text-4xl text-[#fff1cc] sm:text-6xl">Services & Menu</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Compare services, prices and package inclusions. Choose the exact option you like to start its booking.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {menus.map((menu, index) => <a key={menu.id} href={`#${menu.id}`} className="rounded-full border border-[#d6b16d]/30 px-4 py-2 text-xs text-[#f0d99e] transition hover:bg-[#d6b16d]/10">0{index + 1} · {menu.title}</a>)}
            </div>
          </div>
        </header>

        <div className="space-y-7 sm:space-y-9">
          {menus.map((menu, index) => {
            const completeMenu = {
              ...menu,
              groups: menu.groups.map((group) => ({
                ...group,
                items: group.items.map((item) => ({
                  ...item,
                  includes: item.includes?.length ? item.includes : (findCatalogService(menu.id, group.title, item.name)?.includes || []),
                  optionalAddons: item.optionalAddons?.length ? item.optionalAddons : (findCatalogService(menu.id, group.title, item.name)?.optionalAddons || []),
                  description: item.description || findCatalogService(menu.id, group.title, item.name)?.description || "",
                })),
              })),
            }
            return <MenuSection key={menu.id} menu={completeMenu} index={index} />
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-[#c9a765]/25 bg-[#100e0d] p-6 text-center sm:mt-14 sm:p-8">
          <p className="font-serif text-2xl text-[#fff1cc]">Let’s make you look your most beautiful self!</p>
          <p className="mt-2 text-sm text-zinc-400">Shop No. 106, Workshop Road · Opp. Bank of India · Yamuna Nagar</p>
          <p className="mt-1 text-sm text-zinc-400">Call / WhatsApp: +91 70825 55235 · +91 86840 55240</p>
          <a href="#makeup" className="mt-6 inline-flex rounded-full bg-[#d6b16d] px-6 py-3 text-sm font-semibold text-[#17110a] transition hover:bg-[#edca83]">Choose a service above to book</a>
        </div>
      </div>
    </main>
  )
}

export default Services
