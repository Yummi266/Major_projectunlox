const express = require("express");
const bcrypt = require("bcryptjs");
const Therapist = require("../models/Therapist");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile/current", protect, authorize("therapist"), async (req, res) => {
  try {
    res.status(200).json({
      therapist: req.user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch therapist profile",
      error: error.message
    });
  }
});

router.put("/profile/current", protect, authorize("therapist"), async (req, res) => {
  try {
    const therapist = req.user;

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

router.put("/security/change-password", protect, authorize("therapist"), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const fullTherapist = await Therapist.findById(req.user._id);

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
