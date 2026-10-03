const Razorpay = require("razorpay");

let instance = null;

const getRazorpay = () => {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      const error = new Error(
        "Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file."
      );
      error.statusCode = 500;
      throw error;
    }

    instance = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return instance;
};

// Lazy-loaded proxy so server doesn't crash on startup if credentials aren't yet in .env
const razorpay = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getRazorpay();
      const val = client[prop];
      if (typeof val === "function") {
        return val.bind(client);
      }
      return val;
    },
  }
);

module.exports = razorpay;
