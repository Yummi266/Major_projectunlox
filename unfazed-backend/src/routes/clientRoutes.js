const express = require("express");
const Client = require("../models/Client");

const router = express.Router();

// @desc    Get all clients
// @route   GET /api/clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find()
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

// @desc    Get client by ID
// @route   GET /api/clients/:id
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .select("-password")
      .populate("therapist", "name email specialization");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client",
      error: error.message
    });
  }
});

// @desc    Add new client
// @route   POST /api/clients
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, therapist, package: clientPackage } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Client.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "A client with this email already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password || "Client@123", 10);

    const Package = require("../models/Package");
    const chosenPackage = clientPackage || "Standard Package";
    const foundPkg = await Package.findOne({ name: chosenPackage });
    const totalSessions = foundPkg ? foundPkg.sessions : (chosenPackage.includes("10") ? 10 : chosenPackage.includes("3") ? 3 : chosenPackage.includes("Single") ? 1 : 6);

    const client = await Client.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      package: chosenPackage,
      totalSessions,
      sessionsUsed: 0,
      therapist: therapist || null
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

// @desc    Delete client by ID
// @route   DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message
    });
  }
});

module.exports = router;
