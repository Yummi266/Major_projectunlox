const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const Package = require("../models/Package");
const ClientPackage = require("../models/ClientPackage");
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const { generateInvoiceNumber } = require("./invoiceController");

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================
const createOrder = async (req, res, next) => {
  try {
    if (req.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can purchase packages",
      });
    }

    const client = await Client.findById(req.user._id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    // Find active package
    const selectedPackage = await Package.findOne({
      _id: packageId,
      status: "Active",
    });

    if (!selectedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found or inactive",
      });
    }

    // Make sure the package belongs to the client's therapist if restricted
    if (
      client.therapist &&
      selectedPackage.therapist &&
      client.therapist.toString() !== selectedPackage.therapist.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot purchase another therapist's package",
      });
    }

    const amount = Math.round(selectedPackage.price * 100);
    const keyId = process.env.RAZORPAY_KEY_ID;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `unfazed_${Date.now()}`,
      notes: {
        clientId: client._id.toString(),
        packageId: selectedPackage._id.toString(),
      },
    });

    const payment = await Payment.create({
      client: client._id,
      therapist: selectedPackage.therapist || client.therapist,
      package: selectedPackage._id,
      amount: selectedPackage.price,
      currency: "INR",
      provider: "Razorpay",
      razorpayOrderId: order.id,
      status: "Created",
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      paymentId: payment._id,
      keyId,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// VERIFY PAYMENT
// =====================================================
const verifyPayment = async (req, res, next) => {
  try {
    if (req.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can verify payments",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      client: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Prevent duplicate processing
    if (payment.status === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        payment,
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "Failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "Paid";
    payment.paidAt = new Date();
    await payment.save();

    const selectedPackage = await Package.findById(payment.package);
    if (!selectedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package no longer exists",
      });
    }

    const clientPackage = await ClientPackage.create({
      client: payment.client,
      therapist: payment.therapist,
      package: selectedPackage._id,
      pricePaid: payment.amount,
      totalSessions: selectedPackage.sessions,
      sessionsUsed: 0,
      sessionsRemaining: selectedPackage.sessions,
      status: "Active",
    });

    payment.clientPackage = clientPackage._id;
    await payment.save();

    // Automatically update active package on client document
    const client = await Client.findById(payment.client);
    if (client) {
      client.package = selectedPackage.name;
      client.totalSessions = selectedPackage.sessions;
      client.sessionsUsed = 0;
      await client.save();
    }

    // =================================================
    // CREATE INVOICE
    // =================================================
    const invoiceNumber = await generateInvoiceNumber();
    const invoice = await Invoice.create({
      invoiceNumber,
      client: payment.client,
      therapist: payment.therapist,
      clientPackage: clientPackage._id,
      package: selectedPackage._id,
      payment: payment._id,
      description: `${selectedPackage.name} - ${selectedPackage.sessions} therapy sessions`,
      amount: payment.amount,
      currency: payment.currency,
      status: "Paid",
      issuedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified, package activated, and invoice generated successfully",
      payment,
      clientPackage,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET CLIENT PAYMENTS HISTORY
// =====================================================
const getMyPayments = async (req, res, next) => {
  try {
    if (req.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can view payment history",
      });
    }

    const payments = await Payment.find({ client: req.user._id })
      .populate("package", "name sessions price duration")
      .populate("therapist", "name specialization")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyPayments,
};

