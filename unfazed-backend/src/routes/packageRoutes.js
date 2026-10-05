const express = require("express");
const Package = require("../models/Package");
const Client = require("../models/Client");
const { protect, authorize, optionalProtect } = require("../middleware/authMiddleware");

const router = express.Router();

const DEFAULT_PACKAGES = [
  {
    name: "Starter Package",
    description: "Ideal for introductory therapy, targeted goal-setting, or short-term support.",
    sessions: 3,
    duration: "50 min",
    price: 4500,
    currency: "₹",
    status: "Active",
    icon: "◇",
    features: ["3 Video or Chat sessions", "Session intake & notes", "Flexible scheduling"]
  },
  {
    name: "Standard Package",
    description: "Our most popular care plan for ongoing personal growth and clinical progress.",
    sessions: 6,
    duration: "50 min",
    price: 9000,
    currency: "₹",
    status: "Active",
    icon: "◇",
    features: ["6 Video or Chat sessions", "Dedicated clinical follow-ups", "Direct messaging access"]
  },
  {
    name: "Extended Package",
    description: "Comprehensive multi-month support for deep therapeutic journeys and transformation.",
    sessions: 10,
    duration: "50 min",
    price: 14000,
    currency: "₹",
    status: "Active",
    icon: "◇",
    features: ["10 Video or Chat sessions", "Priority slot booking", "Comprehensive notes & progress review"]
  },
  {
    name: "Single Session",
    description: "Single flexible consultation or maintenance session when you need immediate guidance.",
    sessions: 1,
    duration: "50 min",
    price: 1500,
    currency: "₹",
    status: "Active",
    icon: "◇",
    features: ["1 50-min Video or Chat consultation", "Direct follow-up summary"]
  }
];

async function ensureSeedPackages() {
  const count = await Package.countDocuments();
  if (count === 0) {
    await Package.insertMany(DEFAULT_PACKAGES);
  }
}

router.get("/", optionalProtect, async (req, res) => {
  try {
    await ensureSeedPackages();

    const packages = await Package.find().sort({ price: 1 });
    let clients = [];

    if (req.user && req.role === "therapist") {
      clients = await Client.find({ therapist: req.user._id }).select(
        "name email package sessionsUsed totalSessions isActive"
      );
    }

    const enrichedPackages = packages.map((pkg) => {
      const pkgObj = pkg.toObject();
      const enrolled = clients.filter((c) => {
        if (!c.package) return false;
        const cPkg = c.package.toLowerCase().trim();
        const pName = pkg.name.toLowerCase().trim();
        return cPkg === pName || cPkg.includes(pName) || pName.includes(cPkg);
      });

      pkgObj.clients = enrolled.length;
      pkgObj.enrolledClients = enrolled.map((c) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        sessionsUsed: c.sessionsUsed || 0,
        totalSessions: c.totalSessions || pkg.sessions,
        isActive: c.isActive
      }));

      return pkgObj;
    });

    res.status(200).json({
      count: enrichedPackages.length,
      packages: enrichedPackages
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch packages",
      error: error.message
    });
  }
});

router.get("/:id", optionalProtect, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    let clients = [];
    if (req.user && req.role === "therapist") {
      clients = await Client.find({
        therapist: req.user._id,
        package: { $regex: new RegExp("^" + pkg.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }
      }).select("name email phone sessionsUsed totalSessions createdAt");
    }

    res.status(200).json({
      package: pkg,
      enrolledClients: clients
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch package",
      error: error.message
    });
  }
});

router.post("/", protect, authorize("therapist"), async (req, res) => {
  try {
    const { name, sessions, duration, price, currency, status, description, features } = req.body;

    if (!name || !price || !sessions) {
      return res.status(400).json({ message: "Name, sessions count, and price are required" });
    }

    const existing = await Package.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "A package with this name already exists" });
    }

    const newPackage = await Package.create({
      name: name.trim(),
      sessions: Number(sessions),
      duration: duration ? duration.trim() : "50 min",
      price: Number(price),
      currency: currency ? currency.trim() : "₹",
      status: status || "Active",
      description: description ? description.trim() : "",
      features: Array.isArray(features) ? features : []
    });

    res.status(201).json({
      message: "Package created successfully",
      package: newPackage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create package",
      error: error.message
    });
  }
});

router.put("/:id", protect, authorize("therapist"), async (req, res) => {
  try {
    const { name, sessions, duration, price, currency, status, description, features } = req.body;

    const existingPackage = await Package.findById(req.params.id);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (name && name.trim().toLowerCase() !== existingPackage.name.toLowerCase()) {
      const duplicate = await Package.findOne({ name: name.trim() });
      if (duplicate) {
        return res.status(409).json({ message: "Another package with this name already exists" });
      }

      await Client.updateMany(
        { package: existingPackage.name },
        { package: name.trim() }
      );
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name: name.trim() }),
        ...(sessions !== undefined && { sessions: Number(sessions) }),
        ...(duration && { duration: duration.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(currency && { currency: currency.trim() }),
        ...(status && { status }),
        ...(description !== undefined && { description: description.trim() }),
        ...(features && { features })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Package updated successfully",
      package: updatedPackage
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update package",
      error: error.message
    });
  }
});

router.delete("/:id", protect, authorize("therapist"), async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const enrolledClientsCount = await Client.countDocuments({
      package: { $regex: new RegExp("^" + pkg.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }
    });

    if (enrolledClientsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete package: ${enrolledClientsCount} client(s) currently enrolled. You can set its status to 'Inactive' instead.`
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Package deleted successfully",
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete package",
      error: error.message
    });
  }
});

module.exports = router;
