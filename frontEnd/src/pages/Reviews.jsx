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
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("")
    if (!user) return setError("Please login before submitting a review.")
    if (reviewText.trim().length < 10) return setError("Review must be at least 10 characters.")
    const action = await dispatch(addReview({ data: { rating, review: reviewText.trim() }, token }))
    if (addReview.fulfilled.match(action)) {
      setReviewText(""); setRating(5); setSuccess("Your review has been submitted successfully!")
    } else setError(action.error.message || "Could not submit review.")
  }

  return <div className="min-h-screen bg-[#080709] py-12 px-6"><div className="max-w-6xl mx-auto">
    <div className="text-center mb-12"><h1 className="text-4xl font-bold text-zinc-100">Customer Reviews</h1><p className="text-zinc-400 mt-3">See what our customers say about Fusion Aura.</p></div>
    <div className="bg-[#101014] rounded-2xl p-8 max-w-2xl mx-auto mb-12">
      <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>
      {!user && <div className="bg-[#080709] p-4 rounded-lg mb-5">Please <Link to="/login" className="text-[#f06b91] font-medium">login</Link> to submit a review.</div>}
      {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-5">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2 mb-5">{[1,2,3,4,5].map(star=><button type="button" key={star} onClick={()=>setRating(star)} className="text-5xl text-[#f06b91]">{star<=rating?"★":"☆"}</button>)}</div>
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <textarea value={reviewText} onChange={(e)=>setReviewText(e.target.value)} rows="4" placeholder="Write about your experience..." className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3 mb-5" />
        <button className="w-full bg-[#e85b83] text-white py-3 rounded-lg">Submit Review</button>
      </form>
    </div>
    <div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-6">{reviews.map(r=><ReviewCard key={r._id} name={r.name} review={r.review} rating={r.rating} />)}</div>
  </div></div>
}
export default Reviews
