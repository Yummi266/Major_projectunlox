const Client = require("../models/Client");
const ClientPackage = require("../models/ClientPackage");

const checkSessionQuota = async (req, res, next) => {
  try {
    if (req.role !== "client") {
      return next();
    }

    const client = await Client.findById(req.user._id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (client.totalSessions > 0 && client.sessionsUsed >= client.totalSessions) {
      return res.status(403).json({
        success: false,
        message: "You have used all sessions in your current package. Please purchase or renew your package to book more sessions.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkSessionQuota,
};
