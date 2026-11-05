const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
const bcrypt = require("bcryptjs")
const fs = require("fs")

const { PORT, MONGO_URI, FRONTEND_URL } = require("./config")
const Admin = require("./models/Admin")
const Service = require("./models/Service")
const serviceMenuCatalog = require("../frontEnd/src/data/serviceMenus.json")

const authRoutes = require("./routes/auth")
const serviceRoutes = require("./routes/services")
const bookingRoutes = require("./routes/bookings")
const reviewRoutes = require("./routes/reviews")

const app = express()
const uploadsPath = path.join(__dirname, "uploads")
fs.mkdirSync(uploadsPath, { recursive: true })

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(uploadsPath))

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Fusion Aura API is running." })
})

app.use("/api/auth", authRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)

app.use((error, _req, res, _next) => {
  if (error?.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Image must be 5 MB or smaller." })
  if (error?.message === "Only image files are allowed.") return res.status(400).json({ message: error.message })
  res.status(500).json({ message: "Something went wrong." })
})

async function seedData() {
  const adminEmail = "admin@fusionaura.com"
  const adminPassword = "Admin@123" 

  const adminExists = await Admin.findOne({ email: adminEmail })
  if (!adminExists) {
    const password = await bcrypt.hash(adminPassword, 10)
    await Admin.create({ name: "Fusion Aura Admin", email: adminEmail, password })
    console.log(`Default admin created for ${adminEmail}.`)
  }

  const settings = mongoose.connection.collection("appsettings")
  const menuSync = await settings.findOne({ _id: "serviceMenuVersion" })
  if (!menuSync || menuSync.version < 2) {
    // Replace legacy service documents once while preserving bookings, which store names as text.
    await Service.deleteMany({})
    const seededServices = serviceMenuCatalog.menus.flatMap((menu) =>
      menu.groups.flatMap((group) => group.items.map((item) => {
        const numericPrice = Number(item.price.match(/\d[\d,]*/)?.[0]?.replace(/,/g, "") || 0)
        return {
          menuId: menu.id,
          menuTitle: menu.title,
          groupTitle: group.title,
          name: item.name,
          price: numericPrice,
          priceLabel: item.price,
          time: item.detail || "As arranged",
          description: menu.description,
          includes: item.includes || [],
          optionalAddons: item.optionalAddons || [],
          image: ""
        }
      }))
    )
    await Service.insertMany(seededServices)
    await settings.updateOne(
      { _id: "serviceMenuVersion" },
      { $set: { version: 2, updatedAt: new Date() } },
      { upsert: true }
    )
    console.log(`Legacy services replaced with ${seededServices.length} editable menu services.`)
  }

  const Review = require("./models/Review")
  const reviewCount = await Review.countDocuments()
  if (reviewCount === 0) {
    await Review.insertMany([
      
    ])
    console.log("Default reviews inserted.")
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected.")
    await seedData()
    app.listen(PORT, "0.0.0.0", () => console.log(`Fusion Aura backend running at http://localhost:${PORT}`))
  })
  .catch((error) => {
    console.error("MongoDB connection failed.")
    console.error(error.message)
    process.exit(1)
  })
