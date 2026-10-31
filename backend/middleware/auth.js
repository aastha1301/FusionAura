const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")

function getToken(req) {
  const header = req.headers.authorization || ""
  if (!header.startsWith("Bearer ")) return null
  return header.slice(7)
}

function requireCustomer(req, res, next) {
  try {
    const token = getToken(req)
    if (!token) return res.status(401).json({ message: "Login required." })
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== "customer") {
      return res.status(403).json({ message: "Customer access required." })
    }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ message: "Session expired. Please login again." })
  }
}

function requireAdmin(req, res, next) {
  try {
    const token = getToken(req)
    if (!token) return res.status(401).json({ message: "Admin login required." })
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." })
    }
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ message: "Admin session expired. Please login again." })
  }
}

module.exports = { requireCustomer, requireAdmin }
