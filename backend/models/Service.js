const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema(
  {
    menuId: { type: String, required: true, trim: true },
    menuTitle: { type: String, required: true, trim: true },
    groupTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceLabel: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    description: {
      type: String,
      default: "Professional beauty and salon service.",
      trim: true
    },
    includes: { type: [String], default: [] },
    optionalAddons: { type: [String], default: [] },
    image: { type: String, default: "" }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Service", serviceSchema)
