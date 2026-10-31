const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Admin = require("../models/Admin")
const { JWT_SECRET } = require("../config")

const router = express.Router()

function customerResponse(user, token) {
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: "customer" }
  }
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || name.trim().length < 3) return res.status(400).json({ message: "Name must be at least 3 characters." })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return res.status(400).json({ message: "Enter a valid email." })
    if (!/^\d{10}$/.test(phone || "")) return res.status(400).json({ message: "Phone number must be 10 digits." })
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." })

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(409).json({ message: "An account with this email already exists." })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name: name.trim(), email: normalizedEmail, phone, password: hashedPassword })

    const token = jwt.sign({ id: user._id.toString(), role: "customer", name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" })
    res.status(201).json(customerResponse(user, token))
  } catch (error) {
    res.status(500).json({ message: "Could not create account." })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() })
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password." })
    }
    const token = jwt.sign({ id: user._id.toString(), role: "customer", name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" })
    res.json(customerResponse(user, token))
  } catch {
    res.status(500).json({ message: "Login failed." })
  }
})

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email: (email || "").toLowerCase().trim() })
    if (!admin || !(await bcrypt.compare(password || "", admin.password))) {
      return res.status(401).json({ message: "Invalid admin email or password." })
    }
    const token = jwt.sign({ id: admin._id.toString(), role: "admin", email: admin.email }, JWT_SECRET, { expiresIn: "7d" })
    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: "admin" }
    })
  } catch {
    res.status(500).json({ message: "Admin login failed." })
  }
})

module.exports = router
