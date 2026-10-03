const Invoice = require("../models/Invoice");

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();

  const count = await Invoice.countDocuments({
    invoiceNumber: new RegExp(`^INV-${year}-`),
  });

  const nextNumber = String(count + 1).padStart(4, "0");

  return `INV-${year}-${nextNumber}`;
};

// GET /api/invoices
const getInvoices = async (req, res, next) => {
  try {
    let invoices;

    if (req.role === "client") {
      invoices = await Invoice.find({
        client: req.user._id,
      })
        .populate("package", "name sessions price")
        .populate("therapist", "name specialization")
        .sort({ issuedAt: -1 });
    } else if (req.role === "therapist") {
      invoices = await Invoice.find({
        therapist: req.user._id,
      })
        .populate("client", "name email")
        .populate("package", "name sessions price")
        .sort({ issuedAt: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/invoices/:id
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("therapist", "name email specialization")
      .populate("package", "name sessions price duration")
      .populate("payment");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Make sure the invoice belongs to the logged-in user
    if (
      req.role === "client" &&
      invoice.client._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this invoice",
      });
    }

    if (
      req.role === "therapist" &&
      invoice.therapist._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this invoice",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInvoiceNumber,
  getInvoices,
  getInvoiceById,
};
