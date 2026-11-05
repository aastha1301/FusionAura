const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    service: { type: String, required: true, trim: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    packageIncludes: { type: [String], default: [] },
    addons: [{ serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, name: String, priceLabel: String, includes: [String] }],
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Booking", bookingSchema)
