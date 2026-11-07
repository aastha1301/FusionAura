import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addReview } from "../slices/reviewSlice"
import ReviewCard from "../components/ReviewCard"

function Reviews() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const reviews = useSelector((state) => state.reviews.reviews)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("")
    if (!user) return setError("Please login before submitting a review.")
    if (!rating) return setError("Please choose a star rating.")
    if (reviewText.trim().length < 10) return setError("Review must be at least 10 characters.")
    const action = await dispatch(addReview({ data: { rating, review: reviewText.trim() }, token }))
    if (addReview.fulfilled.match(action)) {
      setReviewText(""); setRating(0); setHoverRating(0); setSuccess("Your review has been submitted successfully!")
    } else setError(action.error.message || "Could not submit review.")
  }

  return <div className="min-h-screen bg-[#080709] px-4 py-10 sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl min-w-0">
    <div className="mb-10 text-center sm:mb-12"><h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">Customer Reviews</h1><p className="mt-3 text-zinc-400">See what our customers say about Fusion Aura.</p></div>
    <div className="simple-card mx-auto mb-10 max-w-2xl rounded-2xl border border-white/10 bg-[#101014] p-5 sm:mb-12 sm:p-8">
      <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>
      {!user && <div className="bg-[#080709] p-4 rounded-lg mb-5">Please <Link to="/login" className="text-[#f06b91] font-medium">login</Link> to submit a review.</div>}
      {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-5">{success}</div>}
      <form onSubmit={handleSubmit}>
        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-medium">How would you rate your visit?</legend>
          <div role="group" aria-label="Choose a rating from one to five stars" className="inline-flex max-w-full items-center gap-0 rounded-2xl border border-white/10 bg-white/[0.035] p-0.5 sm:gap-1 sm:p-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const displayedRating = hoverRating || rating
              const active = star <= displayedRating
              const selected = star === rating
              return <button
                type="button"
                key={star}
                aria-label={`${star} ${star === 1 ? "star" : "stars"}${selected ? ", selected" : ""}`}
                aria-pressed={selected}
                title={`${star} ${star === 1 ? "star" : "stars"}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`group grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-[2.5rem] leading-none transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#edca83] active:scale-90 sm:h-16 sm:w-16 sm:text-5xl ${selected ? "border-[#edca83]/50 bg-[#edca83]/15 shadow-[0_0_20px_rgba(237,202,131,0.16)]" : "border-transparent hover:border-white/15 hover:bg-white/[0.06]"} ${active ? "text-[#edca83]" : "text-zinc-600"} ${hoverRating === star ? "-translate-y-1 scale-110" : selected && !hoverRating ? "scale-105" : "scale-100"}`}
              >
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:rotate-[-8deg]">{active ? "★" : "☆"}</span>
              </button>
            })}
          </div>
          <p aria-live="polite" className="mt-2 min-h-5 text-sm text-zinc-400">{(hoverRating || rating) ? <>{hoverRating || rating} out of 5 · {["", "Needs improvement", "Fair", "Good", "Very good", "Excellent"][hoverRating || rating]}</> : "Tap a star to leave your rating"}</p>
        </fieldset>
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <textarea value={reviewText} onChange={(e)=>setReviewText(e.target.value)} rows="4" placeholder="Write about your experience..." className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3 mb-5" />
        <button className="w-full rounded-lg bg-[#e85b83] py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d9476d] hover:shadow-lg hover:shadow-[#e85b83]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">Submit Review</button>
      </form>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">{reviews.map((review)=><ReviewCard key={review._id} name={review.name} review={review.review} rating={review.rating} floating={false} />)}</div>
  </div></div>
}
export default Reviews
