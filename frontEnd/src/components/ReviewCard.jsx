function ReviewCard({ name, review, rating, floating = true }) {
  return (
    <div className={`${floating ? "motion-card float-card hover:border-[#e85b83]/30 transition" : "simple-card border border-white/10"} bg-[#101014] rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.30)]`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b1015] border border-[#e85b83]/30 flex items-center justify-center text-[#f06b91] font-semibold">
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="break-words font-semibold text-zinc-100">{name}</h3>
            <p className="text-xs text-zinc-500">Verified customer</p>
          </div>
        </div>
        <span role="img" aria-label={`${rating} out of 5 stars`} className="shrink-0 whitespace-nowrap text-lg tracking-tight text-[#edca83] drop-shadow-[0_0_8px_rgba(237,202,131,0.28)] transition-transform duration-200 hover:scale-110 sm:text-xl">
          {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </span>
      </div>
      <p className="break-words text-sm leading-6 text-zinc-400">“{review}”</p>
    </div>
  )
}

export default ReviewCard
