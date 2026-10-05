const express = require("express");
const {
  createOrder,
  verifyPayment,
  getMyPayments,
} = require("../controllers/paymentController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Unfazed Payments API",
    endpoints: {
      createOrder: {
        method: "POST",
        path: "/api/payments/create-order",
        auth: "Bearer <client_token>",
        body: { packageId: "<package_id>" },
        description: "Creates a new Razorpay payment order for a package",
      },
      verifyPayment: {
        method: "POST",
        path: "/api/payments/verify",
        auth: "Bearer <client_token>",
        body: {
          razorpay_order_id: "<order_id>",
          razorpay_payment_id: "<payment_id>",
          razorpay_signature: "<signature>",
        },
        description: "Verifies Razorpay payment signature and updates client quota",
      },
      myHistory: {
        method: "GET",
        path: "/api/payments/my-history",
        auth: "Bearer <client_token>",
        description: "Returns client's transaction history",
      },
    },
  });
});

router.get("/create-order", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Cannot GET /api/payments/create-order. This endpoint requires an HTTP POST request with an authenticated client Bearer token.",
    requiredMethod: "POST",
    endpoint: "/api/payments/create-order",
    headers: {
      Authorization: "Bearer <your_client_jwt_token>",
      "Content-Type": "application/json",
    },
    body: {
      packageId: "<ObjectId of the therapy package>",
    },
    curlExample: 'curl -X POST http://localhost:5000/api/payments/create-order -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d \'{"packageId": "<PACKAGE_ID>"}\'',
  });
});

router.post(
  "/create-order",
  protect,
  authorize("client"),
  createOrder
);

router.post(
  "/verify",
  protect,
  authorize("client"),
  verifyPayment
);

router.get(
  "/my-history",
  protect,
  authorize("client"),
  getMyPayments
);

module.exports = router;

