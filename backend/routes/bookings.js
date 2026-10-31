const express = require("express")
const mongoose = require("mongoose")
const Booking = require("../models/Booking")
const Service = require("../models/Service")
const { requireCustomer, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.get("/mine", requireCustomer, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(bookings)
  } catch {
    res.status(500).json({ message: "Could not load your bookings." })
  }
})

router.post("/", requireCustomer, async (req, res) => {
  try {
    const { name, phone, service, serviceId, menuId, groupTitle, serviceName, date, time } = req.body
    const cleanName = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : ""
    const cleanPhone = typeof phone === "string" ? phone.trim() : ""
    if (cleanName.length > 30 || !/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(cleanName)) {
      return res.status(400).json({ message: "Use letters and spaces only for your name (maximum 30 characters)." })
    }
    if (!/^\d{10}$/.test(cleanPhone)) return res.status(400).json({ message: "Enter a valid 10-digit phone number." })
    if (!date || !time) return res.status(400).json({ message: "Choose an appointment date and time." })

    const dateParts = typeof date === "string" ? date.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null
    const parsedDate = dateParts ? new Date(Date.UTC(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3]))) : null
    if (!parsedDate || parsedDate.getUTCFullYear() !== Number(dateParts[1]) || parsedDate.getUTCMonth() !== Number(dateParts[2]) - 1 || parsedDate.getUTCDate() !== Number(dateParts[3])) {
      return res.status(400).json({ message: "Choose a valid appointment date." })
    }
    const today = new Date()
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    if (date < todayKey) return res.status(400).json({ message: "Choose today or a future date." })

    const allowedTimes = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]
    if (!allowedTimes.includes(time)) return res.status(400).json({ message: "Choose a valid appointment time from the list." })

    let serviceDoc = null
    if (serviceId) {
      if (!mongoose.isValidObjectId(serviceId)) return res.status(400).json({ message: "Choose a valid service from the list." })
      serviceDoc = await Service.findById(serviceId)
    } else if (menuId && groupTitle && serviceName) {
      serviceDoc = await Service.findOne({ menuId, groupTitle, name: serviceName })
    } else if (service) {
      serviceDoc = await Service.findOne({ name: service })
    }
    if (!serviceDoc) return res.status(400).json({ message: "That service is no longer available. Please select another service." })

    const clash = await Booking.findOne({
      date,
      time,
      status: { $ne: "Cancelled" }
    })
    if (clash) return res.status(409).json({ message: "That time slot is already booked. Please choose another time." })

    const booking = await Booking.create({
      user: req.user.id,
      name: cleanName,
      phone: cleanPhone,
      email: req.user.email,
      serviceId: serviceDoc._id,
      service: [serviceDoc.menuTitle, serviceDoc.groupTitle, serviceDoc.name].filter(Boolean).join(" · "),
      date,
      time,
      status: "Pending"
    })

    res.status(201).json(booking)
  } catch {
    res.status(500).json({ message: "Could not create booking." })
  }
})

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json(bookings)
  } catch {
    res.status(500).json({ message: "Could not load bookings." })
  }
})

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const allowed = ["Pending", "Confirmed", "Cancelled"]
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid booking status." })

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: "Booking not found." })
    res.json(booking)
  } catch {
    res.status(500).json({ message: "Could not update booking." })
  }
})

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: "Booking not found." })
    res.json({ message: "Booking deleted." })
  } catch {
    res.status(500).json({ message: "Could not delete booking." })
  }
})

module.exports = router
