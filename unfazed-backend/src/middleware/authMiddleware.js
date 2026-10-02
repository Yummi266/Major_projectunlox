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
      message: "Not authorized. No token provided."
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
      user = await Client.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        message: "Not authorized. User no longer exists."
      });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token.",
      error: error.message
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({
        message: `Forbidden: Access denied for role '${req.role || "unknown"}'`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
