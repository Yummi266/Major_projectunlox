const express = require("express");
const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const Therapist = require("../models/Therapist");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Get all appointments for the authenticated therapist
// @route   GET /api/appointments
router.get("/", protect, authorize("therapist"), async (req, res) => {
  try {
    const { type, status } = req.query;
    const therapistId = req.user._id;
    let query = { therapist: therapistId };

    if (type && type !== "all") {
      query.type = new RegExp(`^${type}$`, "i");
    }

    if (status && status !== "all") {
      if (status === "completed") {
        query.isCompleted = true;
      } else if (status === "upcoming") {
        query.isCompleted = false;
      }
    }

    const appointments = await Appointment.find(query)
      .populate("client", "name email phone package")
      .populate("therapist", "name email specialization")
      .sort({ date: 1, startTime: 1, createdAt: -1 });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
});

// @desc    Get today's appointments for authenticated therapist dashboard
// @route   GET /api/appointments/today
router.get("/today", protect, authorize("therapist"), async (req, res) => {
  try {
    const therapistId = req.user._id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      therapist: therapistId,
      date: { $gte: startOfDay, $lte: endOfDay }
    };

    let appointments = await Appointment.find(query)
      .populate("client", "name email phone package")
      .sort({ startTime: 1 });

    if (appointments.length === 0) {
      appointments = await Appointment.find({ therapist: therapistId })
        .populate("client", "name email phone package")
        .sort({ date: 1, startTime: 1 })
        .limit(6);
    }

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch today's appointments",
      error: error.message
    });
  }
});

// @desc    Create new appointment (strictly isolated to authenticated therapist)
// @route   POST /api/appointments
router.post("/", protect, authorize("therapist"), async (req, res) => {
  try {
    const {
      clientId,
      clientName: rawClientName,
      type,
      topic,
      date,
      startTime,
      endTime,
      isCompleted,
      status,
      notes
    } = req.body;

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

    const appointment = await Appointment.create({
      client: finalClientId,
      clientName: finalClientName,
      therapist: therapistId,
      type: type || "Video",
      topic: topic ? topic.trim() : "Clinical Consultation",
      date: date ? new Date(date) : new Date(),
      startTime: startTime || "10:00 AM",
      endTime: endTime || "10:50 AM",
      isCompleted: isCompleted || false,
      status: status || (isCompleted ? "Completed" : "Upcoming"),
      notes: notes ? notes.trim() : ""
    });

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to schedule appointment",
      error: error.message
    });
  }
});

// @desc    Update appointment strictly for owning therapist
// @route   PUT /api/appointments/:id
router.put("/:id", protect, authorize("therapist"), async (req, res) => {
  try {
    const { type, topic, date, startTime, endTime, isCompleted, status, notes } = req.body;
    const therapistId = req.user._id;

    const updates = {};
    if (type !== undefined) updates.type = type;
    if (topic !== undefined) updates.topic = topic.trim();
    if (date !== undefined) updates.date = new Date(date);
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (isCompleted !== undefined) {
      updates.isCompleted = isCompleted;
      if (isCompleted && !status) {
        updates.status = "Completed";
      }
    }
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes.trim();

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, therapist: therapistId },
      updates,
      { new: true, runValidators: true }
    ).populate("client", "name email phone package");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment",
      error: error.message
    });
  }
});

// @desc    Delete appointment strictly for owning therapist
// @route   DELETE /api/appointments/:id
router.delete("/:id", protect, authorize("therapist"), async (req, res) => {
  try {
    const therapistId = req.user._id;
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      therapist: therapistId
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete appointment",
      error: error.message
    });
  }
});

// @desc    Get client sessions (Upcoming and Completed) strictly for authenticated client
// @route   GET /api/appointments/client-sessions
router.get("/client-sessions", protect, authorize("client"), async (req, res) => {
  try {
    const client = req.user;

    let therapist = client.therapist;
    if (!therapist || !therapist.name) {
      const tId = client.therapist?._id || client.therapist;
      if (tId) {
        therapist = await Therapist.findById(tId).select("-password");
      }
    }

    const therapistDisplayName = therapist
      ? therapist.name.startsWith("Dr.")
        ? therapist.name
        : `Dr. ${therapist.name}`
      : "Your Therapist";

    const allAppts = await Appointment.find({ client: client._id }).sort({ date: 1, startTime: 1 });

    const upcoming = allAppts
      .filter((a) => !a.isCompleted && a.status !== "Completed" && a.status !== "Cancelled")
      .map((a) => ({
        id: a._id,
        dateFormatted: new Date(a.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        time: `${a.startTime} – ${a.endTime}`,
        therapistName: therapistDisplayName,
        topic: a.topic || "Clinical Consultation",
        type: a.type || "Video",
        status: "Upcoming",
        canJoin: true
      }));

    const completed = allAppts
      .filter((a) => a.isCompleted || a.status === "Completed")
      .reverse()
      .map((a) => ({
        id: a._id,
        dateFormatted: new Date(a.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        time: `${a.startTime} – ${a.endTime}`,
        therapistName: therapistDisplayName,
        topic: a.topic || "Clinical Consultation",
        type: a.type || "Video",
        status: "Completed",
        canJoin: false
      }));

    res.status(200).json({
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        package: client.package || "Standard Package",
        sessionsUsed: client.sessionsUsed,
        totalSessions: client.totalSessions
      },
      therapist: {
        id: therapist?._id || null,
        name: therapistDisplayName,
        specialization: therapist?.specialization || "Relationship Counseling & CBT"
      },
      upcoming,
      completed,
      totalCount: allAppts.length
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client sessions",
      error: error.message
    });
  }
});

// @desc    Client self-booking appointment with chosen/assigned therapist
// @route   POST /api/appointments/client-book
router.post("/client-book", protect, authorize("client"), async (req, res) => {
  try {
    const client = req.user;
    const { date, startTime, endTime, type, topic, therapistId } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({ message: "Date and start time are required" });
    }

    let finalTherapistId = therapistId || (client.therapist?._id || client.therapist);

    if (!finalTherapistId) {
      return res.status(400).json({
        message: "Please choose a therapist to book your session."
      });
    }

    const chosenTherapist = await Therapist.findById(finalTherapistId);
    if (!chosenTherapist) {
      return res.status(404).json({
        message: "Selected therapist not found. Please choose an active therapist."
      });
    }

    // Automatically bind/update client's chosen therapist
    if (!client.therapist || client.therapist.toString() !== chosenTherapist._id.toString()) {
      client.therapist = chosenTherapist._id;
      await client.save();
    }

    const newAppointment = await Appointment.create({
      client: client._id,
      clientName: client.name,
      therapist: chosenTherapist._id,
      type: type || "Video",
      topic: topic ? topic.trim() : "Personal Counseling & Check-in",
      date: new Date(date),
      startTime: startTime || "10:00 AM",
      endTime: endTime || "10:50 AM",
      isCompleted: false,
      status: "Upcoming"
    });

    res.status(201).json({
      message: "Session booked successfully",
      appointment: newAppointment,
      therapist: {
        id: chosenTherapist._id,
        name: chosenTherapist.name,
        specialization: chosenTherapist.specialization
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book session",
      error: error.message
    });
  }
});

module.exports = router;
