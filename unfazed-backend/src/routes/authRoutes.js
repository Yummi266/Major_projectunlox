const express = require("express");
const {
  registerTherapist,
  registerClient,
  login,
  loginTherapist,
  loginClient,
  getMe
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth status & info
router.get("/", (req, res) => {
  res.json({
    message: "Unfazed Auth API is active",
    endpoints: {
      registerTherapist: "POST /api/auth/therapist/register",
      registerClient: "POST /api/auth/client/register",
      login: "POST /api/auth/login",
      loginTherapist: "POST /api/auth/therapist/login",
      loginClient: "POST /api/auth/client/login",
      me: "GET /api/auth/me (requires Authorization: Bearer <token>)"
    }
  });
});

router.get("/client", (req, res) => {
  res.json({
    message: "Client Authentication Endpoints",
    endpoints: {
      register: "POST /api/auth/client/register (Body: { name, email, password })",
      login: "POST /api/auth/client/login (Body: { email, password })"
    },
    note: "Browser address bars send GET requests by default. To register or log in, send a POST request with JSON body, or use the frontend at http://localhost:5173/register or /login."
  });
});

router.get("/therapist", (req, res) => {
  res.json({
    message: "Therapist Authentication Endpoints",
    endpoints: {
      register: "POST /api/auth/therapist/register (Body: { name, email, password, specialization })",
      login: "POST /api/auth/therapist/login (Body: { email, password })"
    },
    note: "Browser address bars send GET requests by default. To register or log in, send a POST request with JSON body, or use the frontend at http://localhost:5173/register or /login."
  });
});

// Registration
router.post("/therapist/register", registerTherapist);
router.post("/client/register", registerClient);

// Login
router.post("/login", login);
router.post("/therapist/login", loginTherapist);
router.post("/client/login", loginClient);

// Protected profile route
router.get("/me", protect, getMe);

module.exports = router;