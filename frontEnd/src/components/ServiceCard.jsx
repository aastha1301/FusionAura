import { Link } from "react-router-dom"

function ServiceCard({ name, price, image, description, time }) {
  return <div className="group bg-[#101014] border border-white/10 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:border-[#e85b83]/40 transition duration-300">
    <div className="relative overflow-hidden"><img src={image || "/peacock-feather.svg"} alt={name} className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /></div>
    <div className="p-5"><h3 className="text-lg font-semibold text-zinc-100">{name}</h3><p className="text-zinc-500 text-sm mt-2 leading-6 line-clamp-2">{description}</p>
      <div className="flex justify-between items-end gap-3 mt-5"><div><p className="text-[#f06b91] font-semibold">{price}</p><p className="text-zinc-500 text-xs mt-1">◷ {time}</p></div><Link to="/booking" className="bg-[#e85b83] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#c9476d] transition">Book Now</Link></div>
    </div>
  </div>
}
export default ServiceCard
