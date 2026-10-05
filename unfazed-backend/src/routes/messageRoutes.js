const express = require("express");
const Message = require("../models/Message");
const Client = require("../models/Client");
const Therapist = require("../models/Therapist");
const { createNotification } = require("../services/notificationService");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

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

router.get("/:clientId", protect, async (req, res) => {
  try {
    let client = null;

    if (req.role === "therapist") {
      client = await Client.findOne({
        _id: req.params.clientId,
        therapist: req.user._id
      }).select("-password");

      if (!client) {
        return res.status(404).json({ message: "Client not found or unauthorized" });
      }

      await Message.updateMany(
        { client: client._id, sender: "client", isRead: false },
        { isRead: true }
      );
    } else if (req.role === "client") {
      if (req.user._id.toString() !== req.params.clientId) {
        return res.status(403).json({ message: "Forbidden: You cannot access other client messages" });
      }
      client = req.user;

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

    if (senderRole === "client") {
      createNotification({
        recipient: therapistId,
        recipientRole: "therapist",
        type: "message",
        title: `Message from ${clientDoc.name}`,
        message: text.trim().length > 90 ? text.trim().substring(0, 90) + "..." : text.trim(),
        relatedId: message._id,
      });
    } else {
      createNotification({
        recipient: clientDoc._id,
        recipientRole: "client",
        type: "message",
        title: `Message from ${req.user.name.startsWith("Dr.") ? req.user.name : `Dr. ${req.user.name}`}`,
        message: text.trim().length > 90 ? text.trim().substring(0, 90) + "..." : text.trim(),
        relatedId: message._id,
      });
    }

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
