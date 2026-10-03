const express = require("express");
const Message = require("../models/Message");
const Client = require("../models/Client");
const Therapist = require("../models/Therapist");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Get active conversations strictly for authenticated therapist
// @route   GET /api/messages/conversations
router.get("/conversations", protect, authorize("therapist"), async (req, res) => {
  try {
    const therapistId = req.user._id;
    const clients = await Client.find({ therapist: therapistId }).sort({ createdAt: -1 });

    const conversations = await Promise.all(
      clients.map(async (c) => {
        const lastMsg = await Message.findOne({ client: c._id }).sort({
          createdAt: -1
        });

        const unreadCount = await Message.countDocuments({
          client: c._id,
          sender: "client",
          isRead: false
        });

        const initials = c.name
          ? c.name
              .split(" ")
              .filter(Boolean)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "CL";

        return {
          clientId: c._id,
          name: c.name || "Client",
          email: c.email,
          phone: c.phone || "",
          initials,
          lastMessage: lastMsg ? lastMsg.text : "No messages yet — start a conversation.",
          lastTime: lastMsg ? lastMsg.createdAt : c.createdAt,
          unread: unreadCount
        };
      })
    );

    // Sort by most recent activity
    conversations.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

    res.status(200).json({
      count: conversations.length,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message
    });
  }
});

// @desc    Get message history strictly between authenticated user and counterparty
// @route   GET /api/messages/:clientId
router.get("/:clientId", protect, async (req, res) => {
  try {
    let client = null;

    if (req.role === "therapist") {
      // Must belong to this therapist
      client = await Client.findOne({
        _id: req.params.clientId,
        therapist: req.user._id
      }).select("-password");

      if (!client) {
        return res.status(404).json({ message: "Client not found or unauthorized" });
      }

      // Mark unread client messages as read
      await Message.updateMany(
        { client: client._id, sender: "client", isRead: false },
        { isRead: true }
      );
    } else if (req.role === "client") {
      // Client can only view their own messages
      if (req.user._id.toString() !== req.params.clientId) {
        return res.status(403).json({ message: "Forbidden: You cannot access other client messages" });
      }
      client = req.user;

      // Mark unread therapist messages as read
      await Message.updateMany(
        { client: client._id, sender: "therapist", isRead: false },
        { isRead: true }
      );
    }

    const messages = await Message.find({ client: client._id }).sort({
      createdAt: 1
    });

    res.status(200).json({
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        isActive: client.isActive
      },
      messages
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch message history",
      error: error.message
    });
  }
});

// @desc    Send a message (strictly binds sender and therapist identity)
// @route   POST /api/messages
router.post("/", protect, async (req, res) => {
  try {
    const { clientId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text cannot be empty" });
    }

    let clientDoc = null;
    let therapistId = null;
    let senderRole = null;

    if (req.role === "therapist") {
      if (!clientId) {
        return res.status(400).json({ message: "Client ID is required" });
      }
      clientDoc = await Client.findOne({ _id: clientId, therapist: req.user._id });
      if (!clientDoc) {
        return res.status(404).json({ message: "Client not found in your practice" });
      }
      therapistId = req.user._id;
      senderRole = "therapist";
    } else if (req.role === "client") {
      clientDoc = req.user;
      if (!clientDoc.therapist) {
        return res.status(400).json({
          message: "No therapist assigned to your account. Please select a therapist first."
        });
      }
      therapistId = clientDoc.therapist;
      senderRole = "client";
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    const message = await Message.create({
      client: clientDoc._id,
      clientName: clientDoc.name,
      therapist: therapistId,
      sender: senderRole,
      text: text.trim(),
      isRead: false
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message
    });
  }
});

module.exports = router;
