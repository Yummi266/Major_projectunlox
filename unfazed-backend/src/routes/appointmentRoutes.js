const express = require("express");
const Appointment = require("../models/Appointment");
const Client = require("../models/Client");

const router = express.Router();

// @desc    Get all appointments
// @route   GET /api/appointments
router.get("/", async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};

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

// @desc    Get today's appointments for dashboard
// @route   GET /api/appointments/today
router.get("/today", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch appointments for today, or fallback to the most recent/upcoming appointments
    let appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate("client", "name email phone package")
      .sort({ startTime: 1 });

    // If no appointments strictly match today's date, return all scheduled appointments
    if (appointments.length === 0) {
      appointments = await Appointment.find()
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

// @desc    Create new appointment
// @route   POST /api/appointments
router.post("/", async (req, res) => {
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
      notes,
      therapistId
    } = req.body;

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

    const appointment = await Appointment.create({
      client: finalClientId,
      clientName: finalClientName,
      therapist: therapistId || null,
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

// @desc    Update appointment
// @route   PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const { type, topic, date, startTime, endTime, isCompleted, status, notes } = req.body;

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

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate("client", "name email phone package");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
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

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
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

// @desc    Get client sessions (Upcoming and Completed) with real MongoDB data
// @route   GET /api/appointments/client-sessions
router.get("/client-sessions", async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    const Therapist = require("../models/Therapist");

    let client = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "unfazed_default_secret_key");
        client = await Client.findById(decoded.id).select("-password");
      } catch {}
    }

    if (!client && req.query.clientId) {
      client = await Client.findById(req.query.clientId).select("-password");
    }

    if (!client) {
      client = await Client.findOne().select("-password");
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    let therapist = null;
    if (client.therapist) {
      therapist = await Therapist.findById(client.therapist).select("-password");
    }
    if (!therapist) {
      therapist = await Therapist.findOne().select("-password");
    }

    const therapistDisplayName = therapist
      ? therapist.name.startsWith("Dr.")
        ? therapist.name
        : `Dr. ${therapist.name}`
      : "Dr. ThuWai";

    const allAppts = await Appointment.find({
      $or: [{ client: client._id }, { clientName: client.name }]
    }).sort({ date: 1, startTime: 1 });

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

// @desc    Client self-booking appointment
// @route   POST /api/appointments/client-book
router.post("/client-book", async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    const Therapist = require("../models/Therapist");

    let client = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "unfazed_default_secret_key");
        client = await Client.findById(decoded.id);
      } catch {}
    }

    if (!client && req.body.clientId) {
      client = await Client.findById(req.body.clientId);
    }

    if (!client) {
      client = await Client.findOne();
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { date, startTime, endTime, type, topic } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({ message: "Date and start time are required" });
    }

    const therapist = await Therapist.findOne();

    const newAppointment = await Appointment.create({
      client: client._id,
      clientName: client.name,
      therapist: therapist ? therapist._id : null,
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
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book session",
      error: error.message
    });
  }
});

module.exports = router;
