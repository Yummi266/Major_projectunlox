const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    specialization: {
      type: String,
      trim: true,
      default: "Clinical Psychology",
    },
    qualification: {
      type: String,
      trim: true,
      default: "M.Phil Clinical Psychology",
    },
    experience: {
      type: Number,
      default: 5,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    practiceName: {
      type: String,
      default: "Unfazed Wellness & Therapy",
      trim: true,
    },
    defaultSessionDuration: {
      type: String,
      default: "50 min",
      trim: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    sessionReminders: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Therapist", therapistSchema);