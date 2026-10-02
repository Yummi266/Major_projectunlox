const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const therapistRoutes = require("./routes/therapistRoutes");
const clientRoutes = require("./routes/clientRoutes");
const noteRoutes = require("./routes/noteRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const packageRoutes = require("./routes/packageRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Unfazed API is running",
    endpoints: {
      therapists: "/api/therapists",
      clients: "/api/clients",
      notes: "/api/notes",
      appointments: "/api/appointments",
      messages: "/api/messages",
      packages: "/api/packages",
      analytics: "/api/analytics",
      auth: {
        registerTherapist: "POST /api/auth/therapist/register",
        registerClient: "POST /api/auth/client/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (requires Bearer token)"
      },
      dashboard: {
        overview: "GET /api/dashboard/overview",
        therapist: "GET /api/dashboard/therapist (requires Bearer token)",
        client: "GET /api/dashboard/client (requires Bearer token)"
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;