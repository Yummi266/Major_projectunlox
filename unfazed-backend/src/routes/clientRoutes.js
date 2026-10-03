const express = require("express");
const bcrypt = require("bcryptjs");
const Client = require("../models/Client");
const Package = require("../models/Package");
const Therapist = require("../models/Therapist");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Get clients belonging strictly to the authenticated therapist
// @route   GET /api/clients
router.get("/", protect, authorize("therapist"), async (req, res) => {
  try {
    const clients = await Client.find({ therapist: req.user._id })
      .select("-password")
      .populate("therapist", "name email specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message
    });
  }
});

// @desc    Get single client by ID (strictly isolated to owning therapist or the client themselves)
// @route   GET /api/clients/:id
router.get("/:id", protect, async (req, res) => {
  try {
    let client = null;

    if (req.role === "therapist") {
      client = await Client.findOne({
        _id: req.params.id,
        therapist: req.user._id
      })
        .select("-password")
        .populate("therapist", "name email specialization");
    } else if (req.role === "client") {
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Forbidden: You cannot access other client profiles" });
      }
      client = await Client.findById(req.user._id)
        .select("-password")
        .populate("therapist", "name email specialization");
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found or unauthorized" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client",
      error: error.message
    });
  }
});

// @desc    Add new client (automatically assigns strictly to authenticated therapist)
// @route   POST /api/clients
router.post("/", protect, authorize("therapist"), async (req, res) => {
  try {
    const { name, email, phone, password, package: clientPackage } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Client.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "A client with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    const chosenPackage = clientPackage || "Standard Package";
    const foundPkg = await Package.findOne({ name: chosenPackage });
    const totalSessions = foundPkg
      ? foundPkg.sessions
      : chosenPackage.includes("10")
      ? 10
      : chosenPackage.includes("3")
      ? 3
      : chosenPackage.includes("Single")
      ? 1
      : 6;

    const client = await Client.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      package: chosenPackage,
      totalSessions,
      sessionsUsed: 0,
      therapist: req.user._id
    });

    res.status(201).json({
      message: "Client added successfully",
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        package: client.package,
        totalSessions: client.totalSessions,
        sessionsUsed: client.sessionsUsed,
        therapist: client.therapist,
        createdAt: client.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add client",
      error: error.message
    });
  }
});

// @desc    Delete client strictly belonging to authenticated therapist
// @route   DELETE /api/clients/:id
router.delete("/:id", protect, authorize("therapist"), async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      therapist: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found or unauthorized" });
    }

    res.status(200).json({ message: "Client deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message
    });
  }
});

// @desc    Update client package (renew or upgrade) strictly for authenticated client
// @route   POST /api/clients/me/package
router.post("/me/package", protect, authorize("client"), async (req, res) => {
  try {
    const { packageName, sessions } = req.body;
    const client = await Client.findById(req.user._id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.package = packageName || client.package;
    if (sessions) {
      client.totalSessions = Number(sessions);
    }
    client.sessionsUsed = 0;
    await client.save();

    res.status(200).json({
      message: "Care package updated successfully",
      client: {
        id: client._id,
        name: client.name,
        package: client.package,
        totalSessions: client.totalSessions,
        sessionsUsed: client.sessionsUsed
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update package",
      error: error.message
    });
  }
});

// @desc    Assign or change client's therapist strictly for authenticated client
// @route   PUT /api/clients/me/therapist
router.put("/me/therapist", protect, authorize("client"), async (req, res) => {
  try {
    const { therapistId } = req.body;

    if (!therapistId) {
      return res.status(400).json({ message: "Therapist ID is required" });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    const client = await Client.findByIdAndUpdate(
      req.user._id,
      { therapist: therapist._id },
      { new: true }
    )
      .select("-password")
      .populate("therapist", "name email specialization");

    res.status(200).json({
      message: `Assigned to ${therapist.name} successfully`,
      client
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update therapist",
      error: error.message
    });
  }
});

module.exports = router;
