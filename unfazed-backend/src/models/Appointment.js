const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      default: null,
    },
    type: {
      type: String,
      enum: ["Video", "Chat", "In-Person"],
      default: "Video",
    },
    topic: {
      type: String,
      default: "Clinical Consultation",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: String,
      default: "10:00 AM",
      trim: true,
    },
    endTime: {
      type: String,
      default: "10:50 AM",
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Upcoming", "In-Progress", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
