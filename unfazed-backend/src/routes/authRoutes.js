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