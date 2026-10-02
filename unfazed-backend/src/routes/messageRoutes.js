const express = require("express");
const Message = require("../models/Message");
const Client = require("../models/Client");

const router = express.Router();

// @desc    Get all active conversations with real clients
// @route   GET /api/messages/conversations
router.get("/conversations", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    const conversations = await Promise.all(
      clients.map(async (c) => {
        const lastMsg = await Message.findOne({ client: c._id }).sort({
          createdAt: -1,
        });

        const unreadCount = await Message.countDocuments({
          client: c._id,
          sender: "client",
          isRead: false,
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
          unread: unreadCount,
        };
      })
    );

    // Sort by most recent activity
    conversations.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

    res.status(200).json({
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
});

// @desc    Get message history with a specific client
// @route   GET /api/messages/:clientId
router.get("/:clientId", async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId).select("-password");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const messages = await Message.find({ client: req.params.clientId }).sort({
      createdAt: 1,
    });

    // Mark unread incoming messages as read
    await Message.updateMany(
      { client: req.params.clientId, sender: "client", isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        isActive: client.isActive,
      },
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch message history",
      error: error.message,
    });
  }
});

// @desc    Send a message
// @route   POST /api/messages
router.post("/", async (req, res) => {
  try {
    const { clientId, text, sender = "therapist", therapistId } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text cannot be empty" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const message = await Message.create({
      client: client._id,
      clientName: client.name,
      therapist: therapistId || null,
      sender: sender === "client" ? "client" : "therapist",
      text: text.trim(),
      isRead: sender === "therapist", // Therapist messages are marked read by default for therapist
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
});

module.exports = router;
