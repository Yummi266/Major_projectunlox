const express = require("express");
const Note = require("../models/Note");
const Client = require("../models/Client");

const router = express.Router();

// @desc    Get all clinical notes
// @route   GET /api/notes
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { clientName: searchRegex },
        { sessionNumber: searchRegex },
        { content: searchRegex },
        { preview: searchRegex }
      ];
    }

    const notes = await Note.find(query)
      .populate("client", "name email phone")
      .populate("therapist", "name email specialization")
      .sort({ sessionDate: -1, createdAt: -1 });

    res.status(200).json({
      count: notes.length,
      notes
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message
    });
  }
});

// @desc    Get single note by ID
// @route   GET /api/notes/:id
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("therapist", "name email specialization");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note",
      error: error.message
    });
  }
});

// @desc    Create new clinical note
// @route   POST /api/notes
router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      clientName: rawClientName,
      sessionNumber,
      sessionDate,
      content,
      status,
      tags,
      therapistId
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Note content is required" });
    }

    let finalClientName = rawClientName ? rawClientName.trim() : "";
    let finalClientId = null;

    if (clientId) {
      const foundClient = await Client.findById(clientId);
      if (foundClient) {
        finalClientId = foundClient._id;
        if (!finalClientName) {
          finalClientName = foundClient.name;
        }
      }
    }

    if (!finalClientName) {
      return res.status(400).json({ message: "Client name or client ID is required" });
    }

    const preview =
      content.length > 95
        ? content.substring(0, 95).trim() + "..."
        : content.trim();

    const note = await Note.create({
      client: finalClientId,
      clientName: finalClientName,
      therapist: therapistId || null,
      sessionNumber: sessionNumber ? sessionNumber.trim() : "Session 1",
      sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
      content: content.trim(),
      preview,
      status: status === "Draft" ? "Draft" : "Completed",
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message
    });
  }
});

// @desc    Update clinical note
// @route   PUT /api/notes/:id
router.put("/:id", async (req, res) => {
  try {
    const { sessionNumber, sessionDate, content, status, tags } = req.body;

    const updates = {};
    if (sessionNumber !== undefined) updates.sessionNumber = sessionNumber;
    if (sessionDate !== undefined) updates.sessionDate = new Date(sessionDate);
    if (content !== undefined) {
      updates.content = content.trim();
      updates.preview =
        content.length > 95
          ? content.substring(0, 95).trim() + "..."
          : content.trim();
    }
    if (status !== undefined) updates.status = status;
    if (tags !== undefined) updates.tags = tags;

    const note = await Note.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate("client", "name email phone");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note",
      error: error.message
    });
  }
});

// @desc    Delete clinical note
// @route   DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note deleted successfully",
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message
    });
  }
});

module.exports = router;
