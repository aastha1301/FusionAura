import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { serviceMenus } from "../data/serviceMenus"

function PriceList({ items }) {
  return (
    <div className="divide-y divide-[#d6b16d]/15">
      {items.map((item) => (
        <div key={`${item.name}-${item.price}`} className="flex items-start justify-between gap-4 py-3">
          <div>
            <p className="text-sm sm:text-base text-zinc-100">{item.name}</p>
            {item.detail && <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>}
          </div>
          <span className="shrink-0 text-sm sm:text-base font-semibold text-[#edca83]">{item.price}</span>
        </div>
      ))}
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
            <PriceList items={group.items} />
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
          return groupServices.length ? [{ ...group, items: groupServices.map((service) => ({ name: service.name, price: service.priceLabel || `₹${service.price}`, detail: service.time === "As arranged" ? "" : service.time })) }] : []
        })
        const extraGroups = [...new Set(menuServices.map((service) => service.groupTitle))]
          .filter((title) => !menu.groups.some((group) => group.title === title))
          .map((title) => ({ title, items: menuServices.filter((service) => service.groupTitle === title).map((service) => ({ name: service.name, price: service.priceLabel || `₹${service.price}`, detail: service.time === "As arranged" ? "" : service.time })) }))
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
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Beauty, bridal and pre-wedding services, with prices from our four menus.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {menus.map((menu, index) => <a key={menu.id} href={`#${menu.id}`} className="rounded-full border border-[#d6b16d]/30 px-4 py-2 text-xs text-[#f0d99e] transition hover:bg-[#d6b16d]/10">0{index + 1} · {menu.title}</a>)}
            </div>
          </div>
        </header>

        <div className="space-y-7 sm:space-y-9">
          {menus.map((menu, index) => <MenuSection key={menu.id} menu={menu} index={index} />)}
        </div>

        <div className="mt-10 rounded-2xl border border-[#c9a765]/25 bg-[#100e0d] p-6 text-center sm:mt-14 sm:p-8">
          <p className="font-serif text-2xl text-[#fff1cc]">Let’s make you look your most beautiful self!</p>
          <p className="mt-2 text-sm text-zinc-400">Shop No. 106, Workshop Road · Opp. Bank of India · Yamuna Nagar</p>
          <p className="mt-1 text-sm text-zinc-400">Call / WhatsApp: +91 70825 55235 · +91 86840 55240</p>
          <Link to="/booking" className="mt-6 inline-flex rounded-full bg-[#d6b16d] px-6 py-3 text-sm font-semibold text-[#17110a] transition hover:bg-[#edca83]">Book an appointment</Link>
        </div>
      </div>
    </main>
  )
}

export default Services
