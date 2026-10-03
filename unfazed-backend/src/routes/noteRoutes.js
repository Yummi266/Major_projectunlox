const express = require("express");
const Note = require("../models/Note");
const Client = require("../models/Client");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect & authorize("therapist") to all clinical note routes
router.use(protect, authorize("therapist"));

// @desc    Get all clinical notes strictly for the authenticated therapist
// @route   GET /api/notes
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const therapistId = req.user._id;
    let query = { therapist: therapistId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$and = [
        { therapist: therapistId },
        {
          $or: [
            { clientName: searchRegex },
            { sessionNumber: searchRegex },
            { content: searchRegex },
            { preview: searchRegex }
          ]
        }
      ];
      delete query.therapist;
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

// @desc    Get single note strictly belonging to authenticated therapist
// @route   GET /api/notes/:id
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      therapist: req.user._id
    })
      .populate("client", "name email phone")
      .populate("therapist", "name email specialization");

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note",
      error: error.message
    });
  }
});

// @desc    Create new clinical note strictly for authenticated therapist
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
      tags
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const therapistId = req.user._id;
    let finalClientName = rawClientName ? rawClientName.trim() : "";
    let finalClientId = null;

    if (clientId) {
      const foundClient = await Client.findOne({ _id: clientId, therapist: therapistId });
      if (foundClient) {
        finalClientId = foundClient._id;
        if (!finalClientName) {
          finalClientName = foundClient.name;
        }
      } else {
        return res.status(404).json({ message: "Client not found in your practice" });
      }
    }

    if (!finalClientName) {
      return res.status(400).json({ message: "Client name or client ID is required" });
    }

    const note = await Note.create({
      client: finalClientId,
      clientName: finalClientName,
      therapist: therapistId,
      sessionNumber: sessionNumber ? sessionNumber.trim() : "Session 1",
      sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
      content: content.trim(),
      status: status || "Completed",
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({
      message: "Clinical note saved successfully",
      note
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message
    });
  }
});

// @desc    Update clinical note strictly for owning therapist
// @route   PUT /api/notes/:id
router.put("/:id", async (req, res) => {
  try {
    const { content, status, sessionNumber, sessionDate, tags } = req.body;
    const therapistId = req.user._id;

    const updates = {};
    if (content !== undefined) updates.content = content.trim();
    if (status !== undefined) updates.status = status;
    if (sessionNumber !== undefined) updates.sessionNumber = sessionNumber.trim();
    if (sessionDate !== undefined) updates.sessionDate = new Date(sessionDate);
    if (tags !== undefined) updates.tags = tags;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, therapist: therapistId },
      updates,
      { new: true, runValidators: true }
    ).populate("client", "name email phone");

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
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

// @desc    Delete clinical note strictly for owning therapist
// @route   DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const therapistId = req.user._id;
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      therapist: therapistId
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
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
