const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");
const Client = require("../models/Client");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided."
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unfazed_default_secret_key"
    );

    let user;
    if (decoded.role === "therapist") {
      user = await Therapist.findById(decoded.id).select("-password");
    } else if (decoded.role === "client") {
      user = await Client.findById(decoded.id)
        .select("-password")
        .populate("therapist", "name email specialization qualification experience bio");
    } else {
      user = (await Therapist.findById(decoded.id).select("-password")) ||
             (await Client.findById(decoded.id)
               .select("-password")
               .populate("therapist", "name email specialization qualification experience bio"));
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session invalid. User account no longer exists."
      });
    }

    req.user = user;
    req.role = decoded.role || (user.specialization ? "therapist" : "client");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please sign in again.",
        expired: true
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Please sign in again."
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(" or ")} accounts.`
      });
    }
    next();
  };
};

// Optional protect: populates req.user if valid token provided, but doesn't block unauthenticated requests
const optionalProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unfazed_default_secret_key"
    );

    let user;
    if (decoded.role === "therapist") {
      user = await Therapist.findById(decoded.id).select("-password");
    } else if (decoded.role === "client") {
      user = await Client.findById(decoded.id)
        .select("-password")
        .populate("therapist", "name email specialization qualification experience bio");
    } else {
      user = (await Therapist.findById(decoded.id).select("-password")) ||
             (await Client.findById(decoded.id)
               .select("-password")
               .populate("therapist", "name email specialization qualification experience bio"));
    }

    if (user) {
      req.user = user;
      req.role = decoded.role || (user.specialization ? "therapist" : "client");
    }
  } catch {
    // Ignore invalid or expired token for optional auth
  }
  next();
};

// Resolve therapist ID strictly from authenticated req.user
const getAuthTherapistId = (req) => {
  if (req.user && (req.role === "therapist" || req.user.specialization)) {
    return req.user._id;
  }
  return null;
};

// Resolve client ID strictly from authenticated req.user
const getAuthClientId = (req) => {
  if (req.user && req.role === "client") {
    return req.user._id;
  }
  return null;
};

module.exports = {
  protect,
  authorize,
  optionalProtect,
  getAuthTherapistId,
  getAuthClientId
};
