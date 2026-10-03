const express = require("express");

const {
  getInvoices,
  getInvoiceById,
} = require("../controllers/invoiceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("client", "therapist"),
  getInvoices
);

router.get(
  "/:id",
  protect,
  authorize("client", "therapist"),
  getInvoiceById
);

module.exports = router;
