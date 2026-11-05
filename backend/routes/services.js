const express = require("express")
const fs = require("fs")
const path = require("path")
const Service = require("../models/Service")
const { requireAdmin } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

function parsePrice(value) {
  const match = String(value || "").match(/\d[\d,]*/)
  return match ? Number(match[0].replace(/,/g, "")) : NaN
}

function parseIncludes(value) {
  const lines = Array.isArray(value) ? value : String(value || "").split(/\r?\n/)
  return [...new Set(lines.map((item) => String(item).trim()).filter(Boolean))].slice(0, 20)
}

router.get("/", async (_req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 })
    res.json(services)
  } catch {
    res.status(500).json({ message: "Could not load services." })
  }
})

router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { menuId, menuTitle, groupTitle, name, priceLabel, price, time, description, includes, optionalAddons } = req.body
    const numericPrice = parsePrice(priceLabel || price)
    if (!menuId || !menuTitle || !groupTitle || !name || !priceLabel || !Number.isFinite(numericPrice)) {
      return res.status(400).json({ message: "Menu, category, service name and a valid price are required." })
    }

    const image = req.file ? `/uploads/${req.file.filename}` : ""
    const service = await Service.create({
      menuId: menuId.trim(),
      menuTitle: menuTitle.trim(),
      groupTitle: groupTitle.trim(),
      name: name.trim(),
      price: numericPrice,
      priceLabel: priceLabel.trim(),
      time: time?.trim() || "As arranged",
      description: description?.trim() || "Professional beauty and salon service.",
      includes: parseIncludes(includes),
      optionalAddons: parseIncludes(optionalAddons),
      image
    })
    res.status(201).json(service)
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((field) => field.message).join(" ") })
    }
    console.error("Could not add service:", error.message)
    res.status(500).json({ message: "Could not add service." })
  }
})

router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ message: "Service not found." })

    const oldImage = service.image
    service.menuId = req.body.menuId?.trim() || service.menuId
    service.menuTitle = req.body.menuTitle?.trim() || service.menuTitle
    service.groupTitle = req.body.groupTitle?.trim() || service.groupTitle
    service.name = req.body.name?.trim() || service.name
    if (req.body.priceLabel !== undefined) {
      const numericPrice = parsePrice(req.body.priceLabel)
      if (!req.body.priceLabel.trim() || !Number.isFinite(numericPrice)) {
        return res.status(400).json({ message: "Enter a valid price." })
      }
      service.priceLabel = req.body.priceLabel.trim()
      service.price = numericPrice
    }
    service.time = req.body.time?.trim() || service.time || "As arranged"
    service.description = req.body.description?.trim() || service.description
    if (req.body.includes !== undefined) service.includes = parseIncludes(req.body.includes)
    if (req.body.optionalAddons !== undefined) service.optionalAddons = parseIncludes(req.body.optionalAddons)

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`
      if (oldImage?.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", oldImage)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
    }

    await service.save()
    res.json(service)
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((field) => field.message).join(" ") })
    }
    console.error("Could not update service:", error.message)
    res.status(500).json({ message: "Could not update service." })
  }
})

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ message: "Service not found." })

    if (service.image?.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", service.image)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    res.json({ message: "Service deleted." })
  } catch {
    res.status(500).json({ message: "Could not delete service." })
  }
})

module.exports = router
