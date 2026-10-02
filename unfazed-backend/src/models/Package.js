const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    sessions: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    duration: {
      type: String,
      default: "50 min",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "₹",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },
    icon: {
      type: String,
      default: "◇",
    },
    features: {
      type: [String],
      default: [],
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);
