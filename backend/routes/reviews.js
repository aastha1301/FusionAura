const express = require("express")
const Review = require("../models/Review")
const { requireCustomer } = require("../middleware/auth")

const router = express.Router()

router.get("/", async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch {
    res.status(500).json({ message: "Could not load reviews." })
  }
})

router.post("/", requireCustomer, async (req, res) => {
  try {
    const { rating, review } = req.body
    if (!rating || Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ message: "Rating must be between 1 and 5." })
    if (!review || review.trim().length < 10) return res.status(400).json({ message: "Review must be at least 10 characters." })

    const created = await Review.create({
      user: req.user.id,
      name: req.user.name || "Customer",
      rating: Number(rating),
      review: review.trim()
    })
    res.status(201).json(created)
  } catch {
    res.status(500).json({ message: "Could not submit review." })
  }
})

module.exports = router
