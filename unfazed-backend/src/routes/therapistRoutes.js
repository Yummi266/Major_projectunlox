const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");

const router = express.Router();

// Helper to get current therapist from token or fallback to default
async function resolveTherapist(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "unfazed_default_secret_key");
      const found = await Therapist.findById(decoded.id).select("-password");
      if (found) return found;
    } catch {
      // invalid or expired token, fall through to default
    }
  }
  // Fallback to the first therapist in the database
  let therapist = await Therapist.findOne().select("-password");
  if (!therapist) {
    // Create default therapist if none exists
    const hashedPassword = await bcrypt.hash("Therapist@123", 10);
    therapist = await Therapist.create({
      name: "Dr. Sarah Sharma",
      email: "sarah@example.com",
      password: hashedPassword,
      phone: "+91 98765 43210",
      specialization: "Clinical Psychology",
      qualification: "M.Phil Clinical Psychology",
      experience: 5,
      bio: "Licensed clinical psychologist specializing in cognitive behavioral therapy, anxiety disorders, and interpersonal relational healing.",
      practiceName: "Unfazed Wellness & Therapy",
      defaultSessionDuration: "50 min"
    });
  }
  return therapist;
}

// @desc    Get current therapist profile (used by Settings)
// @route   GET /api/therapists/profile/current
router.get("/profile/current", async (req, res) => {
  try {
    const therapist = await resolveTherapist(req);
    res.status(200).json({
      therapist
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch therapist profile",
      error: error.message
    });
  }
});

// @desc    Update current therapist profile (used by Settings)
// @route   PUT /api/therapists/profile/current
router.put("/profile/current", async (req, res) => {
  try {
    const therapist = await resolveTherapist(req);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      practiceName,
      defaultSessionDuration,
      emailNotifications,
      sessionReminders
    } = req.body;

    // Check email collision if changing email
    if (email && email.toLowerCase().trim() !== therapist.email.toLowerCase()) {
      const existing = await Therapist.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(409).json({ message: "Email is already taken by another account" });
      }
      therapist.email = email.toLowerCase().trim();
    }

    if (name) therapist.name = name.trim();
    if (phone !== undefined) therapist.phone = phone.trim();
    if (specialization) therapist.specialization = specialization.trim();
    if (qualification !== undefined) therapist.qualification = qualification.trim();
    if (experience !== undefined) therapist.experience = Number(experience);
    if (bio !== undefined) therapist.bio = bio.trim();
    if (practiceName !== undefined) therapist.practiceName = practiceName.trim();
    if (defaultSessionDuration !== undefined) therapist.defaultSessionDuration = defaultSessionDuration.trim();
    if (emailNotifications !== undefined) therapist.emailNotifications = Boolean(emailNotifications);
    if (sessionReminders !== undefined) therapist.sessionReminders = Boolean(sessionReminders);

    await therapist.save();

    res.status(200).json({
      message: "Profile updated successfully",
      therapist: {
        id: therapist._id,
        _id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        phone: therapist.phone,
        specialization: therapist.specialization,
        qualification: therapist.qualification,
        experience: therapist.experience,
        bio: therapist.bio,
        practiceName: therapist.practiceName,
        defaultSessionDuration: therapist.defaultSessionDuration,
        emailNotifications: therapist.emailNotifications,
        sessionReminders: therapist.sessionReminders,
        role: "therapist"
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
});

// @desc    Change password
// @route   PUT /api/therapists/security/change-password
router.put("/security/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const therapistDoc = await resolveTherapist(req);
    const fullTherapist = await Therapist.findById(therapistDoc._id);

    const isMatch = await bcrypt.compare(currentPassword, fullTherapist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    fullTherapist.password = await bcrypt.hash(newPassword, 10);
    await fullTherapist.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update password",
      error: error.message
    });
  }
});

// @desc    Get all therapists
// @route   GET /api/therapists
router.get("/", async (req, res) => {
  try {
    const therapists = await Therapist.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      count: therapists.length,
      therapists
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch therapists",
      error: error.message
    });
  }
});

// @desc    Get therapist by ID
// @route   GET /api/therapists/:id
router.get("/:id", async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id).select("-password");
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.status(200).json(therapist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch therapist",
      error: error.message
    });
  }
});

module.exports = router;
