const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Therapist = require("../models/Therapist");
const Client = require("../models/Client");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "unfazed_default_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @desc    Register a new Therapist
// @route   POST /api/auth/therapist/register
const registerTherapist = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingTherapist = await Therapist.findOne({ email: normalizedEmail });
    if (existingTherapist) {
      return res.status(409).json({
        message: "Therapist with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const therapist = await Therapist.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      specialization: specialization ? specialization.trim() : "General Therapy",
      qualification: qualification ? qualification.trim() : "",
      experience: experience || "0"
    });

    const token = generateToken(therapist._id, "therapist");

    res.status(201).json({
      message: "Therapist registered successfully",
      token,
      user: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        role: "therapist",
        specialization: therapist.specialization
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register therapist",
      error: error.message
    });
  }
};

// @desc    Register a new Client
// @route   POST /api/auth/client/register
const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone, therapist } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingClient = await Client.findOne({ email: normalizedEmail });
    if (existingClient) {
      return res.status(409).json({
        message: "Client with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await Client.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      therapist: therapist || null
    });

    const token = generateToken(client._id, "client");

    res.status(201).json({
      message: "Client registered successfully",
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: "client"
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register client",
      error: error.message
    });
  }
};

// @desc    Login (handles therapist or client based on role or email lookup)
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;
    let detectedRole = role;

    if (role === "therapist") {
      user = await Therapist.findOne({ email: normalizedEmail });
    } else if (role === "client") {
      user = await Client.findOne({ email: normalizedEmail });
    } else {
      user = await Therapist.findOne({ email: normalizedEmail });
      detectedRole = "therapist";

      if (!user) {
        user = await Client.findOne({ email: normalizedEmail });
        detectedRole = "client";
      }
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id, detectedRole);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: detectedRole,
        specialization: user.specialization || undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

// @desc    Therapist specific login
// @route   POST /api/auth/therapist/login
const loginTherapist = async (req, res) => {
  req.body.role = "therapist";
  return login(req, res);
};

// @desc    Client specific login
// @route   POST /api/auth/client/login
const loginClient = async (req, res) => {
  req.body.role = "client";
  return login(req, res);
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
      role: req.role
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

module.exports = {
  registerTherapist,
  registerClient,
  login,
  loginTherapist,
  loginClient,
  getMe
};