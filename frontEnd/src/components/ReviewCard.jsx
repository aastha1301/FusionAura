function ReviewCard({ name, review, rating }) {
  return (
    <div className="bg-[#101014] border border-white/10 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.30)] hover:border-[#e85b83]/30 transition">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b1015] border border-[#e85b83]/30 flex items-center justify-center text-[#f06b91] font-semibold">
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">{name}</h3>
            <p className="text-xs text-zinc-500">Verified customer</p>
          </div>
        </div>
        <div className="text-[#f06b91] text-sm">
          {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </div>
      </div>
      <p className="text-zinc-400 text-sm leading-6">“{review}”</p>
    </div>
  )
}

export default ReviewCard
