const mongoose = require("mongoose");

const clientPackageSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      default: null,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    pricePaid: {
      type: Number,
      required: true,
    },
    totalSessions: {
      type: Number,
      required: true,
      default: 6,
    },
    sessionsUsed: {
      type: Number,
      default: 0,
    },
    sessionsRemaining: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Expired"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClientPackage", clientPackageSchema);
